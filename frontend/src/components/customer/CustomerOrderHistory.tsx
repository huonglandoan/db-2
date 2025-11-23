import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { QrCode, CheckCircle, XCircle, Eye } from "lucide-react";
import { ImageWithFallback } from "../resize/ImageWithFallback";

interface OrderItem {
  FoodID: string;
  FoodName: string;
  Price: number;
  Quantity: number;
  Image: string;
}

interface Order {
  OrderID: string;
  BranchName: string;
  TotalAmount: number;
  PickupStatus: string;
  CreatedAt: string;
  Items: OrderItem[];
  QRCode?: string;
}

interface CustomerOrderHistoryProps {
  user: { id: string; name: string; role: string };
}

// Mock data
const mockOrders: Order[] = [
  {
    OrderID: "9001",
    BranchName: "Chi nhánh Nguyễn Văn Cừ",
    TotalAmount: 22500,
    PickupStatus: "Đã nhận",
    CreatedAt: "2025-10-27T12:00:00",
    Items: [
      {
        FoodID: "101",
        FoodName: "Bánh mì thịt",
        Price: 25000,
        Quantity: 1,
        Image: "/images/banhmi.jpg",
      },
    ],
    QRCode: undefined,
  },
  {
    OrderID: "9002",
    BranchName: "Chi nhánh Lý Thường Kiệt",
    TotalAmount: 36000,
    PickupStatus: "Chưa nhận",
    CreatedAt: "2025-10-27T13:00:00",
    Items: [
      {
        FoodID: "102",
        FoodName: "Phở bò",
        Price: 45000,
        Quantity: 1,
        Image: "/images/pho.jpg",
      },
    ],
    QRCode: undefined,
  },
  {
    OrderID: "9003",
    BranchName: "Chi nhánh Hai Bà Trưng",
    TotalAmount: 40000,
    PickupStatus: "Chưa nhận",
    CreatedAt: "2025-10-28T14:00:00",
    Items: [
      {
        FoodID: "103",
        FoodName: "Cơm tấm sườn",
        Price: 40000,
        Quantity: 1,
        Image: "/images/comtam.jpg",
      },
    ],
    QRCode: undefined,
  },
];

export function CustomerOrderHistory({ user }: CustomerOrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user.id]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/orders?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data || []);
      } else {
        // Fallback to mock data
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback to mock data
      setOrders(mockOrders);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lịch sử đơn hàng</h1>
        <p className="text-muted-foreground">Xem các đơn hàng đã đặt</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.OrderID}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Đơn hàng #{order.OrderID}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(order.CreatedAt).toLocaleString("vi-VN")} • {order.BranchName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        order.PickupStatus === "Đã nhận"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {order.PickupStatus === "Đã nhận" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {order.PickupStatus}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {order.Items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="w-12 h-12 rounded overflow-hidden border">
                        <ImageWithFallback
                          src={item.Image}
                          alt={item.FoodName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.Items?.length > 3 && (
                      <div className="w-12 h-12 rounded border flex items-center justify-center text-xs">
                        +{order.Items.length - 3}
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-lg">
                    {order.TotalAmount.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog chi tiết đơn hàng */}
      <Dialog
        open={selectedOrder !== null}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Chi tiết đơn hàng #{selectedOrder.OrderID}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Chi nhánh</p>
                    <p className="font-medium">{selectedOrder.BranchName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.CreatedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <Badge>
                      {selectedOrder.PickupStatus === "Đã nhận" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {selectedOrder.PickupStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng tiền</p>
                    <p className="font-bold text-lg">
                      {selectedOrder.TotalAmount.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Danh sách món</p>
                  <div className="space-y-2">
                    {selectedOrder.Items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded overflow-hidden border">
                            <ImageWithFallback
                              src={item.Image}
                              alt={item.FoodName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.FoodName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.Price.toLocaleString("vi-VN")}đ x {item.Quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          {(item.Price * item.Quantity).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.PickupStatus !== "Đã nhận" && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2 text-center">
                      Mã QR để nhận món
                    </p>
                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-lg border-2 border-primary">
                        {selectedOrder.QRCode ? (
                          <img
                            src={selectedOrder.QRCode}
                            alt="QR Code"
                            className="w-48 h-48"
                          />
                        ) : (
                          <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed">
                            <div className="text-center">
                              <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm font-mono">{selectedOrder.OrderID}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Trình mã này tại quầy để nhận món
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
