import { MultiValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant, COLOR } from "../../../../../services/product_v2/admin/types/addVariant";
// Giả sử Color đã được định nghĩa

export const handleColorChange = (
  selectedOptions: MultiValue<COLOR> | null,  // Chấp nhận cả MultiValue<COLOR> hoặc null
  setSelectedColors: React.Dispatch<React.SetStateAction<MultiValue<COLOR>>>, 
  setValue: UseFormSetValue<ProductVariant>
) => {
  if (selectedOptions === null) return;  // Kiểm tra null trước khi tiếp tục xử lý

  setSelectedColors(selectedOptions);  // Cập nhật state với giá trị hợp lệ

  // Chuyển đổi MultiValue<Color> thành COLOR[]
  const colorData: COLOR[] = selectedOptions.map(option => ({
    _id: option._id,
    name: option.name,
    code: option.code,
    hex: option.hex,
    status: option.status,
    sku: option.sku,
    pid: option.pid,
    createdAt: option.createdAt,
    updatedAt: option.updatedAt,
    slug: option.slug,
  }));

  setValue("color", colorData);  // Cập nhật giá trị form
};
