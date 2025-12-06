import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Upload, X } from "lucide-react";
import { ImageWithFallback } from "../../resize/ImageWithFallback";
import type { Food } from "../food/ManagerFood";

const API_BASE_URL = "http://localhost:3000";
interface FoodFormProps {
  currentBranchId: string | null;
  categories: string[];
  foodData?: Food; 
  onAdded: (food: Food) => void;
  onClose: () => void;
}

export function FoodForm({ currentBranchId, categories, foodData, onAdded, onClose }: FoodFormProps) {
  const [name, setName] = useState(foodData?.name ?? "");
  const [price, setPrice] = useState<string>(
  foodData?.price != null ? String(foodData.price) : ""
);
  const [category, setCategory] = useState(foodData?.category ?? categories[1] ?? "Món chính");
  const [quantity, setQuantity] = useState<number | "">(foodData?.quantity ?? 0);
  const [status, setStatus] = useState(foodData?.status ?? "Available");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(foodData?.image ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
  if (foodData) {
    setName(foodData.name);
    setPrice(
      foodData.price != null
        ? String(Number(foodData.price))
        : ""
    );
    setCategory(foodData.category);
    setQuantity(foodData.quantity);
    setImagePreview(foodData.image);
    setImageFile(null);
  }
}, [foodData]);

useEffect(() => {
  if (!imageFile) return;
  const url = URL.createObjectURL(imageFile);
  setImagePreview(url);
  return () => URL.revokeObjectURL(url);
}, [imageFile]);

const handleImageChange = (file: File | null) => {
  if (file) {
    setImageFile(file);
  } else {
    setImageFile(null);
    setImagePreview(null);
  }
};

const handleAddOrUpdate = async (): Promise<Food> => {
  if (!currentBranchId) throw new Error("Chi nhánh không xác định");

  const fd = new FormData();
  fd.append("name", name);
  fd.append("price", String(price || 0));
  fd.append("category", category);
  fd.append("quantity", String(quantity || 0));
  fd.append("branchId", currentBranchId);
  if (imageFile) fd.append("image", imageFile);

  const url = foodData ? `http://localhost:3000/food/${foodData.id}` : "http://localhost:3000/food";
  const method = foodData ? "PATCH" : "POST";

  const response = await fetch(url, { method, body: fd });
  if (!response.ok) {
    
    const errorData = await response.json().catch(() => ({ error: "Lỗi không xác định." }));
    throw new Error(errorData.error || `Lỗi ${response.status}: Vui lòng thử lại.`);
  }

  const updatedFood = await response.json(); // backend trả món vừa thêm/cập nhật
  if (!updatedFood || !updatedFood.Food_ID) throw new Error("Không tìm thấy món ăn vừa thêm/cập nhật");

  return {
    id: String(updatedFood.Food_ID),
    name: updatedFood.Food_name,
    category: updatedFood.Category,
    price: Number(updatedFood.Unit_price),
    quantity: updatedFood.Quantity,
    status: updatedFood.Availability_status, // lấy trực tiếp từ backend
    image: updatedFood.Image,
    branchId: currentBranchId,
  };
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const food = await handleAddOrUpdate();
    onAdded(food); // cập nhật state parent ngay lập tức
    onClose();
    alert(foodData ? "Cập nhật món ăn thành công!" : "Thêm món ăn thành công!");
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error 
      ? err.message // Lấy thông báo lỗi chi tiết từ trigger (VD: "Giá món ăn phải >= 0")
      : foodData ? "Cập nhật món thất bại." : "Thêm món thất bại."; // Thông báo chung nếu không phải Error

    alert(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="food-name">Tên món</Label>
        <Input id="food-name" value={name} onChange={e => setName(e.target.value)} required />
      </div>

       <div>
        <Label htmlFor="category">Phân loại</Label>
        <select
          id="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          {categories.filter(c => c !== "Tất cả").map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="price">Giá bán</Label>
        <Input
            id="price"
            type="text"
            inputMode="numeric"
            value={price}
            onChange={e => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) setPrice(val);
            }}
          />
      </div>

      <div>
        <Label htmlFor="quantity">Số lượng</Label>
        <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
      </div>

      {/* Phần Upload ảnh */}
      <div>
  <Label>Hình ảnh</Label>
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      type="button"
      onClick={() => document.getElementById("file-upload")?.click()}
      className="flex items-center gap-1"
    >
      <Upload size={16} /> Chọn ảnh
    </Button>
    <input
      id="file-upload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={e => handleImageChange(e.target.files?.[0] ?? null)}
    />
  </div>
  {imagePreview && (
    <div className="relative w-48 h-48 mt-2">
      <ImageWithFallback
        src={imagePreview}
        alt="preview"
        className="object-cover w-full h-full rounded-md"
      />
      <Button
        type="button"
        className="absolute top-2 right-2 h-8 w-8 rounded-full"
        onClick={() => handleImageChange(null)}
      >
        <X />
      </Button>
    </div>
  )}
</div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>Hủy</Button>
        <Button type="submit" disabled={isSubmitting}>Xác nhận</Button>
      </div>
    </form>
  );
}
