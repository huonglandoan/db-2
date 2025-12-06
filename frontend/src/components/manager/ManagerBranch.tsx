import { useState, useEffect } from "react";
import { MapPin, Store, Phone, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const API_BASE_URL = 'http://localhost:3000';

export interface Branch {
  id: string;
  address: string;
  phone: string;
  manager_id: string;
  manager_name: string;
  status: "active" | "inactive";
  opening_hour: string;
}


function normalizeStatus(raw: any): "active" | "inactive" {
  if (!raw) return "inactive";
  const s = String(raw).toLowerCase().trim();
  return s === "active" ? "active" : "inactive";
}

// Load dữ liệu từ API và chuẩn hóa về Branch[]
async function loadBranchesFromAPI(): Promise<Branch[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/branch`);

    if (!response.ok) {
      console.error(`Branch API lỗi ${response.status}: không thể tải dữ liệu chi nhánh`);
      return [];
    }

    const data = await response.json();
    console.log("RAW FROM API:", data);

    const rows = Array.isArray(data)
      ? data
      : Array.isArray(data?.rows)
      ? data.rows
      : [];

    const mapped: Branch[] = rows.map((r: any) => ({
      id: String(r.id),
      address: r.address ?? "",
      phone: r.phone ?? "",
      manager_id: r.manager_id ?? "",
      manager_name: r.manager_name ?? "",
      status: normalizeStatus(r.status),
      opening_hour: r.opening_hour ?? "",
}));


    return mapped;
  } catch (error) {
    console.error("Không kết nối được API /branch:", error);
    return [];
  }
}

interface BranchManagementProps {
  currentBranchId: string | null;
  onBranchChange: (branchId: string, branchAddress: string) => void;
}

export function ManagerBranch({ currentBranchId, onBranchChange }: BranchManagementProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await loadBranchesFromAPI();
        console.log("DATA FROM API:", data); 
        setBranches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu chi nhánh:", err);
        setError((err as Error).message || "Đã xảy ra lỗi khi kết nối API.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const currentBranch = branches.find(branch => branch.id === currentBranchId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-primary bg-gradient-to-r from-primary/10 to-accent/20 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <h2 className="text-primary">Chi nhánh hiện tại</h2>
            </div>

            {currentBranch ? (
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{currentBranch.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{currentBranch.phone}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Quản lý: {currentBranch.manager_name || "Chưa có"}</p>
                <p className="text-sm text-muted-foreground">Thời gian hoạt động: {currentBranch.opening_hour}</p>
                <p className="text-sm text-muted-foreground">Trạng thái: {currentBranch.status}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Chưa chọn chi nhánh</p>
            )}
          </div>

          {currentBranch?.status === "active" && (
            <Badge className="bg-primary text-primary-foreground">Đang hoạt động</Badge>
          )}
        </div>
      </div>

      {/* Danh sách chi nhánh */}
      <div>
        <h2 className="mb-4 text-foreground">Tất cả chi nhánh</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches.map(branch => {
            const isCurrent = branch.id === currentBranchId;
            return (
              <Card
                key={branch.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isCurrent ? "border-primary ring-2 ring-primary ring-offset-2" : "hover:border-primary/50"
                }`}
                onClick={() => onBranchChange(branch.id, branch.address)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
              
                    </div>
                    {isCurrent && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <CardDescription>{branch.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{branch.phone}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Quản lý: {branch.manager_name || "Chưa có"}</p>
                  {isCurrent ? (
                    <Button className="w-full" disabled>
                      <Check className="mr-2 h-4 w-4" />
                      Chi nhánh hiện tại
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" onClick={(e) => { e.stopPropagation(); onBranchChange(branch.id, branch.address); }}>
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
          <CardHeader><CardTitle>Tổng chi nhánh</CardTitle></CardHeader>
          <CardContent><p className="text-3xl text-primary">{branches.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Đang hoạt động</CardTitle></CardHeader>
          <CardContent><p className="text-3xl text-primary">{branches.filter(b => b.status === "active").length}</p></CardContent>
        </Card>
       
      </div>
    </div>
  );
}
