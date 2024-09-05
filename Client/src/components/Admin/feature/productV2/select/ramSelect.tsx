import React from "react";
import Select, { StylesConfig, SingleValue } from "react-select";

const ramOptions = [
  { value: "2gb", label: "2GB" },
  { value: "4gb", label: "4GB" },
  { value: "6gb", label: "6GB" },
  { value: "8gb", label: "8GB" },
  { value: "12gb", label: "12GB" },
  { value: "16gb", label: "16GB" },
  { value: "24gb", label: "24GB" },
  { value: "32gb", label: "32GB" },
  { value: "64gb", label: "64GB" },
  { value: "128gb", label: "128GB" },
];

const ramStyles: StylesConfig<typeof ramOptions[0], false> = {
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
};

interface RamSelectProps {
  onChange: (selectedOption: SingleValue<{ value: string; label: string }>) => void;
  value: SingleValue<{ value: string; label: string }>;
  className?: string;
}

const RamSelect: React.FC<RamSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect
    isMulti={false} 
    options={ramOptions}
    styles={ramStyles}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default RamSelect;
