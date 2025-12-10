import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"; 
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"; 
import { Loader2, AlertCircle, BarChart3 } from "lucide-react";

const API_BASE = "http://localhost:3000";

interface Branch {
  id: string;   
  address: string;   
}

/**
 * Interface cho kết quả trả về từ GetTopSellingFoods()
 */
interface TopFoodResult {
    Food_ID: number;
    Food_name: string;
    Total_Sold: number;
}

export function TopSellingFoodsPage() {
    // 1. Quản lý danh sách chi nhánh và chi nhánh được chọn (Tách khỏi Reports.tsx)
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

    // 2. State và logic báo cáo Top Selling Foods (Logic ban đầu)
    const [minQuantityReport, setMinQuantityReport] = useState<string>("50"); 
    const [topFoodsData, setTopFoodsData] = useState<TopFoodResult[] | null>(null);
    const [topFoodsLoading, setTopFoodsLoading] = useState(false);
    const [topFoodsError, setTopFoodsError] = useState<string>("");
    const [branchLoading, setBranchLoading] = useState(true);
    const [branchError, setBranchError] = useState<string>("");

    // Fetch Branches (Tách khỏi Reports.tsx)
    useEffect(() => {
        setBranchLoading(true);
        fetch(`${API_BASE}/branch`)
            .then(res => {
               if (!res.ok) {
                    throw new Error('Không thể tải danh sách chi nhánh');
               }
               return res.json();
            })
            .then(data => {
               setBranches(data);
                if (data.length > 0) {
                    setSelectedBranchId(data[0].id);
                }
            })
            .catch(err => {
               setBranchError(err.message || "Lỗi tải danh sách chi nhánh");
            })
            .finally(() => {
                setBranchLoading(false);
            });
    }, []);
    

    const handleGenerateTopFoodsReport = async () => {
        if (!selectedBranchId || !minQuantityReport) {
            setTopFoodsError("Vui lòng chọn chi nhánh và điền số lượng bán tối thiểu.");
            return;
        }
        
        const minQuantity = parseInt(minQuantityReport);
        if (isNaN(minQuantity) || minQuantity <= 0) {
            setTopFoodsError('Số lượng bán tối thiểu phải là số nguyên dương.');
            return;
        }
        
        setTopFoodsLoading(true);
        setTopFoodsError("");
        setTopFoodsData(null); 
        
        try {
            // Gọi thủ tục GetTopSellingFoods() qua API endpoint
            const res = await fetch(
                `${API_BASE}/calc/top-selling-foods?branchId=${selectedBranchId}&minQuantity=${minQuantity}`
            );
            
            if (!res.ok) {
                const jsonErr = await res.json().catch(() => ({}));
                throw new Error(jsonErr.error || `Lỗi tải báo cáo Top Selling (${res.status})`);
            }
            
            const data = await res.json();
            const mappedData: TopFoodResult[] = data.map((r: any) => ({
                Food_ID: r.Food_ID,
                Food_name: r.Food_name,
                Total_Sold: Number(r.Total_Sold ?? 0),
            }));

            setTopFoodsData(mappedData);
        } catch (err: any) {
            setTopFoodsError(err.message || "Không thể tạo báo cáo Món ăn Bán chạy Nhất.");
        } finally {
            setTopFoodsLoading(false);
        }
    };

    const selectedBranchName = selectedBranchId ? branches.find(b => b.id === selectedBranchId)?.address : 'Chưa chọn';

    if (branchLoading) {
        return <div className="text-center p-8 text-xl text-muted-foreground"><Loader2 className="mr-2 h-6 w-6 animate-spin inline" /> Đang tải dữ liệu chi nhánh...</div>;
    }

    if (branchError) {
        return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{branchError}</AlertDescription></Alert>;
    }


    return (
        <div className="space-y-6 p-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-7 w-7 text-primary" />
                Báo cáo Món ăn Bán chạy Nhất
            </h1>
            <p className="text-muted-foreground">Sử dụng thủ tục lưu trữ để lấy dữ liệu bán chạy.</p>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Tham số Báo cáo</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Select Chi nhánh */}
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="branch">Chọn Chi nhánh</Label>
                        <Select value={selectedBranchId ?? ""} onValueChange={setSelectedBranchId} disabled={branchLoading || branches.length === 0}>
                            <SelectTrigger id="branch">
                                <SelectValue placeholder="Chọn chi nhánh" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map(branch => (
                                    <SelectItem key={branch.id} value={branch.id}>
                                        {branch.address}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {branches.length === 0 && <p className="text-sm text-red-500">Không tìm thấy chi nhánh nào.</p>}
                    </div>

                    {/* Input Ngưỡng */}
                    <div className="flex gap-4 items-end mb-4">
                        <div className="space-y-2 flex-grow">
                            <Label htmlFor="minQuantity">Số lượng Bán Tối thiểu (Ngưỡng)</Label>
                            <Input
                                id="minQuantity"
                                type="number"
                                value={minQuantityReport}
                                onChange={(e) => setMinQuantityReport(e.target.value)}
                                min="1"
                                disabled={!selectedBranchId}
                            />
                        </div>
                        {/* Nút Gọi Thủ tục */}
                        <Button 
                            onClick={handleGenerateTopFoodsReport} 
                            disabled={topFoodsLoading || !selectedBranchId || branchLoading}
                            className="w-40"
                        >
                            {topFoodsLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang tải...
                                </>
                            ) : (
                                "Xem Báo cáo"
                            )}
                        </Button>
                    </div>
                    {topFoodsError && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{topFoodsError}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Hiển thị Kết quả Thủ tục GetTopSellingFoods() */}
            {topFoodsData && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Kết quả: Top Món ăn Bán chạy tại {selectedBranchName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topFoodsData.length > 0 ? (
                            <div className="rounded-md border overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Món ăn</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Số lượng Bán</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {topFoodsData.map((item, index) => (
                                            <tr key={item.Food_ID} className={index < 3 ? 'bg-yellow-50/50 font-semibold' : 'hover:bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Food_ID}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.Food_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{item.Total_Sold.toLocaleString('vi-VN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Không có kết quả</AlertTitle>
                              <AlertDescription>
                                  Không tìm thấy món ăn nào có số lượng bán vượt quá {minQuantityReport} tại chi nhánh đã chọn.
                              </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}