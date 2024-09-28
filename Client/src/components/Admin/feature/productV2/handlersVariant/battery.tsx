import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant, BATTERY } from "../../../../../services/product_v2/admin/types/addVariant"; 
export const handleBatteryChange = (
  selectedOption: SingleValue<BATTERY>, 
  setSelectedBattery: React.Dispatch<React.SetStateAction<SingleValue<BATTERY>>>, 
  setValue: UseFormSetValue<ProductVariant>
) => {
  setSelectedBattery(selectedOption);

  const batteryData: BATTERY = selectedOption ? {
    _id: selectedOption._id,
    name: selectedOption.name,
    status: selectedOption.status,
    sku: selectedOption.sku,
    pid: selectedOption.pid,
    createdAt: selectedOption.createdAt,
    updatedAt: selectedOption.updatedAt,
    slug: selectedOption.slug,
  } : {
    _id: '',
    name: '',
    status: '',
    sku: '',
    pid: '',
    createdAt: '',
    updatedAt: '',
    slug: '',
  };
  setValue("battery", [batteryData]);
};
