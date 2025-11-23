import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, ShoppingCart, Users, UtensilsCrossed, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalFoods: number;
  revenueByDay: { date: string; revenue: number }[];
  ordersByDay: { date: string; orders: number }[];
}

interface ManagerDashboardProps {
  user: { id: string; name: string; branchId?: string };
}

// Mock dashboard stats
const mockStats: DashboardStats = {
  totalRevenue: 328000000,
  totalOrders: 2350,
  totalCustomers: 1429,
  totalFoods: 89,
  revenueByDay: [
    { date: "01/10", revenue: 4500000 },
    { date: "02/10", revenue: 5200000 },
    { date: "03/10", revenue: 4800000 },
    { date: "04/10", revenue: 6100000 },
    { date: "05/10", revenue: 5500000 },
    { date: "06/10", revenue: 6700000 },
  ],
  ordersByDay: [
    { date: "01/10", orders: 120 },
    { date: "02/10", orders: 145 },
    { date: "03/10", orders: 130 },
    { date: "04/10", orders: 165 },
    { date: "05/10", orders: 150 },
    { date: "06/10", orders: 180 },
  ],
};

export function ManagerDashboard({ user }: ManagerDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user.branchId]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/dashboard?branchId=${user.branchId}`
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Fallback to mock data
        setStats(mockStats);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Fallback to mock data
      setStats(mockStats);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!stats) {
    return <div>Không có dữ liệu</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard chi nhánh</h1>
        <p className="text-muted-foreground">Tổng quan hoạt động chi nhánh</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString("vi-VN")}đ
            </div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Tổng số đơn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Khách hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Món ăn</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFoods}</div>
            <p className="text-xs text-muted-foreground">Trong menu</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#c65d21" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#e07a3d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
