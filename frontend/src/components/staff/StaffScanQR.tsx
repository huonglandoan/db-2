import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { QrCode, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";

interface StaffScanQRProps {
  user: { id: string; name: string; branchId?: string };
}

// Mock order data
const mockOrderInfo = {
  OrderID: "9001",
  PickupStatus: "Chưa nhận",
  Items: [
    { FoodName: "Bánh mì thịt", Quantity: 1, Price: 25000 },
    { FoodName: "Pepsi", Quantity: 2, Price: 10000 },
  ],
  TotalAmount: 45000,
};

export function StaffScanQR({ user }: StaffScanQRProps) {
  const [orderId, setOrderId] = useState("");
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (!orderId.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderInfo(data);
      } else {
        // Fallback to mock data
        if (orderId === "9001" || orderId === "9002" || orderId === "9003") {
          setOrderInfo({ ...mockOrderInfo, OrderID: orderId });
        } else {
          alert("Không tìm thấy đơn hàng");
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      // Fallback to mock data
      if (orderId === "9001" || orderId === "9002" || orderId === "9003") {
        setOrderInfo({ ...mockOrderInfo, OrderID: orderId });
      } else {
        alert("Không tìm thấy đơn hàng");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPickup = async () => {
    if (!orderInfo) return;

    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderInfo.OrderID}/pickup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: user.id }),
      });

      if (response.ok) {
        alert("Đã xác nhận nhận món thành công!");
        setOrderInfo(null);
        setOrderId("");
      } else {
        // Mock: Simulate success
        alert("Đã xác nhận nhận món thành công!");
        setOrderInfo(null);
        setOrderId("");
      }
    } catch (error) {
      console.error("Error confirming pickup:", error);
      // Mock: Simulate success
      alert("Đã xác nhận nhận món thành công!");
      setOrderInfo(null);
      setOrderId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quét mã QR</h1>
        <p className="text-muted-foreground">Quét mã QR từ khách hàng để xác nhận đơn hàng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>Nhập mã đơn hàng</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Nhập OrderID hoặc quét QR"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleScan()}
            />
            <Button onClick={handleScan} disabled={isLoading}>
              {isLoading ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
          </div>

          {orderInfo && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mã đơn</p>
                    <p className="font-semibold">{orderInfo.OrderID}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <Badge>
                      {orderInfo.PickupStatus === "Đã nhận" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {orderInfo.PickupStatus}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Danh sách món</p>
                  <div className="space-y-2">
                    {orderInfo.Items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.FoodName} x{item.Quantity}</span>
                        <span>{item.Price.toLocaleString("vi-VN")}đ</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between font-bold text-lg pt-4 border-t">
                  <span>Tổng cộng:</span>
                  <span>{orderInfo.TotalAmount?.toLocaleString("vi-VN")}đ</span>
                </div>

                {orderInfo.PickupStatus !== "Đã nhận" && (
                  <Button className="w-full" onClick={handleConfirmPickup}>
                    Xác nhận đã nhận món
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
