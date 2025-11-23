import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Clock, Phone } from "lucide-react";
import { Badge } from "../ui/badge";

interface Branch {
  BranchID: string;
  BranchName: string;
  Address: string;
  OpeningHours: string;
  Hotline: string;
}

interface CustomerHomeProps {
  user: { id: string; name: string; role: string };
  onSelectBranch: (branchId: string) => void;
  selectedBranch: string | null;
}

// Mock data
const mockBranches: Branch[] = [
  {
    BranchID: "1",
    BranchName: "Chi nhánh Nguyễn Văn Cừ",
    Address: "123 Nguyễn Văn Cừ, Q5, HCM",
    OpeningHours: "7:00-22:00",
    Hotline: "0901234567",
  },
  {
    BranchID: "2",
    BranchName: "Chi nhánh Lý Thường Kiệt",
    Address: "45 Lý Thường Kiệt, Q10, HCM",
    OpeningHours: "8:00-21:00",
    Hotline: "0909876543",
  },
  {
    BranchID: "3",
    BranchName: "Chi nhánh Hai Bà Trưng",
    Address: "12 Hai Bà Trưng, Q1, HCM",
    OpeningHours: "6:30-23:00",
    Hotline: "0911222333",
  },
  {
    BranchID: "4",
    BranchName: "Chi nhánh Võ Thị Sáu",
    Address: "689 Võ Thị Sáu, Q7, HCM",
    OpeningHours: "8:00-21:00",
    Hotline: "0909876598",
  },
  {
    BranchID: "5",
    BranchName: "Chi nhánh Quang Trung",
    Address: "699 Quang Trung, Q9, HCM",
    OpeningHours: "8:00-21:00",
    Hotline: "0909800011",
  },
];

export function CustomerHome({ onSelectBranch, selectedBranch }: CustomerHomeProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/branches");
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      } else {
        // Fallback to mock data
        setBranches(mockBranches);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      // Fallback to mock data
      setBranches(mockBranches);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chọn chi nhánh</h1>
        <p className="text-muted-foreground">Chọn chi nhánh để xem menu và đặt món</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <Card
            key={branch.BranchID}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedBranch === branch.BranchID ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelectBranch(branch.BranchID)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {branch.BranchName}
                {selectedBranch === branch.BranchID && (
                  <Badge>Đã chọn</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{branch.Address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{branch.OpeningHours}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{branch.Hotline}</span>
              </div>
              <Button className="w-full mt-4">
                Chọn chi nhánh này
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}