import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "../resize/ImageWithFallback";

interface ServedFood {
  FoodID: string;
  FoodName: string;
  Price: number;
  Image: string;
  AvailabilityStatus: string;
  Quantity: number;
}

interface CustomerMenuProps {
  branchId: string | null;
}

// Mock data - Menu theo branch
const mockMenuByBranch: { [key: string]: ServedFood[] } = {
  "1": [
    {
      FoodID: "101",
      FoodName: "Bánh mì thịt",
      Price: 25000,
      Image: "/images/banhmi.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 50,
    },
    {
      FoodID: "102",
      FoodName: "Phở bò",
      Price: 45000,
      Image: "/images/pho.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 30,
    },
    {
      FoodID: "104",
      FoodName: "Pepsi",
      Price: 10000,
      Image: "/images/pepsi.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 100,
    },
  ],
  "2": [
    {
      FoodID: "102",
      FoodName: "Phở bò",
      Price: 45000,
      Image: "/images/pho.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 25,
    },
    {
      FoodID: "103",
      FoodName: "Cơm tấm sườn",
      Price: 40000,
      Image: "/images/comtam.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 40,
    },
    {
      FoodID: "104",
      FoodName: "Pepsi",
      Price: 10000,
      Image: "/images/pepsi.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 80,
    },
  ],
  "3": [
    {
      FoodID: "102",
      FoodName: "Phở bò",
      Price: 45000,
      Image: "/images/pho.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 20,
    },
    {
      FoodID: "103",
      FoodName: "Cơm tấm sườn",
      Price: 40000,
      Image: "/images/comtam.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 35,
    },
    {
      FoodID: "105",
      FoodName: "Bún bò",
      Price: 40000,
      Image: "/images/bunbo.jpg",
      AvailabilityStatus: "Hết hàng",
      Quantity: 0,
    },
  ],
  "4": [
    {
      FoodID: "101",
      FoodName: "Bánh mì thịt",
      Price: 25000,
      Image: "/images/banhmi.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 45,
    },
    {
      FoodID: "103",
      FoodName: "Cơm tấm sườn",
      Price: 40000,
      Image: "/images/comtam.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 30,
    },
  ],
  "5": [
    {
      FoodID: "101",
      FoodName: "Bánh mì thịt",
      Price: 25000,
      Image: "/images/banhmi.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 60,
    },
    {
      FoodID: "104",
      FoodName: "Pepsi",
      Price: 10000,
      Image: "/images/pepsi.jpg",
      AvailabilityStatus: "Còn hàng",
      Quantity: 120,
    },
  ],
};

export function CustomerMenu({ branchId }: CustomerMenuProps) {
  const [menuItems, setMenuItems] = useState<ServedFood[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    if (branchId) {
      fetchMenuDaily(branchId);
    }
  }, [branchId]);

  const fetchMenuDaily = async (branchId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/menu-daily?branchId=${branchId}`);
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        // Fallback to mock data
        setMenuItems(mockMenuByBranch[branchId] || []);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      // Fallback to mock data
      setMenuItems(mockMenuByBranch[branchId] || []);
    }
  };

  const updateCart = (foodId: string, delta: number) => {
    setCart((prev) => ({
      ...prev,
      [foodId]: Math.max(0, (prev[foodId] || 0) + delta),
    }));
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce(
    (sum, [foodId, qty]) => {
      const food = menuItems.find((f) => f.FoodID === foodId);
      return sum + (food ? food.Price * qty : 0);
    },
    0
  );

  if (!branchId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vui lòng chọn chi nhánh trước</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Menu hôm nay</h1>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Tổng cộng</p>
            <p className="text-xl font-bold">{totalPrice.toLocaleString("vi-VN")}đ</p>
          </div>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Giỏ hàng ({totalItems})
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Card key={item.FoodID} className="overflow-hidden">
            <div className="aspect-video relative">
              <ImageWithFallback
                src={item.Image}
                alt={item.FoodName}
                className="w-full h-full object-cover"
              />
              {item.AvailabilityStatus === "Hết hàng" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive">Hết hàng</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{item.FoodName}</h3>
              <p className="text-primary font-semibold mb-4">
                {item.Price.toLocaleString("vi-VN")}đ
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateCart(item.FoodID, -1)}
                    disabled={!cart[item.FoodID]}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{cart[item.FoodID] || 0}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateCart(item.FoodID, 1)}
                    disabled={item.AvailabilityStatus === "Hết hàng" || item.Quantity === 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Badge variant="outline">Còn {item.Quantity}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}