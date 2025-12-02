import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ChevronRight, X, Search, Save, List, Plus, Edit2 } from "lucide-react";

const API_BASE_URL = "http://localhost:3000";

interface Food {
  Food_ID: number;
  Food_name: string;
  Category: string;
  Unit_price: number;
  Quantity: number;
  Image?: string;
  Availability_status: string;
}

interface Branch {
  id: string;
  address: string;
}

interface MenuItem {
  Food_ID: number;
  Food_name: string;
  Unit_price: number;
  Availability_status: string;
  Image?: string;
  Category: string;
}

interface SavedMenu {
  Branch_ID: number;
  Shift: string;
  Date_menu: string;
  foods: MenuItem[];
}

interface ManagerMenuProps {
  currentBranchId: string | null;
  currentAddress?: string | null;
}

const shifts = ["Sáng", "Chiều"] as const;
type ShiftType = typeof shifts[number];

export function ManagerMenu({ currentBranchId, currentAddress }: ManagerMenuProps) {
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Context Filters - Lock vào chi nhánh đang quản lý
  const [selectedBranchId, setSelectedBranchId] = useState<string>(currentBranchId || "");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedShift, setSelectedShift] = useState<ShiftType>("Sáng");

  // Data States
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [menuFoods, setMenuFoods] = useState<Food[]>([]);
  const [initialMenuFoods, setInitialMenuFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedMenus, setSavedMenus] = useState<SavedMenu[]>([]);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "view">("create");

  const isPast = selectedDate < getTodayString();


  useEffect(() => {
    if (currentBranchId && selectedBranchId !== currentBranchId) {
      setSelectedBranchId(currentBranchId);
    }
  }, [currentBranchId, selectedBranchId]);

  // Load available foods - CHỈ lấy món của chi nhánh đang quản lý
  useEffect(() => {
    if (!selectedBranchId || selectedBranchId !== currentBranchId) {
      setAvailableFoods([]);
      return;
    }

    const fetchAvailableFoods = async () => {
      try {
        const res = await fetch(
        `${API_BASE_URL}/menu/available-foods?branchId=${selectedBranchId}`
      );
        if (!res.ok) throw new Error("Lỗi tải món ăn");
        const data = await res.json();
        console.log("Dữ liệu thô từ API:", data);
        // Map dữ liệu về format giống với interface Food
        const mappedFoods: Food[] = data.map((r: any) => ({
          Food_ID: r.Food_ID,
          Food_name: r.Food_name,
          Category: r.Category,
          Unit_price: Number(r.Unit_price ?? 0),
          Quantity: Number(r.Quantity ?? 0),
          Image: r.Image,
          Availability_status: r.Availability_status,
        }));
        
        setAvailableFoods(mappedFoods);
      } catch (err) {
        console.error(err);
        setAvailableFoods([]);
      }
    };

    fetchAvailableFoods();
  }, [selectedBranchId, currentBranchId]); 

  // Load menu foods when filters change
  useEffect(() => {
    if (!selectedBranchId || !selectedDate || !selectedShift) {
      setMenuFoods([]);
      setInitialMenuFoods([]);
      return;
    }

    const fetchMenuFoods = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/menu/items?branchId=${selectedBranchId}&date=${selectedDate}&shift=${selectedShift}`
        );
        if (!res.ok) {
          if (res.status === 404) {
            setMenuFoods([]);
            setInitialMenuFoods([]);
            return;
          }
          throw new Error("Lỗi tải menu");
        }
        const data = await res.json();
        setMenuFoods(data);
        setInitialMenuFoods(data);
      } catch (err) {
        console.error(err);
        setMenuFoods([]);
        setInitialMenuFoods([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuFoods();
  }, [selectedBranchId, selectedDate, selectedShift]);

  // Load saved menus (chỉ của chi nhánh đang quản lý)
  const loadSavedMenus = async (branchId: string) => {
    if (!branchId || branchId !== currentBranchId) {
      setSavedMenus([]);
      return;
    }

    setIsLoadingMenus(true);
    try {
      const res = await fetch(`${API_BASE_URL}/menu?branchId=${branchId}`);
      if (!res.ok) throw new Error("Lỗi tải danh sách menu");
      const data = await res.json();
      setSavedMenus(data);
    } catch (err) {
      console.error(err);
      setSavedMenus([]);
    } finally {
      setIsLoadingMenus(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view" && selectedBranchId && selectedBranchId === currentBranchId) {
      loadSavedMenus(selectedBranchId);
    }
  }, [activeTab, selectedBranchId, currentBranchId]);

  // Filter available foods by search query
  const filteredAvailableFoods = availableFoods.filter((food) => {
    const query = searchQuery.toLowerCase();
    return (
      food.Food_name.toLowerCase().includes(query) ||
      food.Category.toLowerCase().includes(query)
    );
  });

  const handleAddFood = (food: Food) => {
    if (!menuFoods.find((f) => f.Food_ID === food.Food_ID)) {
      setMenuFoods([...menuFoods, food]);
    }
  };

  const handleRemoveFood = (foodId: number) => {
    setMenuFoods(menuFoods.filter((f) => f.Food_ID !== foodId));
  };

  // Check Dirty
  const isDirty = useMemo(() => {
    if (menuFoods.length !== initialMenuFoods.length) return true;
    const currentIds = menuFoods.map((f) => f.Food_ID).sort((a, b) => a - b);
    const initialIds = initialMenuFoods.map((f) => f.Food_ID).sort((a, b) => a - b);
    return JSON.stringify(currentIds) !== JSON.stringify(initialIds);
  }, [menuFoods, initialMenuFoods]);

  // Save Menu - Kiểm tra quyền
  const handleSaveMenu = async () => {
    if (!selectedBranchId || !selectedDate || !selectedShift) {
      alert("Vui lòng chọn đầy đủ: Chi nhánh, Ngày, và Ca");
      return;
    }

    // Kiểm tra quyền: chỉ cho phép lưu menu của chi nhánh đang quản lý
    if (selectedBranchId !== currentBranchId) {
      alert("Bạn chỉ có quyền quản lý menu của chi nhánh mình!");
      return;
    }

    // Kiểm tra ngày quá khứ
    if (isPast) {
      alert("Không thể chỉnh sửa menu của ngày đã qua!");
      return;
    }

    setIsSaving(true);
    try {
      const foods = menuFoods.map((f) => ({ foodId: f.Food_ID }));

      const res = await fetch(`${API_BASE_URL}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Branch_ID: selectedBranchId,
          Shift: selectedShift,
          Date_menu: selectedDate,
          foods: foods,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi lưu menu");

      alert("Lưu thực đơn thành công!");
      setInitialMenuFoods([...menuFoods]);

      if (activeTab === "view") {
        loadSavedMenus(selectedBranchId);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Lỗi lưu menu");
    } finally {
      setIsSaving(false);
    }
  };

  // Chuyển từ tab View sang Edit - Kiểm tra quyền
  const handleEditMenu = (menu: SavedMenu) => {
    // Kiểm tra quyền: chỉ cho phép chỉnh sửa menu của chi nhánh đang quản lý
    if (String(menu.Branch_ID) !== currentBranchId) {
      alert("Bạn chỉ có quyền xem/chỉnh sửa menu của chi nhánh mình!");
      return;
    }

    setSelectedBranchId(String(menu.Branch_ID));
    let cleanDate = "";
    
    // ⭐️ SỬA ĐỔI LOGIC XỬ LÝ NGÀY THÁNG ⭐️
    if (typeof menu.Date_menu === 'string') {
      // Nếu là chuỗi ISO đã có T, cắt T[0] là cách tốt nhất để lấy ngày
      cleanDate = menu.Date_menu.split('T')[0];
    } else {
      // Nếu là đối tượng Date, sử dụng các phương thức UTC
      const d = new Date(menu.Date_menu);
      
      // Đảm bảo lấy ngày, tháng, năm theo UTC để tránh dịch chuyển múi giờ
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, "0"); // getUTCMonth() là 0-indexed
      const day = String(d.getUTCDate()).padStart(2, "0");
      
      cleanDate = `${year}-${month}-${day}`;
    }

    setSelectedDate(cleanDate);
    setSelectedShift(menu.Shift as ShiftType);
    setActiveTab("create");
};

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const canSave = selectedBranchId && selectedDate && selectedShift;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Thực đơn</h1>
          {currentAddress && (
            <p className="text-sm text-muted-foreground mt-1">
              Chi nhánh: {currentAddress}
            </p>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "create" | "view")}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="create">
            <Plus className="mr-2 h-4 w-4" />
            Lên thực đơn
          </TabsTrigger>
          <TabsTrigger value="view">
            <List className="mr-2 h-4 w-4" />
            Lịch sử thực đơn
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CREATE/EDIT */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin ca làm việc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Chi nhánh - DISABLED, chỉ hiển thị */}
                <div className="space-y-2">
                  <Label>Chi nhánh *</Label>
                  <Input
                    value={currentAddress || "Chưa chọn chi nhánh"}
                    disabled
                    className="w-full bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Bạn chỉ có quyền quản lý menu của chi nhánh này
                  </p>
                </div>

                {/* Chọn Ngày */}
                <div className="space-y-2">
                  <Label>Chọn Ngày *</Label>
                  <Input
                    type="date"
                    min={getTodayString()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Chọn Ca */}
                <div className="space-y-2">
                  <Label>Chọn Ca *</Label>
                  <Select
                    value={selectedShift}
                    onValueChange={(value) => setSelectedShift(value as ShiftType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map((shift) => (
                        <SelectItem key={shift} value={shift}>
                          {shift}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dual List View */}
          {canSave && selectedBranchId === currentBranchId ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cột Trái: Kho món ăn */}
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Kho món ăn</CardTitle>
                    <Badge variant="secondary">
                      {filteredAvailableFoods.length} món
                    </Badge>
                  </div>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm món ăn..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0 px-6 pb-6">
                  <div className="space-y-2">
                    {filteredAvailableFoods.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        {selectedBranchId ? "Không có món ăn nào trong kho của chi nhánh này" : "Vui lòng chọn chi nhánh"}
                      </div>
                    ) : (
                      filteredAvailableFoods.map((food) => {
                        const isInMenu = menuFoods.some((f) => f.Food_ID === food.Food_ID);
                        return (
                          <div
                            key={food.Food_ID}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              {food.Image ? (
                                <img
                                  src={food.Image}
                                  alt={food.Food_name}
                                  className="w-10 h-10 rounded object-cover bg-gray-100"
                                  onError={(e) => (e.currentTarget.src = "https://placehold.co/40x40?text=No+Img")}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs">No Img</div>
                              )}
                              <div className="truncate">
                                <p className="font-medium truncate">{food.Food_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {food.Category} • {food.Unit_price.toLocaleString()}đ
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={isInMenu ? "secondary" : "default"}
                              className="ml-2 shrink-0"
                              onClick={() => handleAddFood(food)}
                              disabled={isInMenu || isPast}
                            >
                              {isInMenu ? "Đã thêm" : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cột Phải: Thực đơn Ca này */}
              <Card className="h-[600px] flex flex-col border-primary/20">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Thực đơn đang chọn</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {menuFoods.length === 0
                          ? "Chưa có món nào"
                          : initialMenuFoods.length > 0
                            ? "Đang chỉnh sửa thực đơn cũ"
                            : "Đang tạo thực đơn mới"}
                      </p>
                    </div>
                    <Badge variant={menuFoods.length > 0 ? "default" : "outline"}>
                      {menuFoods.length} món
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0 px-6 pb-6 pt-4">
                  {isLoading ? (
                    <div className="text-center py-10">Đang tải dữ liệu...</div>
                  ) : menuFoods.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10 flex flex-col items-center">
                      <List className="h-10 w-10 mb-2 opacity-20" />
                      <p>Danh sách trống</p>
                      <p className="text-sm">Hãy chọn món từ cột bên trái</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {menuFoods.map((food) => (
                        <div
                          key={food.Food_ID}
                          className="flex items-center justify-between p-3 border rounded-lg bg-card shadow-sm"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {food.Image ? (
                              <img
                                src={food.Image}
                                alt={food.Food_name}
                                className="w-10 h-10 rounded object-cover bg-gray-100"
                                onError={(e) => (e.currentTarget.src = "https://placehold.co/40x40?text=No+Img")}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs">No Img</div>
                            )}
                            <div className="truncate">
                              <p className="font-medium truncate">{food.Food_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {food.Unit_price.toLocaleString()}đ
                              </p>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                            onClick={() => handleRemoveFood(food.Food_ID)}
                            disabled={isPast}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="py-10 text-center text-muted-foreground">
                {!currentBranchId ? (
                  <p>Vui lòng chọn chi nhánh để quản lý menu.</p>
                ) : (
                  <p>Bạn chỉ có quyền quản lý menu của chi nhánh mình.</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Nút Lưu */}
          {canSave && selectedBranchId === currentBranchId && (
            <div className="flex justify-end items-center gap-4 py-4 border-t mt-4">
              {isPast && (
                <span className="text-sm text-red-500 font-bold flex items-center bg-red-50 px-3 py-1 rounded border border-red-200">
                  Chỉ được xem, không thể sửa
                </span>
              )}

              {!isPast && !isDirty && menuFoods.length > 0 && (
                <span className="text-sm text-green-600 font-medium flex items-center">
                  Đã đồng bộ với hệ thống
                </span>
              )}
              {!isPast && isDirty && (
                <span className="text-sm text-amber-600 font-medium flex items-center">
                  Có thay đổi chưa lưu
                </span>
              )}

              <Button
                onClick={handleSaveMenu}
                disabled={isSaving || (!isDirty && !isPast) || isPast}
                size="lg"
                className="min-w-[180px]"
                variant={isDirty && !isPast ? "default" : "secondary"}
              >
                <Save className="mr-2 h-4 w-4" />
                {isPast ? "Đã khóa" : isSaving ? "Đang lưu..." : isDirty ? "Lưu thay đổi" : "Đã lưu"}
              </Button>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: VIEW SAVED */}
        <TabsContent value="view" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách Menu đã tạo</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Chi nhánh: {currentAddress || "N/A"}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!currentBranchId ? (
                <div className="text-center py-10 text-muted-foreground">
                  Vui lòng chọn chi nhánh để xem lịch sử menu
                </div>
              ) : isLoadingMenus ? (
                <div className="text-center py-10">Đang tải...</div>
              ) : savedMenus.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Chưa có menu nào được tạo cho chi nhánh này
                </div>
              ) : (
                <div className="grid gap-4">
                  {savedMenus.map((menu, idx) => {
                    // Kiểm tra quyền: chỉ hiển thị menu của chi nhánh đang quản lý
                    if (String(menu.Branch_ID) !== currentBranchId) {
                      return null; // Không hiển thị menu của chi nhánh khác
                    }

                    const isPastMenu = menu.Date_menu < getTodayString();

                    return (
                      <Card key={idx} className="overflow-hidden hover:shadow-md transition-all">
                        <div className="p-4 flex items-center justify-between bg-muted/20 border-b">
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded font-bold ${
                              isPastMenu ? "bg-gray-200 text-gray-600" : "bg-primary/10 text-primary"
                            }`}>
                              {menu.Shift}
                            </div>
                            <div>
                              <p className="font-semibold text-lg">{formatDate(menu.Date_menu)}</p>
                              <p className="text-sm text-muted-foreground">{menu.foods.length} món ăn</p>
                            </div>
                          </div>

                          {!isPastMenu ? (
                            <Button variant="outline" size="sm" onClick={() => handleEditMenu(menu)}>
                              <Edit2 className="mr-2 h-3 w-3" /> Chỉnh sửa
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleEditMenu(menu)}>
                              Xem chi tiết
                            </Button>
                          )}
                        </div>

                        <div className="p-4 bg-white/50">
                          <div className="flex flex-wrap gap-2">
                            {menu.foods.length > 0 ? (
                              menu.foods.slice(0, 8).map((f) => (
                                <Badge key={f.Food_ID} variant="secondary" className="font-normal">
                                  {f.Food_name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground italic">Menu rỗng</span>
                            )}
                            {menu.foods.length > 8 && (
                              <Badge variant="outline">+{menu.foods.length - 8} món khác</Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}