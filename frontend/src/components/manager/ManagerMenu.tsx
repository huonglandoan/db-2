import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Plus, Edit, Trash2, CalendarDays, X, Store } from "lucide-react";
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

interface MenuDaily {
  id: string;
  date: string;
  dishes: { foodId: string; name: string; quantity: number }[];
  totalPrice: number;
  available: number;
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

const initialMenuDaily: MenuDaily[] = [
  { 
    id: "MD001", 
    date: "2025-11-26", 
    dishes: [
      { foodId: "MA001", name: "Phở bò đặc biệt", quantity: 1 },
      { foodId: "MA003", name: "Gỏi cuốn tôm thịt", quantity: 1 }
    ], 
    totalPrice: 100000, 
    available: 50,
    branchId: "1"
  },
  { 
    id: "MD002", 
    date: "2025-11-27", 
    dishes: [
      { foodId: "MA002", name: "Bún chả Hà Nội", quantity: 1 },
      { foodId: "MA003", name: "Gỏi cuốn tôm thịt", quantity: 1 }
    ], 
    totalPrice: 90000, 
    available: 40,
    branchId: "1"
  },
  { 
    id: "MD003", 
    date: "2025-11-26", 
    dishes: [
      { foodId: "MA004", name: "Chả giò chiên", quantity: 2 },
      { foodId: "MA005", name: "Cơm rang dương châu", quantity: 1 }
    ], 
    totalPrice: 130000, 
    available: 30,
    branchId: "2"
  },
];

const categories = ["Tất cả", "Ăn sáng", "Món chính", "Khai vị", "Canh", "Tráng miệng", "Đồ uống"];

const branches = [
  { id: "1", name: "Chi nhánh Quận 1" },
  { id: "2", name: "Chi nhánh Quận 3" },
  { id: "3", name: "Chi nhánh Bình Thạnh" },
  { id: "4", name: "Chi nhánh Tân Bình" },
];

interface MenuManagementProps {
  currentBranchId: string;
}

export function ManagerMenu({ currentBranchId }: MenuManagementProps) {
  const [foods] = useState<Food[]>(initialFoods);
  const [menuDaily, setMenuDaily] = useState<MenuDaily[]>(initialMenuDaily);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<{ foodId: string; quantity: number }[]>([]);
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("Tất cả");

  // Filter foods và menu theo chi nhánh hiện tại
  const branchFoods = foods.filter(food => food.branchId === currentBranchId);
  const branchMenus = menuDaily.filter(menu => menu.branchId === currentBranchId);

  const filteredFoodsForMenu = branchFoods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = menuCategoryFilter === "Tất cả" || food.category === menuCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteMenu = (id: string) => {
    setMenuDaily(menuDaily.filter(m => m.id !== id));
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

  const currentBranch = branches.find(b => b.id === currentBranchId);

  return (
    <div className="space-y-6">
      <div>
        <h1>Quản lý menu hàng ngày</h1>
        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <Store className="h-4 w-4" />
          <p>
            {currentBranch?.name || "Chọn chi nhánh"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Tổng menu</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branchMenus.length}</div>
            <p className="text-xs text-muted-foreground">
              Menu chi nhánh này
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Món ăn có sẵn</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branchFoods.length}</div>
            <p className="text-xs text-muted-foreground">
              Món để tạo menu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Menu hôm nay</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branchMenus.filter(m => m.date === new Date().toISOString().split('T')[0]).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Menu ngày hôm nay
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách menu hàng ngày</CardTitle>
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
                    <div className="rounded-lg bg-accent/50 p-3">
                      <p className="text-sm">
                        <span className="font-medium">Chi nhánh: </span>
                        <span className="text-primary">{currentBranch?.name}</span>
                      </p>
                    </div>
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
                        {filteredFoodsForMenu.length > 0 ? (
                          filteredFoodsForMenu.map((food) => {
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
                          })
                        ) : (
                          <div className="col-span-full text-center py-8 text-muted-foreground">
                            Không có món ăn nào cho chi nhánh này
                          </div>
                        )}
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
            {branchMenus.length > 0 ? (
              branchMenus.map((menu) => (
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
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có menu nào cho chi nhánh này</p>
                <p className="text-sm mt-2">Nhấn "Thêm menu" để tạo menu mới</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
