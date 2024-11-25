import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { StylesConfig, SingleValue } from "react-select";
import { AppDispatch, RootState } from "../../../../../redux/store"; 
import { getAllGraphicsCardThunk } from "../../../../../redux/product/attributes/Thunk"; 
import { GraphicsCard } from "../../../../../services/product_v2/types/attributes/getAllGraphicsCard"; 

const cardStyles: StylesConfig<GraphicsCard, false> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? "#d3d3d3" 
      : isFocused
      ? "#f0f0f0" 
      : undefined,
    color: isDisabled ? "#ccc" : isSelected ? "black" : "black",
    cursor: isDisabled ? "not-allowed" : "default",
    ":active": {
      ...styles[":active"],
      backgroundColor: !isDisabled
        ? isSelected
          ? "#d3d3d3" 
          : "#e0e0e0" 
        : undefined,
    },
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "black",
  }),
  clearIndicator: (styles) => ({
    ...styles,
    color: "black",
    cursor: "pointer",
  }),
};

interface CardSelectProps {
  onChange: (selectedOption: SingleValue<GraphicsCard>) => void;
  value: SingleValue<GraphicsCard> | null;
  className?: string;
}

const CardSelect: React.FC<CardSelectProps> = ({ onChange, value, className }) => {
  const dispatch = useDispatch<AppDispatch>(); 
  const { graphicsCards, isLoading } = useSelector(
    (state: RootState) => state.getAttributes.getAllGraphicsCard
  );

  useEffect(() => {
    dispatch(getAllGraphicsCardThunk());
  }, [dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const cardOptions = graphicsCards.map((card: GraphicsCard) => ({
    ...card,
    _id: card._id,
    name: card.name,
  }));

  return (
    <Select
      classNamePrefix="react-select"
      closeMenuOnSelect
      isMulti={false}
      options={cardOptions}
      styles={cardStyles}
      value={value}
      onChange={onChange}
      className={className}
      isClearable={true}
      getOptionLabel={(option) => option.name} 
      getOptionValue={(option) => option._id}  
    />
  );
};

export default CardSelect;
