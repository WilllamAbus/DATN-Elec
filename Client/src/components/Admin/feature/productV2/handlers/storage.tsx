import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { StorageOption } from "../types/main_product"; // Đảm bảo bạn đã khai báo StorageOption tương tự như RamOption

export const handleStorageChange = (
  selectedOption: SingleValue<StorageOption>,
  setSelectedStorage: React.Dispatch<React.SetStateAction<SingleValue<StorageOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2
) => {
  setSelectedStorage(selectedOption);
  const storageValue = selectedOption ? selectedOption.label : "";
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes
    .filter((attr) => attr.k !== "Ổ cứng")
    .concat({
      k: "Ổ cứng",
      v: storageValue,
    });
  setValue("product_attributes", updatedAttributes);
};
