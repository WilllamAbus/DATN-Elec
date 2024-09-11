import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { OsOption } from "../types/main_product";

export const handleOsChange = (
  selectedOption: SingleValue<OsOption>,
  setSelectedOs: React.Dispatch<React.SetStateAction<SingleValue<OsOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2
) => {
  setSelectedOs(selectedOption);
  const osValue = selectedOption ? selectedOption.label : "";
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes
    .filter((attr) => attr.k !== "Hệ điều hành")
    .concat({
      k: "Hệ điều hành",
      v: osValue,
    });
  setValue("product_attributes", updatedAttributes);
};
