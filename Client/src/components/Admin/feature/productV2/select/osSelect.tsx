import React from "react";
import Select, { StylesConfig, SingleValue } from "react-select";

const osOptions = [
  { value: "windows", label: "Windows" },
  { value: "macos", label: "macOS" },
  { value: "linux", label: "Linux" },
  { value: "ubuntu", label: "Ubuntu" },
  { value: "debian", label: "Debian" },
  { value: "fedora", label: "Fedora" },
  { value: "arch", label: "Arch Linux" },
];

const osStyles: StylesConfig<(typeof osOptions)[0], false> = {
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

interface OsSelectProps {
  onChange: (selectedOption: SingleValue<{ value: string; label: string }>) => void;
  value: SingleValue<{ value: string; label: string }>;
  className?: string;
}

const OsSelect: React.FC<OsSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect
    isMulti={false}
    options={osOptions}
    styles={osStyles}
    value={value}
    onChange={onChange}
    className={className}
    isClearable={true}
  />
);

export default OsSelect;
