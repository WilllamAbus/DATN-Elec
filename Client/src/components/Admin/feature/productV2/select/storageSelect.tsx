import React from "react";
import Select, { StylesConfig, SingleValue } from "react-select";

const storageOptions = [
  { value: "256gb", label: "256GB" },
  { value: "512gb", label: "512GB" },
  { value: "1tb", label: "1TB" },
  { value: "2tb", label: "2TB" },
  { value: "4tb", label: "4TB" },
  { value: "8tb", label: "8TB" },
];

const storageStyles: StylesConfig<(typeof storageOptions)[0], false> = {
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

interface StorageSelectProps {
  onChange: (selectedOption: SingleValue<{ value: string; label: string }>) => void;
  value: SingleValue<{ value: string; label: string }>;
  className?: string;
}

const StorageSelect: React.FC<StorageSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect
    isMulti={false}
    options={storageOptions}
    styles={storageStyles}
    value={value}
    onChange={onChange}
    className={className}
    isClearable={true}
  />
);

export default StorageSelect;
