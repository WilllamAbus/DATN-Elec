import { MultiValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { RamOption } from "../types";
export const handleRamChange = (
  selectedOptions: MultiValue<RamOption>,
  setSelectedRam: React.Dispatch<React.SetStateAction<MultiValue<RamOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2 
) => {
  setSelectedRam(selectedOptions);
  const ramValues = selectedOptions.map((option) => option.label).join(', ');
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes.filter(attr => attr.k !== "Ram").concat({
    k: "Ram", 
    v: ramValues
  });
  setValue("product_attributes", updatedAttributes);
};
