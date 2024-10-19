import { MultiValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant, COLOR } from "../../../../../services/product_v2/admin/types/addVariant";

export const handleColorChange = (
  selectedOptions: MultiValue<COLOR>,
  setSelectedColors: React.Dispatch<React.SetStateAction<MultiValue<COLOR>>>, 
  setValue: UseFormSetValue<ProductVariant>
) => {
  setSelectedColors(selectedOptions);
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

  setValue("color", colorData); 
};
