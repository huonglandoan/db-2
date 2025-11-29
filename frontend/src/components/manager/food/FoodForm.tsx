import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { ImageWithFallback } from "../../resize/ImageWithFallback";
import { Upload, X } from "lucide-react";

interface FoodFormProps {
  currentBranchId: string | null;
  categories: string[];
  onAdded: (food: any) => void;
  onClose: () => void;
}

export function FoodForm({ currentBranchId, categories, onAdded, onClose }: FoodFormProps) {
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [newCategory, setNewCategory] = useState(categories[1] ?? "Món chính");
  const [newQuantity, setNewQuantity] = useState<number | "">();
  const [newStatus, setNewStatus] = useState("Available");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
    } else {
      setNewImageFile(null);
      setNewImagePreview(null);
    }
  };

  useEffect(() => {
    if (!newImageFile) {
      setNewImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(newImageFile);
    setNewImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [newImageFile]);

  const mapStatusToDB = (status: string) => (status === "Available" ? "Còn hàng" : "Hết hàng");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBranchId) {
      alert("Vui lòng chọn chi nhánh trước khi thêm món.");
      return;
    }
    setIsSubmitting(true);

    try {
      let response;
      if (newImageFile) {
        const fd = new FormData();
        fd.append("name", newName);
        fd.append("price", String(newPrice || 0));
        fd.append("category", newCategory);
        fd.append("quantity", String(newQuantity || 0));
        fd.append("status", mapStatusToDB(newStatus));
        fd.append("branchId", String(currentBranchId));
        fd.append("image", newImageFile);
        response = await fetch(`http://localhost:3000/food`, { method: "POST", body: fd });
      } else {
        const body = { name: newName, price: Number(newPrice || 0), category: newCategory, quantity: Number(newQuantity || 0), status: newStatus, branchId: currentBranchId };
        response = await fetch(`http://localhost:3000/food`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      onAdded(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Thêm món thất bại. Kiểm tra console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="food-name">Tên món</Label>
        <Input id="food-name" value={newName} onChange={e => setNewName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="category">Phân loại</Label>
        <Select onValueChange={(v) => setNewCategory(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại món" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="price">Giá bán</Label>
        <Input id="price" type="number" value={newPrice} onChange={e => setNewPrice(Number(e.target.value))} />
      </div>
      <div>
        <Label htmlFor="quantity">Số lượng</Label>
        <Input id="quantity" type="number" value={newQuantity} onChange={e => setNewQuantity(Number(e.target.value))} />
      </div>
      <div>
        <Label htmlFor="image">Hình ảnh</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
        {newImagePreview && (
          <div className="relative w-48 h-48">
            <ImageWithFallback src={newImagePreview} alt="preview" className="object-cover w-full h-full" />
            <Button type="button" onClick={() => setNewImagePreview("")}><X /></Button>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>Hủy</Button>
        <Button type="submit" disabled={isSubmitting}>Thêm món</Button>
      </div>
    </form>
  );
}
