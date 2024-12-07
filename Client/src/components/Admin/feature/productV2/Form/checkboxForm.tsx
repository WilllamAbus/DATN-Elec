import { useEffect, useState } from "react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { UseFormRegister } from "react-hook-form";

interface ProductVariantSelectorProps {
  label: string;
  id: string;
  onVariantChange: (hasVariants: boolean) => void;
  register: UseFormRegister<any>;
  validation?: object;
  errorMessage?: string;
}

export default function ProductVariantSelector({
  label,
  id,
  onVariantChange,
  register,
  validation,
  errorMessage,
}: ProductVariantSelectorProps) {
  const [selected, setSelected] = useState<string | null>(""); // Đặt giá trị mặc định là rỗng

  useEffect(() => {
    // Chuyển đổi giá trị chuỗi thành Boolean khi người dùng chọn
    if (selected === "true") {
      onVariantChange(true); // Chọn "Sản phẩm có biến thể"
    } else if (selected === "false") {
      onVariantChange(false); // Chọn "Sản phẩm không có biến thể"
    }
  }, [selected, onVariantChange]);

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="space-y-4">
        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor={`${id}-true`} // Link đúng với ID của một radio button
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
          </label>
          <RadioGroup
            value={selected} // Giá trị mặc định là rỗng
            onValueChange={(value) => setSelected(value)}
            color="warning"
            {...register(id, {
              ...validation,
              required: selected === "" ? "Vui lòng chọn loại sản phẩm" : undefined,
            })}
          >
            <Radio id={`${id}-true`} value="true">
              Sản phẩm có biến thể
            </Radio>
            <Radio id={`${id}-false`} value="false">
              Sản phẩm không có biến thể
            </Radio>
          </RadioGroup>
          {errorMessage && (
            <div className="flex items-center mt-2 text-red-600">
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
