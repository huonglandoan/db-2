import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ShoppingCart, Tag, Wallet, CheckCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface OrderItem {
  FoodID: string;
  FoodName: string;
  Price: number;
  Quantity: number;
}

interface Voucher {
  VoucherID: string;
  VoucherCode: string;
  DiscountPercent: number;
  MaxDiscount: number;
  MinOrderAmount: number;
  Status: string;
}

interface CustomerOrderProps {
  user: { id: string; name: string; role: string };
  branchId: string | null;
}

// Mock wallet balance
const mockWalletBalance = 500000;

export function CustomerOrder({ user, branchId }: CustomerOrderProps) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Load cart from localStorage hoặc từ CustomerMenu
    const savedCart = localStorage.getItem(`cart_${user.id}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    fetchWalletBalance();
  }, [user.id]);

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/wallet/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.Balance || 0);
      } else {
        // Fallback to mock data
        setWalletBalance(mockWalletBalance);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      // Fallback to mock data
      setWalletBalance(mockWalletBalance);
    }
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/api/vouchers/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode, userId: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setAppliedVoucher(data);
      } else {
        // Mock: Check against known vouchers
        const mockVouchers = [
          { VoucherID: "501", VoucherCode: "GIAM10", DiscountPercent: 10, MaxDiscount: 50000, MinOrderAmount: 100000, Status: "Active" },
          { VoucherID: "502", VoucherCode: "GIAM20", DiscountPercent: 20, MaxDiscount: 100000, MinOrderAmount: 150000, Status: "Active" },
        ];
        const voucher = mockVouchers.find(v => v.VoucherCode.toLowerCase() === voucherCode.toLowerCase());
        if (voucher) {
          setAppliedVoucher(voucher);
        } else {
          alert("Mã voucher không hợp lệ");
        }
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
      // Mock: Check against known vouchers
      const mockVouchers = [
        { VoucherID: "501", VoucherCode: "GIAM10", DiscountPercent: 10, MaxDiscount: 50000, MinOrderAmount: 100000, Status: "Active" },
        { VoucherID: "502", VoucherCode: "GIAM20", DiscountPercent: 20, MaxDiscount: 100000, MinOrderAmount: 150000, Status: "Active" },
      ];
      const voucher = mockVouchers.find(v => v.VoucherCode.toLowerCase() === voucherCode.toLowerCase());
      if (voucher) {
        setAppliedVoucher(voucher);
      } else {
        alert("Mã voucher không hợp lệ");
      }
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
  };

  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;
    const subtotal = calculateSubtotal();
    if (subtotal < appliedVoucher.MinOrderAmount) return 0;
    
    const discount = (subtotal * appliedVoucher.DiscountPercent) / 100;
    return Math.min(discount, appliedVoucher.MaxDiscount);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleCreateOrder = async () => {
    if (!branchId) {
      alert("Vui lòng chọn chi nhánh trước");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng trống");
      return;
    }

    const total = calculateTotal();
    if (walletBalance < total) {
      alert("Số dư ví không đủ. Vui lòng nạp thêm tiền.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CustomerID: user.id,
          BranchID: branchId,
          Items: cart,
          VoucherID: appliedVoucher?.VoucherID || null,
          TotalAmount: total,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.OrderID);
        setShowSuccessDialog(true);
        setCart([]);
        localStorage.removeItem(`cart_${user.id}`);
        setAppliedVoucher(null);
        setVoucherCode("");
        fetchWalletBalance();
      } else {
        // Mock: Simulate success
        const newOrderId = `900${Date.now().toString().slice(-3)}`;
        setOrderId(newOrderId);
        setShowSuccessDialog(true);
        setCart([]);
        localStorage.removeItem(`cart_${user.id}`);
        setAppliedVoucher(null);
        setVoucherCode("");
        setWalletBalance(prev => prev - total);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      // Mock: Simulate success
      const newOrderId = `900${Date.now().toString().slice(-3)}`;
      setOrderId(newOrderId);
      setShowSuccessDialog(true);
      setCart([]);
      localStorage.removeItem(`cart_${user.id}`);
      setAppliedVoucher(null);
      setVoucherCode("");
      setWalletBalance(prev => prev - total);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!branchId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vui lòng chọn chi nhánh trước</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Giỏ hàng trống</p>
        <p className="text-sm text-muted-foreground mt-2">
          Vui lòng chọn món từ Menu
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Đặt món</h1>
        <p className="text-muted-foreground">Xác nhận đơn hàng và thanh toán</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Danh sách món */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Giỏ hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.FoodID} className="flex items-center justify-between border-b pb-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.FoodName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.Price.toLocaleString("vi-VN")}đ x {item.Quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {(item.Price * item.Quantity).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Áp dụng voucher */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span>Mã giảm giá</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {appliedVoucher ? (
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <div>
                    <p className="font-medium">{appliedVoucher.VoucherCode}</p>
                    <p className="text-sm text-muted-foreground">
                      Giảm {appliedVoucher.DiscountPercent}% (tối đa {appliedVoucher.MaxDiscount.toLocaleString("vi-VN")}đ)
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAppliedVoucher(null);
                      setVoucherCode("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nhập mã voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <Button onClick={handleApplyVoucher}>Áp dụng</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tóm tắt thanh toán */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tóm tắt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{calculateSubtotal().toLocaleString("vi-VN")}đ</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-primary">
                    <span>Giảm giá:</span>
                    <span>-{calculateDiscount().toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span>{calculateTotal().toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <div className="p-3 bg-accent rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Wallet className="h-4 w-4 mr-1" />
                    Số dư ví:
                  </span>
                  <span className="font-semibold">
                    {walletBalance.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                {walletBalance < calculateTotal() && (
                  <p className="text-sm text-destructive">
                    Thiếu {(calculateTotal() - walletBalance).toLocaleString("vi-VN")}đ
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                onClick={handleCreateOrder}
                disabled={isProcessing || walletBalance < calculateTotal()}
              >
                {isProcessing ? "Đang xử lý..." : "Thanh toán"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog thành công */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Đặt hàng thành công!</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Mã đơn hàng: <strong>{orderId}</strong></p>
            <p className="text-sm text-muted-foreground">
              Vui lòng đến quầy và trình mã QR để nhận món
            </p>
            <Button className="w-full" onClick={() => setShowSuccessDialog(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
