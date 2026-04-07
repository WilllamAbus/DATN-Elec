import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant, RAM } from "../../../../../services/product_v2/admin/types/addVariant"; 
export const handleRamChange = (
  selectedOption: SingleValue<RAM>, 
  setSelectedRam: React.Dispatch<React.SetStateAction<SingleValue<RAM>>>,
  setValue: UseFormSetValue<ProductVariant>
) => {
  setSelectedRam(selectedOption);
  
  const ramData: RAM = selectedOption ? {
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
  setValue("ram", [ramData]); 
};

