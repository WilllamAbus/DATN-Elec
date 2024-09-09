import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant } from "../../../../../services/product_v2/admin/types";
import { BatteryOption } from "../types/variant_product";

export const handleBatteryChange = (
  selectedOption: SingleValue<BatteryOption>,
  setSelectedBattery: React.Dispatch<React.SetStateAction<SingleValue<BatteryOption>>>,
  setValue: UseFormSetValue<ProductVariant>,
  getValues: () => ProductVariant
) => {
  setSelectedBattery(selectedOption);
  const batteryValue = selectedOption ? selectedOption.label : "";
  const currentVariantAttributes = getValues().variant_attributes || [];
  const updateVariantAttributes = currentVariantAttributes
    .filter((attr) => attr.k !== "Battery")
    .concat({
      k: "Pin",
      v: batteryValue,
    });

  setValue("variant_attributes", updateVariantAttributes);
};
