import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { StylesConfig, SingleValue } from "react-select";
import { AppDispatch, RootState } from "../../../../../redux/store"; 
import { getAllRamThunk } from "../../../../../redux/product/attributes/Thunk"; 
import { Ram } from "../../../../../services/product_v2/types/attributes/getAllRam"; 

const ramStyles: StylesConfig<{ value: string; label: string }, false> = {
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

interface RamSelectProps {
  onChange: (selectedOption: SingleValue<{ value: string; label: string }>) => void;
  value: SingleValue<{ value: string; label: string }> | null;
  className?: string;
}
const RamSelect: React.FC<RamSelectProps> = ({ onChange, value, className }) => {
  const dispatch = useDispatch<AppDispatch>(); 
  const { rams, isLoading } = useSelector(
    (state: RootState) => state.getAttributes.getAllRam 
  );

  useEffect(() => {
    dispatch(getAllRamThunk());
  }, [dispatch]);


  if (isLoading) {
    return <p>Loading...</p>;
  }

  const ramOptions = rams.map((ram: Ram) => ({
    value: ram._id,
    label: ram.name,
  }));
  

  return (
    <Select
      classNamePrefix="react-select"
      closeMenuOnSelect
      isMulti={false}
      options={ramOptions} 
      styles={ramStyles}
      value={value}
      onChange={onChange}
      className={className}
      isClearable={true}
    />
  );
};

export default RamSelect;
