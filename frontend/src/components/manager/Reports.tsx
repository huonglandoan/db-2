import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, AlertCircle, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:3000";

interface Branch {
  id: string;   
  address: string;   
}

interface RevenueData {
  branchId: number;
  startDate: string;
  endDate: string;
  revenue: number;
}

interface DiscountExpenseData {
  branchId: number;
  startDate: string;
  endDate: string;
  discountExpense: number;
}

export function Reports() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [discountExpenseData, setDiscountExpenseData] = useState<DiscountExpenseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Lấy danh sách chi nhánh
  useEffect(() => {
    fetch(`${API_BASE}/branch`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch branches');
        }
        return res.json();
      })
      .then(data => {
        console.log('Branches data:', data);  
        setBranches(data);
      })
      .catch(err => {
        console.error("Error fetching branches:", err);
        setError("Không thể tải danh sách chi nhánh");
      });
  }, []);

  // Tính toán dữ liệu
  const handleCalculate = async () => {
    if (!selectedBranchId || !startDate || !endDate) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Gọi 2 API song song
      const [revenueRes, expenseRes] = await Promise.all([
        fetch(`${API_BASE}/calc/revenue?branchId=${selectedBranchId}&startDate=${startDate}&endDate=${endDate}`),
        fetch(`${API_BASE}/calc/discount-expense?branchId=${selectedBranchId}&startDate=${startDate}&endDate=${endDate}`)
      ]);

      if (!revenueRes.ok || !expenseRes.ok) {
        const revenueErr = await revenueRes.json().catch(() => ({}));
        const expenseErr = await expenseRes.json().catch(() => ({}));
        throw new Error(revenueErr.error || expenseErr.error || "Lỗi tính toán");
      }

      const revenue = await revenueRes.json();
      const expense = await expenseRes.json();

      setRevenueData(revenue);
      setDiscountExpenseData(expense);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
      setRevenueData(null);
      setDiscountExpenseData(null);
    } finally {
      setLoading(false);
    }
  };

  // Tính lợi nhuận (doanh thu - chi phí giảm giá)
  const profit = revenueData && discountExpenseData 
    ? revenueData.revenue - discountExpenseData.discountExpense 
    : 0;

  // Dữ liệu cho biểu đồ
  const chartData = revenueData && discountExpenseData ? [
    {
      name: "Doanh thu",
      value: revenueData.revenue,
      color: "#c65d21"
    },
    {
      name: "Chi phí giảm giá",
      value: discountExpenseData.discountExpense,
      color: "#e07a3d"
    },
    {
      name: "Lợi nhuận",
      value: profit,
      color: "#f4a261"
    }
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thống kê báo cáo</h1>
        <p className="text-muted-foreground">
          Phân tích doanh thu và chi phí giảm giá theo chi nhánh
        </p>
      </div>

      {/* Form chọn thông tin */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn thông tin báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Chi nhánh</Label>
              <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                <SelectTrigger id="branch">
                  <SelectValue placeholder="Chọn chi nhánh" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2 flex items-end">
              <Button 
                onClick={handleCalculate} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tính toán...
                  </>
                ) : (
                  "Tính toán"
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Kết quả */}
      {revenueData && discountExpenseData && (
        <>
          {/* Thẻ thống kê */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {revenueData.revenue.toLocaleString('vi-VN')}đ
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Từ {new Date(revenueData.startDate).toLocaleDateString('vi-VN')} đến {new Date(revenueData.endDate).toLocaleDateString('vi-VN')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Chi phí giảm giá</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  -{discountExpenseData.discountExpense.toLocaleString('vi-VN')}đ
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tổng chi phí voucher đã sử dụng
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}