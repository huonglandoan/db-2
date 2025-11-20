import { useState, useEffect} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Plus, Search, Edit, Trash2, UtensilsCrossed, CalendarDays, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { ImageWithFallback } from "./resize/ImageWithFallback";

interface Food {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  status: string;
}

interface MenuDaily {
  id: string;
  date: string;
  dishes: { foodId: string; name: string; quantity: number }[];
  totalPrice: number;
  available: number;
}

const categories = ["Tất cả", "Ăn sáng", "Món chính", "Khai vị", "Canh", "Tráng miệng", "Đồ uống"];
const API_BASE_URL = 'http://localhost:3000';

export function ProductManagement() {

  const [foods, setFoods] = useState<Food[]>([]);
  const [menuDaily, setMenuDaily] = useState<MenuDaily[]>([]);

  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [menuItems, setMenuItems] = useState<{ foodId: string; quantity: number }[]>([]);
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("Tất cả");

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Tải Món ăn
      const foodResponse = await fetch(`/food`); 
      const foodRawData: Food[] = await foodResponse.json();

      const mappedFoods: Food[] = foodRawData.map((item: any) => ({
        id: item.Food_ID,          // Ánh xạ Food_ID -> id
        name: item.Food_name,      // Ánh xạ Food_name -> name
        category: item.Category,
        price: parseFloat(item.Unit_price), // Ánh xạ Unit_price -> price
        description: item.Description,
        image: item.Image_URL,     // Ánh xạ Image_URL -> image
        status: item.Status,
      }));
      setFoods(mappedFoods);

      // Tải Menu hàng ngày
      const menuResponse = await fetch(`/menu-daily`);
      const menuData: MenuDaily[] = await menuResponse.json();
      setMenuDaily(menuData);
      
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu từ máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteFood = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) return;
    
    try {
      await fetch(`${API_BASE_URL}/food/${id}`, { method: 'DELETE' });
      fetchData(); // Tải lại danh sách sau khi xóa
    } catch (e) {
      setError(`Lỗi xóa món ăn: ${e.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <UtensilsCrossed className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xl text-primary font-medium">Đang tải dữ liệu từ máy chủ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-300 text-red-700 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold">Lỗi Kết Nối Dữ Liệu </h2>
        <p className="text-lg">Không thể tải dữ liệu. Vui lòng kiểm tra Backend Server.</p>
        <p className="font-mono text-sm">Chi tiết lỗi: {error}</p>
        <Button onClick={fetchData} variant="secondary">
          Thử lại
        </Button>
      </div>
    );
  }

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteMenu = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa menu này không?")) return;

    try {
      await fetch(`${API_BASE_URL}/menu-daily/${id}`, { method: 'DELETE' });
      fetchData(); // Tải lại danh sách sau khi xóa
    } catch (e) {
      setError(`Lỗi xóa menu: ${e.message}`);
    }
  };

  const filteredFoodsForMenu = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = menuCategoryFilter === "Tất cả" || food.category === menuCategoryFilter;
    return matchesSearch && matchesCategory;
  });


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

  const addMenuItem = (foodId: string) => {
    const existingItem = menuItems.find(item => item.foodId === foodId);
    if (!existingItem) {
      setMenuItems([...menuItems, { foodId, quantity: 1 }]);
    }
  };

  const toggleMenuItem = (foodId: string) => {
    const existingItem = menuItems.find(item => item.foodId === foodId);
    if (existingItem) {
      setMenuItems(menuItems.filter(item => item.foodId !== foodId));
    } else {
      setMenuItems([...menuItems, { foodId, quantity: 1 }]);
    }
  };

  const isMenuItemSelected = (foodId: string) => {
    return menuItems.some(item => item.foodId === foodId);
  };

  const updateMenuItemQuantity = (foodId: string, quantity: number) => {
    setMenuItems(menuItems.map(item => 
      item.foodId === foodId ? { ...item, quantity } : item
    ));
  };

  const removeMenuItem = (foodId: string) => {
    setMenuItems(menuItems.filter(item => item.foodId !== foodId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Quản lý món ăn</h1>
        <p className="text-muted-foreground">
          Quản lý thực đơn và menu hàng ngày
        </p>
      </div>

      <Tabs defaultValue="foods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="foods">
            <UtensilsCrossed className="mr-2 h-4 w-4" />
            Món ăn
          </TabsTrigger>
          <TabsTrigger value="menu-daily">
            <CalendarDays className="mr-2 h-4 w-4" />
            Menu hàng ngày
          </TabsTrigger>
        </TabsList>

        {/* Tab Món ăn */}
        <TabsContent value="foods" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Tổng món ăn</CardTitle>
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{foods.length}</div>
                <p className="text-xs text-muted-foreground">
                  Món ăn trong menu
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
                  {foods.filter(f => f.category === "Món chính").length}
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
                  {foods.filter(f => f.category === "Ăn sáng").length}
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
                  {foods.filter(f => f.category === "Đồ uống").length}
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
                        <Label htmlFor="description">Mô tả món ăn</Label>
                        <Textarea id="description" placeholder="Mô tả chi tiết về món ăn" rows={3} />
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
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Giá bán</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFoods.map((food) => (
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
                        <TableCell className="max-w-xs truncate">{food.description}</TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Menu hàng ngày */}
        <TabsContent value="menu-daily" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Menu hàng ngày</CardTitle>
                <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm menu
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Thêm menu hàng ngày</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto">
                      <div className="space-y-4 py-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="menu-date">Ngày áp dụng</Label>
                            <Input id="menu-date" type="date" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="available">Số suất</Label>
                            <Input id="available" type="number" placeholder="0" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Chọn món ăn cho menu</Label>
                          
                          <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                              <Button
                                key={category}
                                variant={menuCategoryFilter === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setMenuCategoryFilter(category)}
                              >
                                {category}
                              </Button>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto border rounded-lg p-3">
                            {filteredFoodsForMenu.map((food) => {
                              const isSelected = isMenuItemSelected(food.id);
                              return (
                                <div
                                  key={food.id}
                                  onClick={() => toggleMenuItem(food.id)}
                                  className={`relative cursor-pointer rounded-lg border-2 transition-all overflow-hidden ${
                                    isSelected
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  <div className="aspect-square relative">
                                    <ImageWithFallback
                                      src={food.image}
                                      alt={food.name}
                                      className="w-full h-full object-cover"
                                    />
                                    {isSelected && (
                                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                          <svg
                                            className="w-5 h-5 text-primary-foreground"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path d="M5 13l4 4L19 7"></path>
                                          </svg>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-2 space-y-1">
                                    <p className="text-sm font-medium truncate">{food.name}</p>
                                    <p className="text-xs text-primary font-medium">
                                      {food.price.toLocaleString('vi-VN')}đ
                                    </p>
                                    <Badge variant="outline" className="text-xs">
                                      {food.category}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {menuItems.length > 0 && (
                          <div className="space-y-2">
                            <Label>Món đã chọn ({menuItems.length})</Label>
                            <div className="border rounded-lg divide-y max-h-[250px] overflow-y-auto">
                              {menuItems.map((item) => {
                                const food = foods.find(f => f.id === item.foodId);
                                if (!food) return null;
                                return (
                                  <div key={item.foodId} className="p-3 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded overflow-hidden border border-border flex-shrink-0">
                                      <ImageWithFallback
                                        src={food.image}
                                        alt={food.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">{food.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {food.price.toLocaleString('vi-VN')}đ / phần
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Label htmlFor={`qty-${item.foodId}`} className="text-sm whitespace-nowrap">
                                        SL:
                                      </Label>
                                      <Input
                                        id={`qty-${item.foodId}`}
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateMenuItemQuantity(item.foodId, parseInt(e.target.value) || 1)}
                                        className="w-16"
                                      />
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                      <p className="text-sm font-medium text-primary">
                                        {(food.price * item.quantity).toLocaleString('vi-VN')}đ
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeMenuItem(item.foodId)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                              <span className="font-medium">Tổng giá menu:</span>
                              <span className="text-xl font-bold text-primary">
                                {menuItems.reduce((total, item) => {
                                  const food = foods.find(f => f.id === item.foodId);
                                  return total + (food ? food.price * item.quantity : 0);
                                }, 0).toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button variant="outline" onClick={() => {
                            setIsMenuDialogOpen(false);
                            setMenuItems([]);
                            setMenuCategoryFilter("Tất cả");
                          }}>
                            Hủy
                          </Button>
                          <Button onClick={() => {
                            setIsMenuDialogOpen(false);
                            setMenuItems([]);
                            setMenuCategoryFilter("Tất cả");
                          }}>
                            Thêm menu
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menuDaily.map((menu) => (
                  <Card key={menu.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {new Date(menu.date).toLocaleDateString('vi-VN', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardTitle>
                        <Badge>{menu.available} suất</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Các món trong menu:</p>
                        <ul className="space-y-2">
                          {menu.dishes.map((dish, index) => (
                            <li key={index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <span className="text-sm">{dish.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">x{dish.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <p className="font-medium">{menu.totalPrice.toLocaleString('vi-VN')}đ</p>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMenu(menu.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}