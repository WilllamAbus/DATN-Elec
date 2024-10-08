import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { StylesConfig, SingleValue } from "react-select";
import { AppDispatch, RootState } from "../../../../../redux/store"; 
import { getAllColorThunk } from "../../../../../redux/product/attributes/Thunk"; 
import { Color } from "../../../../../services/product_v2/types/attributes/getAllColor"; 

const colorStyles: StylesConfig<Color, false> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const backgroundColor = isDisabled
      ? undefined
      : isSelected
      ? data.code 
      : isFocused
      ? `${data.code}1A`  
      : undefined;

    return {
      ...styles,
      backgroundColor,
      color: isDisabled ? "#ccc" : data.code, 
      cursor: isDisabled ? "not-allowed" : "default",
      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.code 
            : `${data.code}1A`
          : undefined,
      },
    };
  },
  singleValue: (styles, { data }) => ({
    ...styles,
    color: data.code, 
  }),
};

interface ColorSelectProps {
  onChange: (selectedOption: SingleValue<Color>) => void;
  value: SingleValue<Color> | null;
  className?: string;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ onChange, value, className }) => {
  const dispatch = useDispatch<AppDispatch>(); 
  const { colors, isLoading } = useSelector((state: RootState) => state.attributes.getAllColor);

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
      closeMenuOnSelect={true}
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

export default ColorSelect;
