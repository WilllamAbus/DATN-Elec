import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant, COLOR } from "../../../../../services/product_v2/admin/types/addVariant";
export const handleColorChange = (
  selectedOption: SingleValue<COLOR>,
  setSelectedColors: React.Dispatch<React.SetStateAction<SingleValue<COLOR>>>, 
  setValue: UseFormSetValue<ProductVariant>
) => {
  setSelectedColors(selectedOption);
  const colorData: COLOR = selectedOption ? {
    _id: selectedOption._id,
    name: selectedOption.name,
    code: selectedOption.code,
    hex: selectedOption.hex,
    status: selectedOption.status,
    sku: selectedOption.sku,
    pid: selectedOption.pid,
    createdAt: selectedOption.createdAt,
    updatedAt: selectedOption.updatedAt,
    slug: selectedOption.slug,
  } : {
    _id: '',
    name: '',
    code: '',
    hex: '', 
    status: '',
    sku: '',
    pid: '',
    createdAt: '',
    updatedAt: '',
    slug: '',
  };
  setValue("color", [colorData]);
};
