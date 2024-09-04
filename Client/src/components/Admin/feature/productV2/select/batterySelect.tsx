import React from "react";
import Select, { StylesConfig, SingleValue } from "react-select";

const batteryOptions = [
  { value: "47_wh", label: "47 Wh" },
  { value: "60_wh", label: "60 Wh" },
  { value: "56_6_wh", label: "56.6 Wh" },
  { value: "42_wh", label: "42 Wh" },
  { value: "45_wh", label: "45 Wh" },
  { value: "50_wh", label: "50 Wh" },
  { value: "65_wh", label: "65 Wh" },
  { value: "70_wh", label: "70 Wh" },
  { value: "75_wh", label: "75 Wh" },
  { value: "80_wh", label: "80 Wh" },
  { value: "85_wh", label: "85 Wh" },
  { value: "90_wh", label: "90 Wh" },
  { value: "100_wh", label: "100 Wh" },
];

const batteryStyles: StylesConfig<{ value: string; label: string }, false> = {
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
};

interface BatterySelectProps {
  onChange: (selectedOption: SingleValue<{ value: string; label: string }>) => void;
  value: SingleValue<{ value: string; label: string }>;
  className?: string;
}

const BatterySelect: React.FC<BatterySelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect={true} 
    isMulti={false}
    options={batteryOptions}
    styles={batteryStyles}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default BatterySelect;
