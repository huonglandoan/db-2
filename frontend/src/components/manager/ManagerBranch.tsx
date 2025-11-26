import { useState } from "react";
import { MapPin, Store, Phone, Mail, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: "active" | "inactive";
}

const initialBranches: Branch[] = [
  {
    id: "1",
    name: "Chi nhánh Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "028 1234 5678",
    email: "quan1@restaurant.com",
    manager: "Nguyễn Văn A",
    status: "active",
  },
  {
    id: "2",
    name: "Chi nhánh Quận 3",
    address: "456 Lê Văn Sỹ, Quận 3, TP.HCM",
    phone: "028 8765 4321",
    email: "quan3@restaurant.com",
    manager: "Trần Thị B",
    status: "active",
  },
  {
    id: "3",
    name: "Chi nhánh Bình Thạnh",
    address: "789 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM",
    phone: "028 9999 8888",
    email: "binhthanh@restaurant.com",
    manager: "Lê Văn C",
    status: "active",
  },
  {
    id: "4",
    name: "Chi nhánh Tân Bình",
    address: "321 Cộng Hòa, Tân Bình, TP.HCM",
    phone: "028 7777 6666",
    email: "tanbinh@restaurant.com",
    manager: "Phạm Thị D",
    status: "active",
  },
];

interface BranchManagementProps {
  currentBranchId: string;
  onBranchChange: (branchId: string) => void;
}

export function ManagerBranch({ currentBranchId, onBranchChange }: BranchManagementProps) {
  const [branches] = useState<Branch[]>(initialBranches);

  const currentBranch = branches.find((b) => b.id === currentBranchId);

  return (
    <div className="space-y-6">
      {/* Header với thông tin chi nhánh hiện tại */}
      <div className="rounded-lg border border-primary bg-gradient-to-r from-primary/10 to-accent/20 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <h2 className="text-primary">Chi nhánh hiện tại</h2>
            </div>
            {currentBranch && (
              <div className="mt-3 space-y-2">
                <h3 className="text-foreground">{currentBranch.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{currentBranch.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{currentBranch.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{currentBranch.email}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Quản lý: {currentBranch.manager}
                </p>
              </div>
            )}
          </div>
          <Badge className="bg-primary text-primary-foreground">Đang hoạt động</Badge>
        </div>
      </div>

      {/* Danh sách tất cả chi nhánh */}
      <div>
        <h2 className="mb-4 text-foreground">Tất cả chi nhánh</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => {
            const isActive = branch.id === currentBranchId;
            return (
              <Card
                key={branch.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isActive
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "hover:border-primary/50"
                }`}
                onClick={() => onBranchChange(branch.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      <CardTitle>{branch.name}</CardTitle>
                    </div>
                    {isActive && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <CardDescription>{branch.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{branch.email}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      Quản lý: {branch.manager}
                    </p>
                  </div>
                  {isActive ? (
                    <Button className="w-full" variant="default" disabled>
                      <Check className="mr-2 h-4 w-4" />
                      Chi nhánh hiện tại
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBranchChange(branch.id);
                      }}
                    >
                      Chuyển chi nhánh
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tổng chi nhánh</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-primary">{branches.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-primary">
              {branches.filter((b) => b.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chi nhánh của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{currentBranch?.name}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}