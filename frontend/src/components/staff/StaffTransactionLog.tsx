import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { FileText, Calendar, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TransactionLog {
  LogID: string;
  OrderID: string;
  StaffID: string;
  StaffName: string;
  CreatedAt: string;
  CustomerName?: string;
  TotalAmount?: number;
}

interface StaffTransactionLogProps {
  user: { id: string; name: string; branchId?: string };
  isManager?: boolean;
}

// Mock transaction logs
const mockLogs: TransactionLog[] = [
  {
    LogID: "301",
    OrderID: "9001",
    StaffID: "621133675424",
    StaffName: "Nguyễn Minh Tín",
    CreatedAt: "2025-10-27T12:10:00",
    CustomerName: "Nguyễn Văn Linh",
    TotalAmount: 22500,
  },
  {
    LogID: "302",
    OrderID: "9002",
    StaffID: "621133675424",
    StaffName: "Nguyễn Minh Tín",
    CreatedAt: "2025-10-27T13:10:00",
    CustomerName: "Trần Thị Hà Linh",
    TotalAmount: 36000,
  },
  {
    LogID: "303",
    OrderID: "9003",
    StaffID: "621133675424",
    StaffName: "Nguyễn Minh Tín",
    CreatedAt: "2025-10-28T14:15:00",
    CustomerName: "Lê Văn Quân",
    TotalAmount: 40000,
  },
];

export function StaffTransactionLog({ user, isManager = false }: StaffTransactionLogProps) {
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [shiftFilter, setShiftFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, [user.id, dateFilter, shiftFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const url = isManager
        ? `http://localhost:3000/api/transaction-logs?branchId=${user.branchId}&date=${dateFilter}&shift=${shiftFilter}`
        : `http://localhost:3000/api/transaction-logs?staffId=${user.id}&date=${dateFilter}&shift=${shiftFilter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLogs(data || []);
      } else {
        // Fallback to mock data
        setLogs(mockLogs);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      // Fallback to mock data
      setLogs(mockLogs);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.OrderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getShiftName = (date: string) => {
    const hour = new Date(date).getHours();
    if (hour >= 6 && hour < 12) return "Sáng";
    if (hour >= 12 && hour < 18) return "Chiều";
    return "Tối";
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isManager ? "Log phục vụ chi nhánh" : "Lịch sử phục vụ"}
        </h1>
        <p className="text-muted-foreground">
          {isManager
            ? "Xem log phục vụ của tất cả nhân viên trong chi nhánh"
            : "Xem lịch sử các đơn hàng đã phục vụ"}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã đơn..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ngày</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="yesterday">Hôm qua</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="all">Tất cả</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ca</label>
              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="morning">Sáng (6h-12h)</SelectItem>
                  <SelectItem value="afternoon">Chiều (12h-18h)</SelectItem>
                  <SelectItem value="evening">Tối (18h-24h)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách log ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Mã đơn</TableHead>
                  {isManager && <TableHead>Nhân viên</TableHead>}
                  {isManager && <TableHead>Khách hàng</TableHead>}
                  {isManager && <TableHead>Số tiền</TableHead>}
                  <TableHead>Ca</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isManager ? 6 : 4}
                      className="text-center text-muted-foreground"
                    >
                      Chưa có log nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.LogID}>
                      <TableCell>
                        {new Date(log.CreatedAt).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.OrderID}</Badge>
                      </TableCell>
                      {isManager && (
                        <>
                          <TableCell>{log.StaffName}</TableCell>
                          <TableCell>{log.CustomerName || "-"}</TableCell>
                          <TableCell>
                            {log.TotalAmount
                              ? `${log.TotalAmount.toLocaleString("vi-VN")}đ`
                              : "-"}
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Badge variant="secondary">
                          {getShiftName(log.CreatedAt)}
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
