import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { CPUOption } from "../types";

export const handleCPUChange = (
  selectedOption: SingleValue<CPUOption>,
  setSelectedCPU: React.Dispatch<React.SetStateAction<SingleValue<CPUOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2
) => {
  setSelectedCPU(selectedOption);
  const cpuValue = selectedOption ? selectedOption.label : '';
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes.filter(attr => attr.k !== "CPU").concat({
    k: "CPU",
    v: cpuValue
  });
  setValue("product_attributes", updatedAttributes);
};
