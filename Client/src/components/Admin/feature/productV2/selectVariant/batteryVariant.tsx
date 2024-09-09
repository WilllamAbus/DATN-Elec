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

  { value: "49_9_wh", label: "MacBook Air 49.9 Wh" },
  { value: "49_9_wh_m1", label: "MacBook Air M1 49.9 Wh" },
  { value: "52_6_wh_m2", label: "MacBook Air M2 52.6 Wh" },
  { value: "58_2_wh_13", label: "MacBook Pro 13-inch 58.2 Wh" },
  { value: "70_wh_14", label: "MacBook Pro 14-inch 70 Wh" },
  { value: "100_wh_16", label: "MacBook Pro 16-inch 100 Wh" },
  { value: "9_3_wh", label: "iPhone 13 Mini 9.3 Wh" },
  { value: "11_9_wh", label: "iPhone 13 11.9 Wh" },
  { value: "11_9_wh_pro", label: "iPhone 13 Pro 11.9 Wh" },
  { value: "16_8_wh", label: "iPhone 13 Pro Max 16.8 Wh" },
  { value: "12_4_wh", label: "iPhone 14 12.4 Wh" },
  { value: "16_5_wh", label: "iPhone 14 Plus 16.5 Wh" },
  { value: "12_2_wh", label: "iPhone 14 Pro 12.2 Wh" },
  { value: "16_5_wh_pro_max", label: "iPhone 14 Pro Max 16.5 Wh" },
  { value: "15_2_wh", label: "Galaxy S21 15.2 Wh" },
  { value: "18_4_wh", label: "Galaxy S21+ 18.4 Wh" },
  { value: "19_2_wh", label: "Galaxy S21 Ultra 19.2 Wh" },
  { value: "16_4_wh", label: "Galaxy Note 20 16.4 Wh" },
  { value: "17_1_wh", label: "Galaxy Note 20 Ultra 17.1 Wh" },
  { value: "17_1_wh_a52", label: "Galaxy A52 17.1 Wh" },
  { value: "19_2_wh_a72", label: "Galaxy A72 19.2 Wh" }
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
