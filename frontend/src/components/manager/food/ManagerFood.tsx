import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Badge } from "../../ui/badge";
import { Plus, Search, UtensilsCrossed, Store, Edit, Trash2 } from "lucide-react";
import { FoodForm } from "../food/FoodForm";
import { ImageWithFallback } from "../../resize/ImageWithFallback";

const API_BASE_URL = "http://localhost:3000";

interface Food {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  status: string; 
  branchId: string;
}

interface FoodManagementProps {
  currentBranchId: string | null;
  currentAddress: string | null;
}

const categories = ["Tất cả", "Ăn sáng", "Món chính", "Tráng miệng", "Đồ uống"];

export function ManagerFood({ currentBranchId, currentAddress }: FoodManagementProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);

  // Load món ăn khi chi nhánh thay đổi
  useEffect(() => {
    const fetchFoods = async () => {
      if (!currentBranchId) return setFoods([]);
      try {
        const res = await fetch(`${API_BASE_URL}/food?branchId=${currentBranchId}`);
        if (!res.ok) throw new Error("Lỗi tải món ăn");
        const data = await res.json();
        const mapped: Food[] = data.map((r: any) => ({
          id: String(r.Food_ID ?? r.id),
          name: r.Food_name ?? r.name,
          category: r.Category ?? r.category,
          price: Number(r.Unit_price ?? r.price ?? 0),
          quantity: Number(r.Quantity ?? r.quantity ?? 0),
          image: r.Image ?? r.image ?? "",
          status: r.Availability_status ?? r.status ?? "OutOfStock",
          branchId: String(r.Branch_ID ?? r.branch_id),
        }));
        setFoods(mapped);
      } catch (err) {
        console.error(err);
        setFoods([]);
      }
    };
    fetchFoods();
  }, [currentBranchId, currentAddress]);

  const filteredFoods = foods.filter(food => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteFood = async (id: string) => {
  if (!confirm("Bạn có chắc muốn xóa món này?")) return;

  try {
    const response = await fetch(`${API_BASE_URL}/food/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Xóa món thất bại");
    }
    // Xóa khỏi state local ngay lập tức
    setFoods(prev => prev.filter(f => f.id !== id));
  } catch (err) {
    console.error(err);
    alert("Không thể xóa món ăn. Kiểm tra console để biết thêm chi tiết.");
  }
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Quản lý món ăn</h1>
        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <Store className="h-4 w-4" />
          <p>{currentAddress}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {["Tổng món ăn", "Món chính", "Ăn sáng", "Đồ uống"].map((title, idx) => {
          const count = title === "Tổng món ăn" ? foods.length :
                        foods.filter(f => f.category === title).length;
          return (
            <Card key={title}>
              <CardHeader className="flex justify-between pb-2">
                <CardTitle>{title}</CardTitle>
                <UtensilsCrossed className={`h-4 w-4 ${idx === 0 ? "text-muted-foreground" : "text-primary"}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                  {title === "Tổng món ăn" ? "Món ăn chi nhánh này" : title}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Food List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách món ăn</CardTitle>
            <Dialog open={isFoodDialogOpen} onOpenChange={setIsFoodDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Thêm món ăn
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm món ăn mới</DialogTitle>
                </DialogHeader>
                <FoodForm
                  currentBranchId={currentBranchId}
                  categories={categories}
                  onAdded={(food) => setFoods(prev => [food, ...prev])}
                  onClose={() => setIsFoodDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search & Filter */}
          <div className="mb-4 space-y-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm món ăn..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Hình ảnh", "Mã món", "Tên món ăn", "Phân loại", "Số lượng", "Giá bán", "Trạng thái", "Thao tác"].map(h => (
                    <TableHead key={h} className={h === "Thao tác" ? "text-right" : ""}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFoods.length > 0 ? filteredFoods.map(food => (
                  <TableRow key={food.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                        <ImageWithFallback src={food.image} alt={food.name} className="w-full h-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>{food.id}</TableCell>
                    <TableCell>{food.name}</TableCell>
                    <TableCell><Badge variant="outline">{food.category}</Badge></TableCell>
                    <TableCell>{food.quantity}</TableCell>
                    <TableCell>{food.price.toLocaleString('vi-VN')}đ</TableCell>
                    <TableCell><Badge variant="default">{food.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteFood(food.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Không có món ăn nào cho chi nhánh này
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
