import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"; 
import { DollarSign, ShoppingCart, AlertCircle, Loader2 } from "lucide-react";

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

interface LowStockData {
    branchId: number;
    threshold: number;
    message: string;
}

interface SalaryData {
  branchId: number;
  totalSalary: number;
}

// Set mặc định ban đầu
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const today = new Date();
const formattedEndDate = formatDate(today);

// Tính ngày bắt đầu (1 tháng trước)
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);
const formattedStartDate = formatDate(oneMonthAgo);

export function Reports() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(formattedStartDate);
  const [endDate, setEndDate] = useState<string>(formattedEndDate);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [lowStockData, setLowStockData] = useState<LowStockData | null>(null);
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [stockThreshold, setStockThreshold] = useState<string>("10"); 
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
    if (!selectedBranchId || !startDate || !endDate || !stockThreshold) {
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
      const thresholdValue = parseInt(stockThreshold) || 0;
      const [revenueRes, stockRes, salaryRes] = await Promise.all([
        fetch(`${API_BASE}/calc/revenue?branchId=${selectedBranchId}&startDate=${startDate}&endDate=${endDate}`),
        fetch(`${API_BASE}/calc/low-stock?branchId=${selectedBranchId}&threshold=${thresholdValue}`),
        fetch(`${API_BASE}/calc/total-salary?branchId=${selectedBranchId}`)
      ]);

      if (!revenueRes.ok || !stockRes.ok || !salaryRes.ok) {
        const revenueErr = await revenueRes.json().catch(() => ({}));
        const stockErr = await stockRes.json().catch(() => ({}));
        const salaryErr = await salaryRes.json().catch(() => ({}));
        throw new Error(revenueErr.error || stockErr.error || salaryErr.error|| "Lỗi tính toán");
      }

      const revenue = await revenueRes.json();
      const stockResult = await stockRes.json();
      const salaryResult = await salaryRes.json();

      setSalaryData(salaryResult);
      setRevenueData(revenue);
      setLowStockData({
          branchId: parseInt(selectedBranchId),
          threshold: parseInt(stockThreshold),
          message: stockResult.message  
      });
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
      setRevenueData(null);
      setLowStockData(null);
      setSalaryData(null);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thống kê báo cáo</h1>
        <p className="text-muted-foreground">
          Phân tích các chỉ số kinh doanh theo chi nhánh
        </p>
      </div>

      {/* Form chọn thông tin */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn thông tin báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
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

            <div className="space-y-2"></div>
              <Label htmlFor="stockThreshold">Ngưỡng tồn kho</Label>
              <Input
                id="stockThreshold"
                type="number"
                value={stockThreshold}
                onChange={(e) => setStockThreshold(e.target.value)}
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

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Kết quả */}
      {revenueData && lowStockData && (
        <>
          {/* Thẻ thống kê */}
          <div className="grid gap-4 md:grid-cols-1">
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
          </div>
            <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Tổng lương nhân viên</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salaryData?.totalSalary.toLocaleString('vi-VN')}đ
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tổng lương nhân viên chi nhánh
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Tồn kho</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-semibold">
                  {lowStockData.message}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ngưỡng tồn kho: {lowStockData.threshold}
                </p>
              </CardContent>
            </Card>
          </div>

        </>
      )}
    </div>
  );
}