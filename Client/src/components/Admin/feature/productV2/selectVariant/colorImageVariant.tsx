import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { StylesConfig, SingleValue } from "react-select";
import { AppDispatch, RootState } from "../../../../../redux/store"; 
import { getVariantColorsByIdThunk } from "../../../../../redux/product/admin/Thunk/getVariantColorsById"; 
import { Color } from "../../../../../services/product_v2/admin/types/getVariantColorsById"; 
import { useParams } from "react-router-dom"; 

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
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: data.code,
    color: 'white', 
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: 'white',
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: 'white',
    ':hover': {
      backgroundColor: 'red', 
      color: 'white',
    },
  }),
  singleValue: (styles, { data }) => ({
    ...styles,
    color: data.code, 
  }),
};

interface ColorSelectProps {
  onChange: (selectedOption: SingleValue<Color> | null) => void;
  value: SingleValue<Color> | null; 
  className?: string;
  variantId: string | undefined;
}


const ColorImageVariantSelect: React.FC<ColorSelectProps> = ({ onChange, value, className }) => {
  const { product_variant_id } = useParams<{ product_variant_id: string }>(); 
  const dispatch = useDispatch<AppDispatch>(); 
  const { colorList, isLoading } = useSelector((state: RootState) => state.products.getVariantColorsById); 

  useEffect(() => {
    if (product_variant_id) {
      dispatch(getVariantColorsByIdThunk({ id: product_variant_id })); 
    }
  }, [dispatch, product_variant_id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const colorOptions = colorList?.map((color: Color) => ({
    ...color,
    _id: color._id,
    name: color.name,
    code: color.code,  
  })) || []; 

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

export default ColorImageVariantSelect;
