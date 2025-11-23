import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Clock } from "lucide-react";

interface StaffInfo {
  StaffID: string;
  StaffName: string;
  Email: string;
  Phone: string;
  Position: string;
  BranchName: string;
  StartDate: string;
  Status: string;
  TotalOrdersServed?: number;
}

interface StaffProfileProps {
  user: { id: string; name: string; branchId?: string };
}

// Mock staff info
const mockStaffInfo: StaffInfo = {
  StaffID: "621133675424",
  StaffName: "Nguyễn Minh Tín",
  Email: "minhtin123@fooddy.vn",
  Phone: "0901111111",
  Position: "Manager",
  BranchName: "Chi nhánh Nguyễn Văn Cừ",
  StartDate: "2023-01-10",
  Status: "Đang làm",
  TotalOrdersServed: 45,
};

export function StaffProfile({ user }: StaffProfileProps) {
  const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStaffInfo();
  }, [user.id]);

  const fetchStaffInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/staff/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setStaffInfo(data);
      } else {
        // Fallback to mock data
        setStaffInfo(mockStaffInfo);
      }
    } catch (error) {
      console.error("Error fetching staff info:", error);
      // Fallback to mock data
      setStaffInfo(mockStaffInfo);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!staffInfo) {
    return <div>Không tìm thấy thông tin</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hồ sơ nhân viên</h1>
        <p className="text-muted-foreground">Thông tin cá nhân và thống kê</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Thông tin cá nhân */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Thông tin cá nhân</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{staffInfo.StaffName}</p>
                <Badge>{staffInfo.Position}</Badge>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{staffInfo.Email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{staffInfo.Phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Chi nhánh</p>
                  <p className="font-medium">{staffInfo.BranchName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày vào làm</p>
                  <p className="font-medium">
                    {new Date(staffInfo.StartDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  <Badge
                    variant={
                      staffInfo.Status === "Đang làm" ? "default" : "secondary"
                    }
                  >
                    {staffInfo.Status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thống kê */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Tổng đơn đã phục vụ
                </p>
                <p className="text-3xl font-bold text-primary">
                  {staffInfo.TotalOrdersServed || 0}
                </p>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Hôm nay</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Tháng này</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
