import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Plus, Search, Edit, Trash2, Users, UserCheck, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Employee {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  startDate: string;
  salary: number;
  status: string;
}

const initialEmployees: Employee[] = [
  { id: "NV001", name: "Nguyễn Văn Nam", position: "Quản lý", phone: "0901111111", email: "nam@company.com", startDate: "15/01/2022", salary: 20000000, status: "Đang làm" },
  { id: "NV002", name: "Trần Thị Lan", position: "Nhân viên bán hàng", phone: "0902222222", email: "lan@company.com", startDate: "20/03/2023", salary: 12000000, status: "Đang làm" },
  { id: "NV003", name: "Lê Văn Hùng", position: "Nhân viên kho", phone: "0903333333", email: "hung@company.com", startDate: "10/05/2023", salary: 10000000, status: "Đang làm" },
  { id: "NV004", name: "Phạm Thị Mai", position: "Kế toán", phone: "0904444444", email: "mai@company.com", startDate: "01/02/2022", salary: 15000000, status: "Đang làm" },
  { id: "NV005", name: "Hoàng Văn Tuấn", position: "Nhân viên bán hàng", phone: "0905555555", email: "tuan@company.com", startDate: "15/09/2024", salary: 12000000, status: "Nghỉ phép" },
  { id: "NV006", name: "Vũ Thị Hoa", position: "Nhân viên bán hàng", phone: "0906666666", email: "hoa@company.com", startDate: "01/07/2023", salary: 12000000, status: "Đang làm" },
];

export function ManagerEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone.includes(searchTerm) ||
    employee.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Quản lý nhân viên</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin và hiệu suất làm việc của nhân viên
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Tổng nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số nhân viên
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Đang làm việc</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.filter(e => e.status === "Đang làm").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Nhân viên đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Nghỉ phép</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.filter(e => e.status === "Nghỉ phép").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Hôm nay
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách nhân viên</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm nhân viên
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm nhân viên mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee-name">Họ và tên</Label>
                    <Input id="employee-name" placeholder="Nhập họ và tên" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Vị trí</Label>
                    <Select>
                      <SelectTrigger id="position">
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Quản lý</SelectItem>
                        <SelectItem value="sales">Nhân viên bán hàng</SelectItem>
                        <SelectItem value="warehouse">Nhân viên kho</SelectItem>
                        <SelectItem value="accounting">Kế toán</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-phone">Số điện thoại</Label>
                    <Input id="emp-phone" placeholder="0901234567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-email">Email</Label>
                    <Input id="emp-email" type="email" placeholder="email@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Lương cơ bản</Label>
                    <Input id="salary" type="number" placeholder="0" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button onClick={() => setIsDialogOpen(false)}>
                      Thêm nhân viên
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
                placeholder="Tìm kiếm nhân viên..."
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
                  <TableHead>Mã NV</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ngày vào làm</TableHead>
                  <TableHead>Lương</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.startDate}</TableCell>
                    <TableCell>{employee.salary.toLocaleString('vi-VN')}đ</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.status === "Đang làm"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {employee.status}
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
                          onClick={() => handleDelete(employee.id)}
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
