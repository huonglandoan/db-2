import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Users, Search, UserCheck, Clock } from "lucide-react";

interface Employee {
  StaffID: string;
  StaffName: string;
  Email: string;
  Phone: string;
  Position: string;
  StartDate: string;
  Status: string;
}

interface ManagerEmployeesProps {
  user: { id: string; name: string; branchId?: string };
}

// Mock employees
const mockEmployees: Employee[] = [
  {
    StaffID: "621133675424",
    StaffName: "Nguyễn Minh Tín",
    Email: "minhtin123@fooddy.vn",
    Phone: "0901111111",
    Position: "Manager",
    StartDate: "2023-01-10",
    Status: "Đang làm",
  },
  {
    StaffID: "621133675626",
    StaffName: "Lê Nguyễn Minh Thư",
    Email: "minthu910@fooddy.vn",
    Phone: "0903333333",
    Position: "Staff",
    StartDate: "2023-06-05",
    Status: "Đang làm",
  },
];

export function ManagerEmployees({ user }: ManagerEmployeesProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, [user.branchId]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/staff?branchId=${user.branchId}`
      );
      if (response.ok) {
        const data = await response.json();
        setEmployees(data || []);
      } else {
        // Fallback to mock data
        setEmployees(mockEmployees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      // Fallback to mock data
      setEmployees(mockEmployees);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.StaffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.StaffID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.Phone.includes(searchTerm)
  );

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
        <p className="text-muted-foreground">Xem danh sách nhân viên trong chi nhánh</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Tổng nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Tổng số nhân viên</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Đang làm việc</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.filter((e) => e.Status === "Đang làm").length}
            </div>
            <p className="text-xs text-muted-foreground">Nhân viên đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Nghỉ phép</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.filter((e) => e.Status === "Nghỉ phép").length}
            </div>
            <p className="text-xs text-muted-foreground">Hôm nay</p>
          </CardContent>
        </Card>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách nhân viên</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Không tìm thấy nhân viên nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.StaffID}>
                      <TableCell>{employee.StaffID}</TableCell>
                      <TableCell className="font-medium">{employee.StaffName}</TableCell>
                      <TableCell>{employee.Position}</TableCell>
                      <TableCell>{employee.Phone}</TableCell>
                      <TableCell>{employee.Email}</TableCell>
                      <TableCell>
                        {new Date(employee.StartDate).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            employee.Status === "Đang làm" ? "default" : "secondary"
                          }
                        >
                          {employee.Status}
                        </Badge>
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
