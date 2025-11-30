# Phân tích ManagerMenu.tsx - Các vấn đề và đề xuất chỉnh sửa

## 📋 TỔNG QUAN
Component quản lý menu có 2 tab: "Lên thực đơn" và "Lịch sử thực đơn". Logic cơ bản tốt nhưng có một số vấn đề về xử lý ngày tháng và UX.

---

## 🔴 VẤN ĐỀ NGHIÊM TRỌNG

### 1. **Logic so sánh ngày tháng không an toàn (Dòng 599)**
```typescript
const isPastMenu = menu.Date_menu < getTodayString();
```
**Vấn đề:**
- `menu.Date_menu` từ API có thể là:
  - String "YYYY-MM-DD" (từ MySQL DATE)
  - String ISO "YYYY-MM-DDTHH:mm:ss.sssZ" (nếu backend format lại)
  - Date object (nếu backend parse)
- So sánh string trực tiếp có thể sai nếu format không nhất quán
- Nếu là ISO string có time, so sánh sẽ sai

**Giải pháp:** Tạo helper function normalize date:
```typescript
const normalizeDateString = (date: string | Date): string => {
  if (typeof date === 'string') {
    return date.split('T')[0]; // Lấy phần YYYY-MM-DD
  }
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const isPastMenu = normalizeDateString(menu.Date_menu) < getTodayString();
```

### 2. **formatDate() có thể lỗi timezone (Dòng 291-298)**
```typescript
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {...});
};
```
**Vấn đề:**
- `new Date(dateStr)` với string "YYYY-MM-DD" sẽ parse theo UTC
- Nếu user ở timezone khác UTC, có thể hiển thị sai ngày (ví dụ: 2025-01-01 → 31/12/2024)

**Giải pháp:** Parse thủ công hoặc dùng thư viện:
```typescript
const formatDate = (dateStr: string) => {
  // Nếu là format YYYY-MM-DD, parse thủ công
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {...});
};
```

---

## ⚠️ VẤN ĐỀ UX/UI

### 3. **Tab "Lịch sử" không có sắp xếp**
- Menu hiển thị theo thứ tự từ API (có thể không theo thứ tự ngày)
- Nên sắp xếp: mới nhất trước, hoặc cũ nhất trước

**Giải pháp:** Sắp xếp sau khi load:
```typescript
const sortedMenus = useMemo(() => {
  return [...savedMenus].sort((a, b) => {
    const dateA = normalizeDateString(a.Date_menu);
    const dateB = normalizeDateString(b.Date_menu);
    if (dateA !== dateB) return dateB.localeCompare(dateA); // Mới nhất trước
    // Nếu cùng ngày, sắp xếp theo ca: Sáng trước Chiều
    return a.Shift === 'Sáng' ? -1 : 1;
  });
}, [savedMenus]);
```

### 4. **Tab "Lịch sử" không có filter/search**
- Khi có nhiều menu, khó tìm
- Nên thêm: filter theo ngày, filter theo ca, search theo tên món

**Giải pháp:** Thêm filter controls:
```typescript
const [filterDate, setFilterDate] = useState<string>("");
const [filterShift, setFilterShift] = useState<ShiftType | "all">("all");
const [searchMenuQuery, setSearchMenuQuery] = useState("");

const filteredMenus = useMemo(() => {
  return sortedMenus.filter(menu => {
    const menuDate = normalizeDateString(menu.Date_menu);
    if (filterDate && menuDate !== filterDate) return false;
    if (filterShift !== "all" && menu.Shift !== filterShift) return false;
    if (searchMenuQuery) {
      const query = searchMenuQuery.toLowerCase();
      const hasMatch = menu.foods.some(f => 
        f.Food_name.toLowerCase().includes(query)
      );
      if (!hasMatch) return false;
    }
    return true;
  });
}, [sortedMenus, filterDate, filterShift, searchMenuQuery]);
```

### 5. **Hiển thị quá nhiều menu cùng lúc**
- Nếu có 100+ menu, scroll rất dài
- Nên thêm pagination hoặc "Load more"

**Giải pháp:** Thêm pagination hoặc virtual scroll

### 6. **Thiếu thông tin trong card menu**
- Không hiển thị tổng giá trị menu
- Không hiển thị số lượng món theo category

**Giải pháp:** Thêm thông tin:
```typescript
const totalPrice = menu.foods.reduce((sum, f) => sum + (f.Unit_price || 0), 0);
const categories = [...new Set(menu.foods.map(f => f.Category))];
```

---

## 🟡 VẤN ĐỀ NHỎ

### 7. **isPast được tính mỗi render**
```typescript
const isPast = selectedDate < getTodayString();
```
**Vấn đề:** `getTodayString()` được gọi mỗi render, không cần thiết

**Giải pháp:** Dùng useMemo hoặc useState với interval update:
```typescript
const [todayString, setTodayString] = useState(getTodayString());
useEffect(() => {
  const interval = setInterval(() => {
    setTodayString(getTodayString());
  }, 60000); // Update mỗi phút
  return () => clearInterval(interval);
}, []);
const isPast = selectedDate < todayString;
```

### 8. **Thiếu loading state khi edit menu**
- Khi click "Chỉnh sửa", không có feedback loading
- User không biết đang load menu cũ

**Giải pháp:** Hiển thị loading khi `isLoading` trong tab create

### 9. **Thông báo lỗi dùng alert()**
- Nên dùng toast notification thay vì alert()

### 10. **Key trong map dùng index (Dòng 593)**
```typescript
{savedMenus.map((menu, idx) => {
  return <Card key={idx} ...>
```
**Vấn đề:** Nếu menu thay đổi thứ tự, React có thể re-render sai

**Giải pháp:** Dùng composite key:
```typescript
key={`${menu.Branch_ID}-${menu.Date_menu}-${menu.Shift}`}
```

---

## ✅ ĐIỂM TỐT

1. ✅ Kiểm tra quyền chi nhánh rất kỹ
2. ✅ Logic dirty check tốt
3. ✅ UI/UX cơ bản rõ ràng
4. ✅ Xử lý empty state tốt
5. ✅ Disable button khi quá khứ hợp lý

---

## 📝 ĐỀ XUẤT ƯU TIÊN

### **Ưu tiên CAO (Cần sửa ngay):**
1. ✅ Fix logic so sánh ngày tháng (Vấn đề #1)
2. ✅ Fix formatDate timezone (Vấn đề #2)
3. ✅ Sắp xếp menu trong tab view (Vấn đề #3)
4. ✅ Fix key trong map (Vấn đề #10)

### **Ưu tiên TRUNG BÌNH:**
5. ⚠️ Thêm filter/search trong tab view (Vấn đề #4)
6. ⚠️ Thêm pagination (Vấn đề #5)
7. ⚠️ Tối ưu isPast calculation (Vấn đề #7)

### **Ưu tiên THẤP (Nice to have):**
8. 💡 Thêm thông tin tổng giá (Vấn đề #6)
9. 💡 Thay alert bằng toast (Vấn đề #9)
10. 💡 Loading state khi edit (Vấn đề #8)

---

## 🔧 CODE MẪU ĐỀ XUẤT

### Helper functions cần thêm:
```typescript
// Normalize date string về format YYYY-MM-DD
const normalizeDateString = (date: string | Date): string => {
  if (typeof date === 'string') {
    return date.split('T')[0];
  }
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Format date an toàn với timezone
const formatDate = (dateStr: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// So sánh ngày an toàn
const isDatePast = (dateStr: string | Date, todayStr?: string): boolean => {
  const normalized = normalizeDateString(dateStr);
  const today = todayStr || getTodayString();
  return normalized < today;
};
```


