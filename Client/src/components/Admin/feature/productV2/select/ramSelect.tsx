import React from "react";
import Select, { StylesConfig, MultiValue } from "react-select";

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

const ramStyles: StylesConfig<(typeof ramOptions)[0], true> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? "#d3d3d3" // Background color when selected
      : isFocused
      ? "#f0f0f0" // Background color when focused
      : undefined,
    color: isDisabled ? "#ccc" : isSelected ? "black" : "black",
    cursor: isDisabled ? "not-allowed" : "default",
    ":active": {
      ...styles[":active"],
      backgroundColor: !isDisabled
        ? isSelected
          ? "#d3d3d3" // Background color when selected and active
          : "#e0e0e0" // Background color when active
        : undefined,
    },
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#f0f0f0",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "black",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "black",
    ":hover": {
      backgroundColor: "#d3d3d3",
      color: "black",
    },
  }),
};

interface RamSelectProps {
  onChange: (selectedOptions: MultiValue<{ value: string; label: string }>) => void;
  value: MultiValue<{ value: string; label: string }>;
  className?: string;
}

const RamSelect: React.FC<RamSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect={false}
    isMulti
    options={ramOptions}
    styles={ramStyles}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default RamSelect;
