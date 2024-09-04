import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { BatteryOption } from "../types";

export const handleBatteryChange = (
  selectedOption: SingleValue<BatteryOption>,
  setSelectedBattery: React.Dispatch<React.SetStateAction<SingleValue<BatteryOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2
) => {
  setSelectedBattery(selectedOption);
  const batteryValue = selectedOption ? selectedOption.label : "";
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes
    .filter((attr) => attr.k !== "Battery")
    .concat({
      k: "Pin",
      v: batteryValue,
    });

  setValue("product_attributes", updatedAttributes);
};
