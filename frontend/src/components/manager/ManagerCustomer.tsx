import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Plus, Search, Edit, Trash2, UserCheck, Users, UserPlus } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  type: string;
}

const initialCustomers: Customer[] = [
  { id: "KH001", name: "Nguyễn Văn A", phone: "0901234567", email: "nguyenvana@email.com", totalOrders: 12, totalSpent: 45000000, type: "VIP" },
  { id: "KH002", name: "Trần Thị B", phone: "0912345678", email: "tranthib@email.com", totalOrders: 8, totalSpent: 32000000, type: "Thường" },
  { id: "KH003", name: "Lê Văn C", phone: "0923456789", email: "levanc@email.com", totalOrders: 5, totalSpent: 18000000, type: "Thường" },
  { id: "KH004", name: "Phạm Thị D", phone: "0934567890", email: "phamthid@email.com", totalOrders: 15, totalSpent: 67000000, type: "VIP" },
  { id: "KH005", name: "Hoàng Văn E", phone: "0945678901", email: "hoangvane@email.com", totalOrders: 3, totalSpent: 9000000, type: "Mới" },
  { id: "KH006", name: "Vũ Thị F", phone: "0956789012", email: "vuthif@email.com", totalOrders: 20, totalSpent: 95000000, type: "VIP" },
];

export function ManagerCustomer() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Quản lý khách hàng</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin và lịch sử mua hàng của khách hàng
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Tổng khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số khách hàng đăng ký
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Khách VIP</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.type === "VIP").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Khách hàng thân thiết
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Khách hàng mới</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.type === "Mới").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Tháng này
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách khách hàng</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm khách hàng
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm khách hàng mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Họ và tên</Label>
                    <Input id="customer-name" placeholder="Nhập họ và tên" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="0901234567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button onClick={() => setIsDialogOpen(false)}>
                      Thêm khách hàng
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã KH</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Tổng chi tiêu</TableHead>
                  <TableHead>Loại KH</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>{customer.totalSpent.toLocaleString('vi-VN')}đ</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.type === "VIP"
                            ? "default"
                            : customer.type === "Mới"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {customer.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
