import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { StylesConfig, SingleValue } from "react-select";
import { AppDispatch, RootState } from "../../../../../redux/store"; 
import { getAllColorThunk } from "../../../../../redux/product/attributes/Thunk"; 
import { Color } from "../../../../../services/product_v2/types/attributes/getAllColor"; 

const colorStyles: StylesConfig<Color, false> = {
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
      backgroundColor: !isDisabled ? (isSelected ? "#d3d3d3" : "#e0e0e0") : undefined,
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
interface ColorProps {
  onChange: (selectedOption: SingleValue<Color>) => void;
  value: SingleValue<Color> | null;
  className?: string;
}
const colorImageVariantSingle: React.FC<ColorProps> = ({ onChange, value, className }) => {
  const dispatch = useDispatch<AppDispatch>(); 
  const { colors, isLoading } = useSelector((state: RootState) => state.getAttributes.getAllColor); 

  useEffect(() => {
    dispatch(getAllColorThunk()); 
  }, [dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const colorOptions = colors.map((color: Color) => ({
    ...color,
    _id: color._id,
    name: color.name,
    code: color.code,  
  }));

  return (
    <Select
      classNamePrefix="react-select"
      closeMenuOnSelect
      isMulti={false}
      options={colorOptions}  
      styles={colorStyles}
      value={value}
      onChange={onChange}
      className={className}
      isClearable={true}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option._id}
    />
  );
};

export default colorImageVariantSingle;
