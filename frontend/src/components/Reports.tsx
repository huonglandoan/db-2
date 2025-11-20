import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from "lucide-react";

const monthlyRevenue = [
  { month: "T1", revenue: 45000, orders: 150, profit: 12000 },
  { month: "T2", revenue: 52000, orders: 180, profit: 15600 },
  { month: "T3", revenue: 48000, orders: 165, profit: 13200 },
  { month: "T4", revenue: 61000, orders: 210, profit: 18300 },
  { month: "T5", revenue: 55000, orders: 190, profit: 16500 },
  { month: "T6", revenue: 67000, orders: 230, profit: 20100 },
];

const categoryRevenue = [
  { name: "Món chính", value: 120000, percent: 40 },
  { name: "Menu hàng ngày", value: 90000, percent: 30 },
  { name: "Đồ uống", value: 60000, percent: 20 },
  { name: "Khai vị & Tráng miệng", value: 30000, percent: 10 },
];

const topProducts = [
  { name: "Phở bò đặc biệt", sold: 245, revenue: 15925000 },
  { name: "Bún chả Hà Nội", sold: 189, revenue: 10395000 },
  { name: "Menu hàng ngày", sold: 156, revenue: 18720000 },
  { name: "Cơm rang dương châu", sold: 176, revenue: 8800000 },
  { name: "Canh chua cá lóc", sold: 134, revenue: 9380000 },
];

const COLORS = ["#c65d21", "#e07a3d", "#f4a261", "#d4a574"];

export function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Thống kê báo cáo</h1>
        <p className="text-muted-foreground">
          Phân tích doanh thu và hiệu suất kinh doanh
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Doanh thu tháng</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67,000,000đ</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +21.8% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Lợi nhuận</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20,100,000đ</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +18.5% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">230</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +20 đơn hàng
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Giá trị TB/Đơn</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">291,304đ</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="mr-1 h-3 w-3" />
              -2.3% so với tháng trước
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="comparison">So sánh</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4e4d7" />
                    <XAxis dataKey="month" stroke="#8b7355" />
                    <YAxis stroke="#8b7355" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #c65d21"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#c65d21"
                      fill="#ffd7b8"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lợi nhuận theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4e4d7" />
                    <XAxis dataKey="month" stroke="#8b7355" />
                    <YAxis stroke="#8b7355" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #c65d21"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#c65d21"
                      strokeWidth={3}
                      dot={{ fill: "#c65d21", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  {categoryRevenue.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-4 w-4 rounded"
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{category.value.toLocaleString('vi-VN')}đ</p>
                        <p className="text-sm text-muted-foreground">{category.percent}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4e4d7" />
                  <XAxis type="number" stroke="#8b7355" />
                  <YAxis type="category" dataKey="name" stroke="#8b7355" width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #c65d21"
                    }}
                  />
                  <Bar dataKey="sold" fill="#c65d21" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi tiết sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <span className="font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Đã bán: {product.sold} sản phẩm
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.revenue.toLocaleString('vi-VN')}đ</p>
                      <p className="text-sm text-muted-foreground">Doanh thu</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>So sánh doanh thu và đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4e4d7" />
                  <XAxis dataKey="month" stroke="#8b7355" />
                  <YAxis stroke="#8b7355" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #c65d21"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#c65d21" name="Doanh thu" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="orders" fill="#e07a3d" name="Đơn hàng" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}