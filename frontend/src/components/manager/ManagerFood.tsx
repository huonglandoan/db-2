import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Plus, Search, Edit, Trash2, UtensilsCrossed, Store } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ImageWithFallback } from "../resize/ImageWithFallback";

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
      if (!currentBranchId) {
        setFoods([]);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/food?branchId=${currentBranchId}`);
        if (!response.ok) throw new Error("Lỗi tải món ăn");
        const data = await response.json();
        const mappedFoods: Food[] = data.map((r: any) => ({
          id: String(r.Food_ID ?? r.id),
          name: r.Food_name ?? r.name,
          category: r.Category ?? r.category,
          price: Number(r.Unit_price ?? r.price ?? 0),
          quantity: Number(r.Quantity ?? r.quantity ?? 0),
          image: r.Image ?? r.image ?? "",
          status: r.Availability_status ?? r.status ?? "OutOfStock",
          branchId: String(r.Branch_ID ?? r.branch_id),
        }));
        setFoods(mappedFoods);
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

  const handleDeleteFood = (id: string) => {
    setFoods(foods.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Quản lý món ăn</h1>
        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <Store className="h-4 w-4" />
          <p>{currentAddress}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle>Tổng món ăn</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foods.length}</div>
            <p className="text-xs text-muted-foreground">Món ăn chi nhánh này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle>Món chính</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {foods.filter(f => f.category === "Món chính").length}
            </div>
            <p className="text-xs text-muted-foreground">Món ăn chính</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle>Ăn sáng</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {foods.filter(f => f.category === "Ăn sáng").length}
            </div>
            <p className="text-xs text-muted-foreground">Món ăn sáng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle>Đồ uống</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {foods.filter(f => f.category === "Đồ uống").length}
            </div>
            <p className="text-xs text-muted-foreground">Thức uống</p>
          </CardContent>
        </Card>
      </div>

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
                {/* Form thêm món ăn */}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
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
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Mã món</TableHead>
                  <TableHead>Tên món ăn</TableHead>
                  <TableHead>Phân loại</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Giá bán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFoods.length > 0 ? (
                  filteredFoods.map((food) => (
                    <TableRow key={food.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                          <ImageWithFallback src={food.image} alt={food.name} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>{food.id}</TableCell>
                      <TableCell>{food.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{food.category}</Badge>
                      </TableCell>
                      <TableCell>{food.quantity}</TableCell>
                      <TableCell>{food.price.toLocaleString('vi-VN')}đ</TableCell>
                      <TableCell>
                        <Badge variant="default">{food.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteFood(food.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
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
