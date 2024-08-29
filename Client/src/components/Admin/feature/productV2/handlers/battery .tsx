import { MultiValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { BatteryOption } from "../types";
export const handleBatteryChange = (
  selectedOptions: MultiValue<BatteryOption>,
  setSelectedBattery: React.Dispatch<React.SetStateAction<MultiValue<BatteryOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2
) => {
  setSelectedBattery(selectedOptions);
  const batteryValues = selectedOptions.map((option) => option.label).join(', ');
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes
    .filter(attr => attr.k !== "Battery") 
    .concat({
      k: "Pin",
      v: batteryValues
    });
  
  setValue("product_attributes", updatedAttributes);
};
