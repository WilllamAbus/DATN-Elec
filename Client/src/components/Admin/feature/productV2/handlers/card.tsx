import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { CardOption } from "../types";

export const handleCardChange = (
  selectedOption: SingleValue<CardOption>,
  setSelectedCard: React.Dispatch<React.SetStateAction<SingleValue<CardOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2
) => {
  setSelectedCard(selectedOption);
  const cardValue = selectedOption ? selectedOption.label : '';
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes.filter(attr => attr.k !== "Card").concat({
    k: "Card",
    v: cardValue
  });
  
  setValue("product_attributes", updatedAttributes);
};
