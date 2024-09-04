import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { RamOption } from "../types";

export const handleRamChange = (
  selectedOption: SingleValue<RamOption>,
  setSelectedRam: React.Dispatch<React.SetStateAction<SingleValue<RamOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2 
) => {
  setSelectedRam(selectedOption);
  const ramValue = selectedOption ? selectedOption.label : "";
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes.filter(attr => attr.k !== "Ram").concat({
    k: "Ram", 
    v: ramValue
  });
  setValue("product_attributes", updatedAttributes);
};
