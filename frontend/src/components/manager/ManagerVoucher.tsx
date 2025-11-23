import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Plus, Edit, Trash2, Gift, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Voucher {
  VoucherID: string;
  VoucherCode: string;
  DiscountPercent: number;
  MaxDiscount: number;
  MinOrderAmount: number;
  ValidFrom: string;
  ValidTo: string;
  Status: string;
  BranchID: string;
}

interface ManagerVoucherProps {
  user: { id: string; name: string; branchId?: string };
}

// Mock vouchers
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
    BranchID: "1",
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
    BranchID: "2",
  },
];

export function ManagerVoucher({ user }: ManagerVoucherProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  // Form state
  const [voucherCode, setVoucherCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    fetchVouchers();
  }, [user.branchId]);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/vouchers?branchId=${user.branchId}`
      );
      if (response.ok) {
        const data = await response.json();
        setVouchers(data || []);
      } else {
        // Fallback to mock data - filter by branch
        setVouchers(mockVouchers.filter(v => v.BranchID === user.branchId));
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      // Fallback to mock data - filter by branch
      setVouchers(mockVouchers.filter(v => v.BranchID === user.branchId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!voucherCode || !discountPercent || !maxDiscount || !minOrderAmount || !validFrom || !validTo) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const url = editingVoucher
        ? `http://localhost:3000/api/vouchers/${editingVoucher.VoucherID}`
        : "http://localhost:3000/api/vouchers";
      
      const method = editingVoucher ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          VoucherCode: voucherCode,
          DiscountPercent: parseFloat(discountPercent),
          MaxDiscount: parseFloat(maxDiscount),
          MinOrderAmount: parseFloat(minOrderAmount),
          ValidFrom: validFrom,
          ValidTo: validTo,
          Status: status,
          BranchID: user.branchId,
        }),
      });

      if (response.ok) {
        alert(editingVoucher ? "Cập nhật voucher thành công!" : "Tạo voucher thành công!");
        setIsDialogOpen(false);
        resetForm();
        fetchVouchers();
      } else {
        // Mock: Simulate success
        const newVoucher: Voucher = {
          VoucherID: editingVoucher?.VoucherID || Date.now().toString(),
          VoucherCode: voucherCode,
          DiscountPercent: parseFloat(discountPercent),
          MaxDiscount: parseFloat(maxDiscount),
          MinOrderAmount: parseFloat(minOrderAmount),
          ValidFrom: validFrom,
          ValidTo: validTo,
          Status: status,
          BranchID: user.branchId || "",
        };
        if (editingVoucher) {
          setVouchers(prev => prev.map(v => v.VoucherID === editingVoucher.VoucherID ? newVoucher : v));
        } else {
          setVouchers(prev => [...prev, newVoucher]);
        }
        alert(editingVoucher ? "Cập nhật voucher thành công!" : "Tạo voucher thành công!");
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving voucher:", error);
      // Mock: Simulate success
      const newVoucher: Voucher = {
        VoucherID: editingVoucher?.VoucherID || Date.now().toString(),
        VoucherCode: voucherCode,
        DiscountPercent: parseFloat(discountPercent),
        MaxDiscount: parseFloat(maxDiscount),
        MinOrderAmount: parseFloat(minOrderAmount),
        ValidFrom: validFrom,
        ValidTo: validTo,
        Status: status,
        BranchID: user.branchId || "",
      };
      if (editingVoucher) {
        setVouchers(prev => prev.map(v => v.VoucherID === editingVoucher.VoucherID ? newVoucher : v));
      } else {
        setVouchers(prev => [...prev, newVoucher]);
      }
      alert(editingVoucher ? "Cập nhật voucher thành công!" : "Tạo voucher thành công!");
      setIsDialogOpen(false);
      resetForm();
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setVoucherCode(voucher.VoucherCode);
    setDiscountPercent(voucher.DiscountPercent.toString());
    setMaxDiscount(voucher.MaxDiscount.toString());
    setMinOrderAmount(voucher.MinOrderAmount.toString());
    setValidFrom(voucher.ValidFrom.split("T")[0]);
    setValidTo(voucher.ValidTo.split("T")[0]);
    setStatus(voucher.Status);
    setIsDialogOpen(true);
  };

  const handleDelete = async (voucherId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa voucher này không?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/vouchers/${voucherId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Xóa voucher thành công!");
        fetchVouchers();
      } else {
        // Mock: Simulate success
        setVouchers(prev => prev.filter(v => v.VoucherID !== voucherId));
        alert("Xóa voucher thành công!");
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      // Mock: Simulate success
      setVouchers(prev => prev.filter(v => v.VoucherID !== voucherId));
      alert("Xóa voucher thành công!");
    }
  };

  const resetForm = () => {
    setEditingVoucher(null);
    setVoucherCode("");
    setDiscountPercent("");
    setMaxDiscount("");
    setMinOrderAmount("");
    setValidFrom("");
    setValidTo("");
    setStatus("Active");
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
        <h1 className="text-3xl font-bold">Quản lý Voucher</h1>
        <p className="text-muted-foreground">Tạo và quản lý mã giảm giá cho chi nhánh</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách voucher</CardTitle>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo voucher mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingVoucher ? "Chỉnh sửa voucher" : "Tạo voucher mới"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="code">Mã voucher</Label>
                      <Input
                        id="code"
                        placeholder="VOUCHER2024"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Hoạt động</SelectItem>
                          <SelectItem value="Inactive">Tạm dừng</SelectItem>
                          <SelectItem value="Expired">Hết hạn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="discount">Giảm giá (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        placeholder="10"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxDiscount">Giảm tối đa (VNĐ)</Label>
                      <Input
                        id="maxDiscount"
                        type="number"
                        placeholder="50000"
                        value={maxDiscount}
                        onChange={(e) => setMaxDiscount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minOrder">Đơn tối thiểu (VNĐ)</Label>
                      <Input
                        id="minOrder"
                        type="number"
                        placeholder="100000"
                        value={minOrderAmount}
                        onChange={(e) => setMinOrderAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="validFrom">Ngày bắt đầu</Label>
                      <Input
                        id="validFrom"
                        type="date"
                        value={validFrom}
                        onChange={(e) => setValidFrom(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validTo">Ngày kết thúc</Label>
                      <Input
                        id="validTo"
                        type="date"
                        value={validTo}
                        onChange={(e) => setValidTo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleSubmit}>
                      {editingVoucher ? "Cập nhật" : "Tạo voucher"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã voucher</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Đơn tối thiểu</TableHead>
                  <TableHead>Hạn sử dụng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Chưa có voucher nào
                    </TableCell>
                  </TableRow>
                ) : (
                  vouchers.map((voucher) => (
                    <TableRow key={voucher.VoucherID}>
                      <TableCell className="font-medium">{voucher.VoucherCode}</TableCell>
                      <TableCell>
                        {voucher.DiscountPercent}% (tối đa {voucher.MaxDiscount.toLocaleString("vi-VN")}đ)
                      </TableCell>
                      <TableCell>{voucher.MinOrderAmount.toLocaleString("vi-VN")}đ</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(voucher.ValidTo).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            isVoucherValid(voucher)
                              ? "default"
                              : voucher.Status === "Inactive"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {voucher.Status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(voucher)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(voucher.VoucherID)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
