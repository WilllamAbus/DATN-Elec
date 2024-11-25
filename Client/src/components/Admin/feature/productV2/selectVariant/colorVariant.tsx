import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { StylesConfig, MultiValue } from "react-select";
import { AppDispatch, RootState } from "../../../../../redux/store"; 
import { getAllColorThunk } from "../../../../../redux/product/attributes/Thunk"; 
import { Color } from "../../../../../services/product_v2/types/attributes/getAllColor"; 

const colorStyles: StylesConfig<Color, true> = {
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
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: data.code,
    color: 'white', // hoặc tùy chỉnh theo nhu cầu
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: 'white',
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: 'white',
    ':hover': {
      backgroundColor: 'red', // Hoặc màu tùy ý
      color: 'white',
    },
  }),
  singleValue: (styles, { data }) => ({
    ...styles,
    color: data.code, 
  }),
};

interface ColorSelectProps {
  onChange: (selectedOptions: MultiValue<Color>) => void;
  value: MultiValue<Color> | null;
  className?: string;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ onChange, value, className }) => {
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
      closeMenuOnSelect={false} // Thay đổi thành false để cho phép chọn nhiều
      isMulti={true} // Bật chế độ chọn nhiều
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
