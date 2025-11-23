import { ProductManagement } from "../ProductManagement";

interface ManagerMenuProps {
  user: { id: string; name: string; branchId?: string };
}

export function ManagerMenu({ user }: ManagerMenuProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý Menu</h1>
        <p className="text-muted-foreground">
          Quản lý món ăn và menu hàng ngày cho chi nhánh
        </p>
      </div>
      <ProductManagement />
    </div>
  );
}
