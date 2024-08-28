import { MultiValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { CPUOption } from "../types";

export const handleCPUChange = (
  selectedOptions: MultiValue<CPUOption>,
  setSelectedCPU: React.Dispatch<React.SetStateAction<MultiValue<CPUOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2
) => {
  setSelectedCPU(selectedOptions);
  const cpuValues = selectedOptions.map((option) => option.label).join(', ');
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes.filter(attr => attr.k !== "CPU").concat({
    k: "CPU",
    v: cpuValues
  });
  setValue("product_attributes", updatedAttributes);
};
