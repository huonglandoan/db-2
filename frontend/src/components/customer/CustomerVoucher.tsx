import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Gift, Tag, CheckCircle, XCircle } from "lucide-react";

interface Voucher {
  VoucherID: string;
  VoucherCode: string;
  DiscountPercent: number;
  MaxDiscount: number;
  MinOrderAmount: number;
  ValidFrom: string;
  ValidTo: string;
  Status: string;
  BranchName?: string;
}

interface CustomerVoucherProps {
  user: { id: string; name: string; role: string };
}

// Mock data - Voucher theo branch
const mockVouchers: Voucher[] = [
  {
    VoucherID: "501",
    VoucherCode: "GIAM10",
    DiscountPercent: 10,
    MaxDiscount: 50000,
    MinOrderAmount: 100000,
    ValidFrom: "2025-10-01",
    ValidTo: "2025-12-31",
    Status: "Active",
    BranchName: "Chi nhánh Nguyễn Văn Cừ",
  },
  {
    VoucherID: "502",
    VoucherCode: "GIAM20",
    DiscountPercent: 20,
    MaxDiscount: 100000,
    MinOrderAmount: 150000,
    ValidFrom: "2025-09-01",
    ValidTo: "2025-11-30",
    Status: "Active",
    BranchName: "Chi nhánh Lý Thường Kiệt",
  },
  {
    VoucherID: "503",
    VoucherCode: "TANGNUOC",
    DiscountPercent: 0,
    MaxDiscount: 0,
    MinOrderAmount: 200000,
    ValidFrom: "2025-05-01",
    ValidTo: "2025-08-01",
    Status: "Expired",
    BranchName: "Chi nhánh Hai Bà Trưng",
  },
  {
    VoucherID: "504",
    VoucherCode: "COMBO2024",
    DiscountPercent: 15,
    MaxDiscount: 75000,
    MinOrderAmount: 120000,
    ValidFrom: "2025-05-01",
    ValidTo: "2025-12-01",
    Status: "Active",
    BranchName: "Chi nhánh Võ Thị Sáu",
  },
];

export function CustomerVoucher({ user }: CustomerVoucherProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/vouchers?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setVouchers(data || []);
      } else {
        // Fallback to mock data
        setVouchers(mockVouchers);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      // Fallback to mock data
      setVouchers(mockVouchers);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVoucher = async () => {
    if (!searchCode.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/api/vouchers/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: searchCode, userId: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Mã voucher hợp lệ! Giảm ${data.DiscountPercent}% (tối đa ${data.MaxDiscount.toLocaleString("vi-VN")}đ)`);
      } else {
        // Check in mock data
        const voucher = mockVouchers.find(v => v.VoucherCode.toLowerCase() === searchCode.toLowerCase());
        if (voucher && isVoucherValid(voucher)) {
          alert(`Mã voucher hợp lệ! Giảm ${voucher.DiscountPercent}% (tối đa ${voucher.MaxDiscount.toLocaleString("vi-VN")}đ)`);
        } else {
          alert("Mã voucher không hợp lệ hoặc đã hết hạn");
        }
      }
    } catch (error) {
      console.error("Error checking voucher:", error);
      // Check in mock data
      const voucher = mockVouchers.find(v => v.VoucherCode.toLowerCase() === searchCode.toLowerCase());
      if (voucher && isVoucherValid(voucher)) {
        alert(`Mã voucher hợp lệ! Giảm ${voucher.DiscountPercent}% (tối đa ${voucher.MaxDiscount.toLocaleString("vi-VN")}đ)`);
      } else {
        alert("Mã voucher không hợp lệ hoặc đã hết hạn");
      }
    }
  };

  const isVoucherValid = (voucher: Voucher) => {
    const now = new Date();
    const validFrom = new Date(voucher.ValidFrom);
    const validTo = new Date(voucher.ValidTo);
    return now >= validFrom && now <= validTo && voucher.Status === "Active";
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mã giảm giá</h1>
        <p className="text-muted-foreground">Danh sách voucher đang khả dụng</p>
      </div>

      {/* Kiểm tra mã voucher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Kiểm tra mã voucher</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Nhập mã voucher"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCheckVoucher()}
            />
            <Button onClick={handleCheckVoucher}>Kiểm tra</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách voucher */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Voucher khả dụng</h2>
        {vouchers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có voucher nào</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vouchers.map((voucher) => {
              const isValid = isVoucherValid(voucher);
              return (
                <Card
                  key={voucher.VoucherID}
                  className={`${
                    isValid
                      ? "border-primary border-2"
                      : "opacity-60"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{voucher.VoucherCode}</CardTitle>
                      {isValid ? (
                        <Badge>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Khả dụng
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          Hết hạn
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {voucher.DiscountPercent}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Giảm tối đa {voucher.MaxDiscount.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">Đơn tối thiểu: </span>
                        <span className="font-medium">
                          {voucher.MinOrderAmount.toLocaleString("vi-VN")}đ
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Hạn sử dụng: </span>
                        <span className="font-medium">
                          {new Date(voucher.ValidTo).toLocaleDateString("vi-VN")}
                        </span>
                      </p>
                      {voucher.BranchName && (
                        <p>
                          <span className="text-muted-foreground">Chi nhánh: </span>
                          <span className="font-medium">{voucher.BranchName}</span>
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
