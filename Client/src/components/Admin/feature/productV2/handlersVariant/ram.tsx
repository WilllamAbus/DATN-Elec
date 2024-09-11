import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant } from "../../../../../services/product_v2/admin/types";
import { RamOption } from "../types/variant_product";

export const handleRamChange = (
  selectedOption: SingleValue<RamOption>,
  setSelectedRam: React.Dispatch<React.SetStateAction<SingleValue<RamOption>>>,
  setValue: UseFormSetValue<ProductVariant>,
  getValues: () => ProductVariant 
) => {
  setSelectedRam(selectedOption);
  const ramValue = selectedOption ? selectedOption.label : "";
  const currentVariantAttributes = getValues().variant_attributes || [];
  const updateVariantAttributes = currentVariantAttributes.filter(attr => attr.k !== "Ram").concat({
    k: "Ram", 
    v: ramValue
  });
  setValue("variant_attributes", updateVariantAttributes);
};
