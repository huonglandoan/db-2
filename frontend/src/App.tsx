import { useState, useEffect } from "react";
import { UtensilsCrossed, LogOut, User, Wallet, ShoppingCart, QrCode, History, Gift, ScanLine, FileText, Settings } from "lucide-react";
import { Button } from "./components/ui/button";

// Import HomePage
import { HomePage } from "./components/HomePage";

// Import các component
import { CustomerHome } from "./components/customer/CustomerHome";
import { CustomerMenu } from "./components/customer/CustomerMenu";
import { CustomerOrder } from "./components/customer/CustomerOrder";
import { CustomerWallet } from "./components/customer/CustomerWallet";
import { CustomerOrderHistory } from "./components/customer/CustomerOrderHistory";
import { CustomerVoucher } from "./components/customer/CustomerVoucher";
import { StaffScanQR } from "./components/staff/StaffScanQR";
import { StaffTransactionLog } from "./components/staff/StaffTransactionLog";
import { StaffProfile } from "./components/staff/StaffProfile";
import { ManagerDashboard } from "./components/manager/ManagerDashboard";
import { ManagerMenu } from "./components/manager/ManagerMenu";
import { ManagerVoucher } from "./components/manager/ManagerVoucher";
import { ManagerEmployees } from "./components/manager/ManagerEmployees";

// Types
type UserRole = "customer" | "staff" | "manager" | null;
type CustomerPage = "home" | "menu" | "order" | "wallet" | "order-history" | "voucher";
type StaffPage = "scan-qr" | "transaction-log" | "profile";
type ManagerPage = "dashboard" | "menu" | "voucher" | "employees" | "logs";

interface User {
  id: string;
  name: string;
  role: UserRole;
  branchId?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [customerPage, setCustomerPage] = useState<CustomerPage>("home");
  const [staffPage, setStaffPage] = useState<StaffPage>("scan-qr");
  const [managerPage, setManagerPage] = useState<ManagerPage>("dashboard");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Đọc role từ URL hash (#customer, #staff, #manager)
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Bỏ dấu #
    
    if (hash === "customer" || hash === "staff" || hash === "manager") {
      setUser({
        id: "demo-user",
        name: "Người dùng demo",
        role: hash as UserRole,
        branchId: hash === "staff" || hash === "manager" ? "BR001" : undefined,
      });
    } else {
      setUser(null);
    }

    // Lắng nghe thay đổi hash
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (newHash === "customer" || newHash === "staff" || newHash === "manager") {
        setUser({
          id: "demo-user",
          name: "Người dùng demo",
          role: newHash as UserRole,
          branchId: newHash === "staff" || newHash === "manager" ? "BR001" : undefined,
        });
      } else {
        setUser(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLogout = () => {
    window.location.hash = "";
    setUser(null);
    setSelectedBranch(null);
  };

  // Nếu chưa có role, hiển thị HomePage
  if (!user) {
    return <HomePage />;
  }

  // Render theo role
  if (user.role === "customer") {
    return (
      <div className="min-h-screen bg-background">
        {/* Customer Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Đặt món online</h1>
              </div>

              <div className="hidden md:flex md:items-center md:space-x-1">
                {[
                  { id: "home" as CustomerPage, label: "Trang chủ", icon: User },
                  { id: "menu" as CustomerPage, label: "Menu", icon: UtensilsCrossed },
                  { id: "order" as CustomerPage, label: "Đặt món", icon: ShoppingCart },
                  { id: "wallet" as CustomerPage, label: "Ví điện tử", icon: Wallet },
                  { id: "order-history" as CustomerPage, label: "Lịch sử", icon: History },
                  { id: "voucher" as CustomerPage, label: "Voucher", icon: Gift },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = customerPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCustomerPage(item.id)}
                      className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Về trang chủ
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-6 lg:p-8">
          {customerPage === "home" && (
            <CustomerHome 
              user={user} 
              onSelectBranch={setSelectedBranch}
              selectedBranch={selectedBranch}
            />
          )}
          {customerPage === "menu" && (
            <CustomerMenu branchId={selectedBranch} />
          )}
          {customerPage === "order" && (
            <CustomerOrder user={user} branchId={selectedBranch} />
          )}
          {customerPage === "wallet" && (
            <CustomerWallet user={user} />
          )}
          {customerPage === "order-history" && (
            <CustomerOrderHistory user={user} />
          )}
          {customerPage === "voucher" && (
            <CustomerVoucher user={user} />
          )}
        </main>
      </div>
    );
  }

  if (user.role === "staff") {
    return (
      <div className="min-h-screen bg-background">
        {/* Staff Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <ScanLine className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Nhân viên phục vụ</h1>
              </div>

              <div className="hidden md:flex md:items-center md:space-x-1">
                {[
                  { id: "scan-qr" as StaffPage, label: "Quét QR", icon: QrCode },
                  { id: "transaction-log" as StaffPage, label: "Lịch sử phục vụ", icon: FileText },
                  { id: "profile" as StaffPage, label: "Hồ sơ", icon: User },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = staffPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setStaffPage(item.id)}
                      className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Về trang chủ
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

  if (user.role === "manager") {
    return (
      <div className="min-h-screen bg-background">
        {/* Manager Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Quản lý chi nhánh</h1>
              </div>

              <div className="hidden md:flex md:items-center md:space-x-1">
                {[
                  { id: "dashboard" as ManagerPage, label: "Dashboard", icon: User },
                  { id: "menu" as ManagerPage, label: "Quản lý Menu", icon: UtensilsCrossed },
                  { id: "voucher" as ManagerPage, label: "Voucher", icon: Gift },
                  { id: "employees" as ManagerPage, label: "Nhân viên", icon: User },
                  { id: "logs" as ManagerPage, label: "Log phục vụ", icon: FileText },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = managerPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setManagerPage(item.id)}
                      className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Về trang chủ
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-6 lg:p-8">
          {managerPage === "dashboard" && <ManagerDashboard user={user} />}
          {managerPage === "menu" && <ManagerMenu user={user} />}
          {managerPage === "voucher" && <ManagerVoucher user={user} />}
          {managerPage === "employees" && <ManagerEmployees user={user} />}
          {managerPage === "logs" && <StaffTransactionLog user={user} isManager={true} />}
        </main>
      </div>
    );
  }

  return null;
}