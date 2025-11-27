import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Plus } from "lucide-react";

const API_BASE_URL = "http://localhost:3000";

interface Food {
  foodId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  status?: string;
}
interface MenuItem {
  foodId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
  status?: string;
}

interface Menu {
  branchId: string;
  date: string;
  shift: "Morning" | "Afternoon" | "Evening";
  foods: MenuItem[];
}

interface ManagerMenuProps {
  currentBranchId: string | null;
  currentAddress?: string | null;
}

const shifts = ["Morning", "Afternoon", "Evening"] as const;
const shiftLabel = { Morning: "Sáng", Afternoon: "Trưa", Evening: "Chiều" };

export function ManagerMenu({ currentBranchId, currentAddress }: ManagerMenuProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [menuItems, setMenuItems] = useState<Food[]>([]);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShift, setSelectedShift] = useState<"Morning" | "Afternoon" | "Evening">("Morning");

        // Lấy danh sách menu theo chi nhánh
        useEffect(() => {
          const fetchMenu = async () => {
            if (!currentBranchId) return setMenus([]);
            try {
              const res = await fetch(`${API_BASE_URL}/menu?branchId=${currentBranchId}`);
              if (!res.ok) throw new Error("Lỗi tải menu");
              const data = await res.json();
              console.log("menu data:", data);
              const mappedMenu: Menu[] = data.map((m: any) => {
        function parseDateSafe(dateStr: string | null | undefined): string {
  if (!dateStr) return ""; // null hoặc undefined -> chuỗi rỗng

  // Thử thêm 'T00:00:00' nếu thiếu T
  let normalized = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T");

  const dateObj = new Date(normalized);
  if (isNaN(dateObj.getTime())) return ""; // không parse được -> trả về chuỗi rỗng

  return dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
}
        return {
          branchId: m.Branch_ID?.toString() || "",
          date: parseDateSafe(m.Date_menu),
          shift: m.Shift || "Morning",
          foods: (m.foods || []).map((f: any) => ({
            foodId: f.Food_ID?.toString() || "",
            name: f.Food_name || "",
            price: f.Unit_price ?? 0,        // dùng ?? để giữ 0 nếu null hoặc undefined
            quantity: f.Quantity ?? 0,
            image: f.Image || undefined,
            status: f.Availability_status || undefined,
          })),
        };
});

        setMenus(mappedMenu);
      } catch (err) {
        console.error(err);
        setMenus([]);
      }
    };
    fetchMenu();
  }, [currentBranchId]);

  // Lấy danh sách món ăn để thêm vào menu
  useEffect(() => {
    const fetchFoods = async () => {
      if (!currentBranchId) return setFoods([]);
      try {
        const res = await fetch(`${API_BASE_URL}/food?branchId=${currentBranchId}`);
        if (!res.ok) throw new Error("Lỗi tải món ăn");
        const data = await res.json();
         console.log("food:", data);
        setFoods(data.map((f: any) => ({
          foodId: f.Food_ID.toString(),
          name: f.Food_name,
          category: f.Category,
          price: f.Unit_price,
          quantity: f.Quantity,
          image: f.Image,
          status: f.Availability_status
        })));
      } catch (err) {
        console.error(err);
        setFoods([]);
      }
    };
    fetchFoods();
  }, [currentBranchId]);

  const toggleMenuItem = (food: Food) => {
    const exists = menuItems.find(f => f.foodId === food.foodId);
    if (exists) setMenuItems(menuItems.filter(f => f.foodId !== food.foodId));
    else setMenuItems([...menuItems, food]);
  };

  const handleCreateMenu = async () => {
    if (!selectedDate || !selectedShift || menuItems.length === 0) {
      alert("Chọn ngày, ca và ít nhất 1 món");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Branch_ID: currentBranchId,
          Shift: selectedShift,
          Date_menu: selectedDate,
          foods: menuItems.map(f => ({ foodId: f.foodId })) // chỉ gửi foodId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi tạo menu");

      // Thêm menu mới vào state
      setMenus(prev => [...prev, {
        branchId: data.branchId,
        date: data.date,
        shift: data.shift,
        foods: menuItems.map(f => ({
          foodId: f.foodId,
          name: f.name,
          price: f.price,
          quantity: f.quantity,
          image: f.image,
          status: f.status
        }))
      }]);

      setMenuItems([]);
      setSelectedDate("");
      setSelectedShift("Morning");
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpandMenu = (menuKey: string) => {
    setExpandedMenu(prev => prev === menuKey ? null : menuKey);
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý menu chi nhánh {currentAddress}</h1>

      {/* Dialog thêm menu */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4"><Plus className="mr-2" /> Thêm menu</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Thêm menu mới</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ngày</Label>
              <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            </div>
            <div>
              <Label>Ca</Label>
              <select
                className="w-full border rounded p-2"
                value={selectedShift}
                onChange={e => setSelectedShift(e.target.value as any)}
              >
                {shifts.map(s => <option key={s} value={s}>{shiftLabel[s]}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label>Món ăn</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border rounded p-2">
              {foods.map(f => (
                <Button
                  key={f.foodId}
                  variant={menuItems.some(i => i.foodId === f.foodId) ? "secondary" : "default"}
                  onClick={() => toggleMenuItem(f)}
                  className="flex flex-col items-center justify-center text-center py-2"
                >
                  {f.image && <img src={f.image} alt={f.name} className="w-16 h-16 object-cover mb-1 rounded" />}
                  <span className="text-sm">{f.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleCreateMenu}>Tạo menu</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hiển thị danh sách menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menus.map(menu => {
          const menuKey = `${menu.branchId}-${menu.shift}-${menu.date}`;
          const isExpanded = expandedMenu === menuKey;

          return (
            <Card key={menuKey} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpandMenu(menuKey)}
                >
                  <CardTitle className="text-lg font-semibold">
                    {new Date(menu.date).toLocaleDateString('vi-VN')} ({shiftLabel[menu.shift]})
                  </CardTitle>
                  <Badge>{menu.foods.length} món</Badge>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-1 px-2">Hình</th>
                        <th className="py-1 px-2">Tên món</th>
                        <th className="py-1 px-2">Số lượng</th>
                        <th className="py-1 px-2">Giá</th>
                        <th className="py-1 px-2">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menu.foods.map(f => (
                        <tr key={f.foodId} className="border-b hover:bg-gray-50">
                          <td className="py-1 px-2">
                            {f.image ? <img src={f.image} alt={f.name} className="w-12 h-12 object-cover rounded" /> : "-"}
                          </td>
                          <td className="py-1 px-2">{f.name}</td>
                          <td className="py-1 px-2">{f.quantity}</td>
                          <td className="py-1 px-2">{f.price.toLocaleString()} VND</td>
                          <td className="py-1 px-2">{f.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
