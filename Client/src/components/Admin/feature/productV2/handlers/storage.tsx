import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant, STORAGE } from "../../../../../services/product_v2/admin/types/addVariant"; 

export const handleStorageChange = (
  selectedOption: SingleValue<STORAGE>,  
  setSelectedStorage: React.Dispatch<React.SetStateAction<SingleValue<STORAGE>>>,
  setValue: UseFormSetValue<ProductVariant>  
) => {
  setSelectedStorage(selectedOption);

  const storageData: STORAGE = selectedOption ? {
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
  setValue("storage", [storageData]); 
};
