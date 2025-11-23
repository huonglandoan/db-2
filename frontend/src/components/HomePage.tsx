import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { UtensilsCrossed, LogIn } from "lucide-react";

export function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <UtensilsCrossed className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Hệ thống quản lý nhà hàng</CardTitle>
          <p className="text-muted-foreground mt-2">
            Hệ cơ sở dữ liệu - BTL2
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Để truy cập các chức năng, vui lòng thêm route vào URL:
            </p>
            <div className="bg-accent p-4 rounded-lg space-y-2 text-sm">
              <p><strong>#customer</strong> - Giao diện khách hàng</p>
              <p><strong>#staff</strong> - Giao diện nhân viên</p>
              <p><strong>#manager</strong> - Giao diện quản lý</p>
            </div>
          </div>
          <Button className="w-full" disabled>
            <LogIn className="mr-2 h-4 w-4" />
            Đăng nhập (Chức năng demo)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
