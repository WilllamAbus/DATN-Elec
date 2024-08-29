import React from "react";
import Select, { StylesConfig, MultiValue } from "react-select";


const screenOptions = [
  { value: "13in_1080p_60hz", label: '13.0" Full HD (1080p), 60Hz' },
  { value: "14in_1080p_60hz", label: '14.0" Full HD (1080p), 60Hz' },
  { value: "15in_1080p_60hz", label: '15.6" Full HD (1080p), 60Hz' },
  { value: "15in_1080p_120hz", label: '15.6" Full HD (1080p), 120Hz' },
  { value: "17in_1080p_60hz", label: '17.3" Full HD (1080p), 60Hz' },
  { value: "15in_4k_60hz", label: '15.6" 4K Ultra HD (2160p), 60Hz' },
  { value: "15in_4k_120hz", label: '15.6" 4K Ultra HD (2160p), 120Hz' },
  { value: "15in_oled", label: '15.6" OLED, 60Hz' },
  { value: "14in_ips", label: '14.0" Full HD (1080p), IPS, 60Hz' },
  { value: "15in_va", label: '15.6" Full HD (1080p), VA, 60Hz' },
  { value: "15in_curved", label: '15.6" Full HD (1080p), Curved, 60Hz' },
];

const screenStyles: StylesConfig<(typeof screenOptions)[0], true> = {
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

interface ScreenSelectProps {
  onChange: (selectedOptions: MultiValue<{ value: string; label: string }>) => void;
  value: MultiValue<{ value: string; label: string }>;
  className?: string;
}

const ScreenSelect: React.FC<ScreenSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect={false}
    isMulti
    options={screenOptions}
    styles={screenStyles}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default ScreenSelect;
