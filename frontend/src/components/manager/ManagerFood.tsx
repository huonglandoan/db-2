import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Plus, Search, Edit, Trash2, UtensilsCrossed, Upload, X, Store } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ImageWithFallback } from "../resize/ImageWithFallback";

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

const initialFoods: Food[] = [
  { id: "MA001", name: "Phở bò đặc biệt", category: "Ăn sáng", price: 65000, quantity: 10, image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400", status: "Còn hàng", branchId: "1" },
  { id: "MA002", name: "Bún chả Hà Nội", category: "Món chính", price: 55000, quantity: 15, image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400", status: "Còn hàng", branchId: "1" },
  { id: "MA003", name: "Gỏi cuốn tôm thịt", category: "Khai vị", price: 35000, quantity: 20, image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400", status: "Còn hàng", branchId: "1" },
  { id: "MA004", name: "Chả giò chiên", category: "Khai vị", price: 40000, quantity: 25, image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400", status: "Còn hàng", branchId: "2" },
  { id: "MA005", name: "Cơm rang dương châu", category: "Món chính", price: 50000, quantity: 30, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", status: "Còn hàng", branchId: "2" },
  { id: "MA006", name: "Canh chua cá lóc", category: "Canh", price: 70000, quantity: 5, image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400", status: "Còn hàng", branchId: "2" },
  { id: "MA007", name: "Trà đá", category: "Đồ uống", price: 5000, quantity: 50, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", status: "Còn hàng", branchId: "3" },
  { id: "MA008", name: "Nước ngọt", category: "Đồ uống", price: 15000, quantity: 60, image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400", status: "Còn hàng", branchId: "3" },
  { id: "MA009", name: "Chè ba màu", category: "Tráng miệng", price: 25000, quantity: 70, image: "https://images.unsplash.com/photo-1563588558991-a0e48df9e15e?w=400", status: "Còn hàng", branchId: "3" },
  { id: "MA010", name: "Bánh mì pate", category: "Ăn sáng", price: 25000, quantity: 80, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", status: "Còn hàng", branchId: "4" },
  { id: "MA011", name: "Cà phê sữa đá", category: "Đồ uống", price: 30000, quantity: 90, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400", status: "Còn hàng", branchId: "4" },
];

const categories = ["Tất cả", "Ăn sáng", "Món chính", "Khai vị", "Canh", "Tráng miệng", "Đồ uống"];

const branches = [
  { id: "1", name: "Chi nhánh Quận 1" },
  { id: "2", name: "Chi nhánh Quận 3" },
  { id: "3", name: "Chi nhánh Bình Thạnh" },
  { id: "4", name: "Chi nhánh Tân Bình" },
];

interface FoodManagementProps {
  currentBranchId: string;
}

export function ManagerFood({ currentBranchId }: FoodManagementProps) {
  const [foods, setFoods] = useState<Food[]>(initialFoods);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Filter foods theo chi nhánh hiện tại
  const branchFoods = foods.filter(food => food.branchId === currentBranchId);

  const filteredFoods = branchFoods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteFood = (id: string) => {
    setFoods(foods.filter(f => f.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentBranch = branches.find(b => b.id === currentBranchId);

  return (
    <div className="space-y-6">
      <div>
        <h1>Quản lý món ăn</h1>
        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <Store className="h-4 w-4" />
          <p>
            {currentBranch?.name || "Chọn chi nhánh"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Tổng món ăn</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branchFoods.length}</div>
            <p className="text-xs text-muted-foreground">
              Món ăn chi nhánh này
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Món chính</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branchFoods.filter(f => f.category === "Món chính").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Món ăn chính
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Ăn sáng</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branchFoods.filter(f => f.category === "Ăn sáng").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Món ăn sáng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Đồ uống</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branchFoods.filter(f => f.category === "Đồ uống").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Thức uống
            </p>
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
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm món ăn
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm món ăn mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="rounded-lg bg-accent/50 p-3">
                    <p className="text-sm">
                      <span className="font-medium">Chi nhánh: </span>
                      <span className="text-primary">{currentBranch?.name}</span>
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="food-name">Tên món ăn</Label>
                      <Input id="food-name" placeholder="Nhập tên món ăn" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Phân loại món</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Chọn loại món" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="an-sang">Ăn sáng</SelectItem>
                          <SelectItem value="khai-vi">Khai vị</SelectItem>
                          <SelectItem value="mon-chinh">Món chính</SelectItem>
                          <SelectItem value="canh">Canh</SelectItem>
                          <SelectItem value="trang-mieng">Tráng miệng</SelectItem>
                          <SelectItem value="do-uong">Đồ uống</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá bán (VNĐ)</Label>
                    <Input id="price" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Số lượng</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Hình ảnh món ăn</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {imagePreview && (
                      <div className="relative mt-2 w-full h-48 rounded-lg overflow-hidden border border-border">
                        <ImageWithFallback
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setImagePreview("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsFoodDialogOpen(false);
                      setImagePreview("");
                    }}>
                      Hủy
                    </Button>
                    <Button onClick={() => {
                      setIsFoodDialogOpen(false);
                      setImagePreview("");
                    }}>
                      Thêm món ăn
                    </Button>
                  </div>
                </div>
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
                          <ImageWithFallback
                            src={food.image}
                            alt={food.name}
                            className="w-full h-full object-cover"
                          />
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFood(food.id)}
                          >
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
