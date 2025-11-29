import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Upload, X } from "lucide-react";
import { ImageWithFallback } from "../../resize/ImageWithFallback";
import type { Food } from "../food/ManagerFood";
interface FoodFormProps {
  currentBranchId: string | null;
  categories: string[];
  foodData?: Food; // nếu có thì là update
  onAdded: (food: any) => void;
  onClose: () => void;
}


export function FoodForm({ currentBranchId, categories, foodData, onAdded, onClose }: FoodFormProps) {
  const [name, setName] = useState(foodData?.name ?? "");
  const [price, setPrice] = useState<number | "">(foodData?.price ?? "");
  const [category, setCategory] = useState(foodData?.category ?? categories[1] ?? "Món chính");
  const [quantity, setQuantity] = useState<number | "">(foodData?.quantity ?? 0);
  const [status, setStatus] = useState(foodData?.status ?? "Available");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(foodData?.image ?? null);
  
  useEffect(() => {
    // Khi props `food` thay đổi (mở món khác để edit) thì cập nhật state
    if (foodData) {
      setName(foodData.name);
      setPrice(foodData.price);
      setCategory(foodData.category);
      setQuantity(foodData.quantity);
      setStatus(foodData.status);
      setImagePreview(foodData.image);
      setImageFile(null);
    }
  }, [foodData]);

  const handleImageChange = (file: File | null) => {
  if (file) {
    setImageFile(file);
  } else {
    setImageFile(null);
    setImagePreview(null);
  }
};
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const mapStatusToDB = (s: string) => (s === "Available" ? "Còn hàng" : "Hết hàng");

  const handleAdd = async (): Promise<Food> => {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("price", String(price || 0));
  fd.append("category", category);
  fd.append("quantity", String(quantity || 0));
  fd.append("status", mapStatusToDB(status));
  if (imageFile) fd.append("image", imageFile);

  const response = await fetch("http://localhost:3000/food", { method: "POST", body: fd });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();

  return {
    id: String(data.Food_ID),
    name: data.Food_name,
    category: data.Category,
    price: data.Unit_price,
    quantity: data.Quantity,
    status: data.Availability_status,
    image: data.Image,
    branchId: currentBranchId!,
  };
};

const handleUpdate = async (): Promise<Food> => {
  if (!foodData?.id) throw new Error("Không xác định món ăn");

  const fd = new FormData();
  fd.append("name", name);
  fd.append("price", String(price || 0));
  fd.append("category", category);
  fd.append("quantity", String(quantity || 0));
  fd.append("status", mapStatusToDB(status));
  if (imageFile) fd.append("image", imageFile);

  const response = await fetch(`http://localhost:3000/food/${foodData.id}`, { method: "PATCH", body: fd });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();

  return {
    id: String(data.Food_ID ?? foodData.id),
    name: data.Food_name ?? name,
    category: data.Category ?? category,
    price: data.Unit_price ?? price,
    quantity: data.Quantity ?? quantity,
    status: data.Availability_status ?? status,
    image: data.Image ?? imagePreview ?? "",
    branchId: currentBranchId ?? foodData.branchId,
  };
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    let food: Food;
    if (foodData) {
      food = await handleUpdate();
      alert("Cập nhật món ăn thành công!");
    } else {
      food = await handleAdd();
      alert("Thêm món ăn thành công!");
    }

    onAdded(food); // cập nhật state parent
    onClose();     // đóng dialog
  } catch (err) {
    console.error(err);
    alert(foodData ? "Cập nhật món thất bại." : "Thêm món thất bại.");
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
        <Input id="price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
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
