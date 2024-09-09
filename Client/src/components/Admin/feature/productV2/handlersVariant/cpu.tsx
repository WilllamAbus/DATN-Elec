import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant } from "../../../../../services/product_v2/admin/types";
import { CPUOption } from "../types/variant_product";

export const handleCPUChange = (
  selectedOption: SingleValue<CPUOption>,
  setSelectedCPU: React.Dispatch<React.SetStateAction<SingleValue<CPUOption>>>,
  setValue: UseFormSetValue<ProductVariant>,
  getValues: () => ProductVariant
) => {
  setSelectedCPU(selectedOption);
  const cpuValue = selectedOption ? selectedOption.label : '';
  const currentVariantAttributes = getValues().variant_attributes || [];
  const updateVariantAttributes = currentVariantAttributes.filter(attr => attr.k !== "CPU").concat({
    k: "CPU",
    v: cpuValue
  });
  setValue("variant_attributes", updateVariantAttributes);
};
