import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant } from "../../../../../services/product_v2/admin/types";
import { ColorOption } from "../types/variant_product";

export const handleColorChange = (
  selectedOption: SingleValue<ColorOption>,
  setSelectedColors: React.Dispatch<React.SetStateAction<SingleValue<ColorOption>>>,
  setValue: UseFormSetValue<ProductVariant>,
  getValues: () => ProductVariant 
) => {
  setSelectedColors(selectedOption);
  const colorValue = selectedOption ? selectedOption.label : '';
  const currentVariantAttributes = getValues().variant_attributes || [];
  const updateVariantAttributes = currentVariantAttributes.filter(attr => attr.k !== "Color").concat({
    k: "Color", 
    v: colorValue
  });
  setValue("variant_attributes", updateVariantAttributes);
};
