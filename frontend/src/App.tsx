// ...existing code...
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import {
  UtensilsCrossed,
  LogOut,
  User,
  Wallet,
  ShoppingCart,
  QrCode,
  History,
  Gift,
  ScanLine,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "./components/ui/button";

import { HomePage } from "./components/HomePage";

import { CustomerHome } from "./components/customer/CustomerHome";
import { CustomerMenu } from "./components/customer/CustomerMenu";
import { CustomerOrder } from "./components/customer/CustomerOrder";
import { CustomerWallet } from "./components/customer/CustomerWallet";
import { CustomerOrderHistory } from "./components/customer/CustomerOrderHistory";
import { CustomerVoucher } from "./components/customer/CustomerVoucher";

import { StaffScanQR } from "./components/staff/StaffScanQR";
import { StaffTransactionLog } from "./components/staff/StaffTransactionLog";
import { StaffProfile } from "./components/staff/StaffProfile";

//import { ManagerDashboard } from "./components/manager/ManagerDashboard";
import { ManagerMenu } from "./components/manager/ManagerMenu";
import { ManagerVoucher } from "./components/manager/ManagerVoucher";
import { ManagerEmployees } from "./components/manager/ManagerEmployees";
import { ManagerBranch } from "./components/manager/ManagerBranch";
import { Reports } from "./components/manager/Reports";
import { ManagerFood } from "./components/manager/food/ManagerFood";
import { ManagerCustomer } from "./components/manager/ManagerCustomer";
type UserRole = "customer" | "staff" | "manager";
type CustomerPage = "home" | "menu" | "order" | "wallet" | "order-history" | "voucher";
type StaffPage = "scan-qr" | "transaction-log" | "profile";
type ManagerPage = "dashboard" | "menu" | "food" | "voucher" | "customer" | "employees" | "reports" | "branch";

interface User {
  id: string;
  name: string;
  role: UserRole;
  branchId?: string;
}

const BranchSelectionRequired = () => (
  <Alert variant="default" className="bg-yellow-50 border-yellow-300 text-yellow-800">
    <Settings className="h-4 w-4" />
    <AlertTitle>Yêu cầu chọn chi nhánh</AlertTitle>
    <AlertDescription>
      Vui lòng vào tab **Chi nhánh** để chọn chi nhánh đang quản lý trước khi sử dụng các chức năng khác.
    </AlertDescription>
  </Alert>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [customerPage, setCustomerPage] = useState<CustomerPage>("home");
  const [staffPage, setStaffPage] = useState<StaffPage>("scan-qr");
  const [managerPage, setManagerPage] = useState<ManagerPage>("dashboard");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [Address, setAddress] = useState<string | null>(null);
  
  const handleBranchChange = (branchId: string, branchAddress: string) => {
     setSelectedBranch(branchId);
+    setAddress(branchAddress);
+    setUser((prev) => (prev ? { ...prev, branchId } : prev));
  };
  

  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.slice(1);
      const [role, page] = hash.split("/");

      if (role === "customer" || role === "staff" || role === "manager") {
        setUser({
          id: "demo-user",
          name: "Người dùng demo",
          role,
          branchId: undefined,
        });

        if (role === "customer" && page) setCustomerPage(page as CustomerPage);
        if (role === "staff" && page) setStaffPage(page as StaffPage);
        if (role === "manager" && page) setManagerPage(page as ManagerPage);
      } else {
        setUser(null);
      }
    };

    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  const handleLogout = () => {
    window.location.hash = "";
    setUser(null);
    setSelectedBranch(null);
  };

  const goCustomerPage = (page: CustomerPage) => {
    window.location.hash = `customer/${page}`;
  };
  const goStaffPage = (page: StaffPage) => {
    window.location.hash = `staff/${page}`;
  };
  const goManagerPage = (page: ManagerPage) => {
    window.location.hash = `manager/${page}`;
  };

  if (!user) return <HomePage />;

  if (user.role === "customer") {
    const customerMenus = [
      { id: "home" as CustomerPage, label: "Trang chủ", icon: User },
      { id: "menu" as CustomerPage, label: "Menu", icon: UtensilsCrossed },
      { id: "order" as CustomerPage, label: "Đặt món", icon: ShoppingCart },
      { id: "wallet" as CustomerPage, label: "Ví điện tử", icon: Wallet },
      { id: "order-history" as CustomerPage, label: "Lịch sử", icon: History },
      { id: "voucher" as CustomerPage, label: "Voucher", icon: Gift },
    ];

    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Đặt món online</h1>
              </div>

              <div className="hidden md:flex md:items-center md:space-x-1">
                {customerMenus.map((item) => {
                  const Icon = item.icon;
                  const isActive = customerPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => goCustomerPage(item.id)}
                      className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Về trang chủ
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-6 lg:p-8">
          {customerPage === "home" && <CustomerHome user={user} onSelectBranch={setSelectedBranch} selectedBranch={selectedBranch} />}
          {customerPage === "menu" && <CustomerMenu branchId={selectedBranch} />}
          {customerPage === "order" && <CustomerOrder user={user} branchId={selectedBranch} />}
          {customerPage === "wallet" && <CustomerWallet user={user} />}
          {customerPage === "order-history" && <CustomerOrderHistory user={user} />}
          {customerPage === "voucher" && <CustomerVoucher user={user} />}
        </main>
      </div>
    );
  }

  if (user.role === "staff") {
    const staffMenus = [
      { id: "scan-qr" as StaffPage, label: "Quét QR", icon: QrCode },
      { id: "transaction-log" as StaffPage, label: "Lịch sử phục vụ", icon: FileText },
      { id: "profile" as StaffPage, label: "Hồ sơ", icon: User },
    ];

    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <ScanLine className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Nhân viên phục vụ</h1>
              </div>

              <div className="hidden md:flex md:items-center md:space-x-1">
                {staffMenus.map((item) => {
                  const Icon = item.icon;
                  const isActive = staffPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => goStaffPage(item.id)}
                      className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Về trang chủ
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-6 lg:p-8">
          {staffPage === "scan-qr" && <StaffScanQR user={user} />}
          {staffPage === "transaction-log" && <StaffTransactionLog user={user} />}
          {staffPage === "profile" && <StaffProfile user={user} />}
        </main>
      </div>
    );
  }

  const managerMenus = [
    { id: "dashboard" as ManagerPage, label: "Dashboard", icon: User },
    { id: "branch" as ManagerPage, label: "Chi nhánh", icon: FileText },
    { id: "menu" as ManagerPage, label: "Menu", icon: UtensilsCrossed },
    { id: "food" as ManagerPage, label: "Thức ăn", icon: UtensilsCrossed },
    { id: "voucher" as ManagerPage, label: "Voucher", icon: Gift },
    { id: "employees" as ManagerPage, label: "Nhân viên", icon: User },
    { id: "customer" as ManagerPage, label: "Khách hàng", icon: User },
    { id: "reports" as ManagerPage, label: "Báo cáo", icon: FileText },
  ];

    if (user.role === "manager") {
    const branchId = user.branchId ?? "";

    // cập nhật branchId trong state user khi manager đổi chi nhánh
    const handleManagerBranchChange = (newBranchId: string) => {
      setUser((prev) => (prev ? { ...prev, branchId: newBranchId } : prev));
    };

    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Quản lý chi nhánh</h1>
              </div>

              <div className="hidden md:flex md:items-center md:space-x-1">
                {managerMenus.map(({ id, label, icon: Icon }) => {
                  const isActive = managerPage === id;
                  return (
                    <button
                      key={id}
                      onClick={() => goManagerPage(id)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}

                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Về trang chủ
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-6 lg:p-8">
          {/* {managerPage === "dashboard" && <ManagerDashboard user={user} />} */}
          {managerPage === "voucher" && <ManagerVoucher user={user} />}
          {managerPage === "employees" && <ManagerEmployees />}
          {managerPage === "branch" && (
            <ManagerBranch 
        currentBranchId={selectedBranch} 
        // branchAddress ={}// Truyền state xuống
        onBranchChange={handleBranchChange} // Truyền hàm cập nhật state xuống  
      />
          )}
          {managerPage === "menu" && <ManagerMenu currentBranchId={selectedBranch ?? null} currentAddress={Address}/>}
          {managerPage === "food" && <ManagerFood currentBranchId={selectedBranch ?? null} currentAddress={Address} />}
          {managerPage === "reports" && <Reports />}
          {managerPage === 'customer' && <ManagerCustomer/>}
        </main>
      </div>
    );
  }

  return null;
}
// ...existing code...