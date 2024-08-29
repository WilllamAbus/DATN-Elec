import { MultiValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { CardOption } from "../types";
export const handleCardChange = (
  selectedOptions: MultiValue<CardOption>,
  setSelectedCard: React.Dispatch<React.SetStateAction<MultiValue<CardOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2
) => {
  setSelectedCard(selectedOptions);
  const cardValues = selectedOptions.map((option) => option.label).join(', ');
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes.filter(attr => attr.k !== "Card").concat({
    k: "Card",
    v: cardValues
  });
  setValue("product_attributes", updatedAttributes);
};
