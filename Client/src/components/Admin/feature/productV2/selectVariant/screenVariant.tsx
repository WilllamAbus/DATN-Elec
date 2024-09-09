import React from "react";
import Select, { StylesConfig, SingleValue, ActionMeta } from "react-select";

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
  { value: "iphone_12", label: 'iPhone 12, 6.1" Super Retina XDR' },
  { value: "iphone_13", label: 'iPhone 13, 6.1" Super Retina XDR' },
  { value: "iphone_14", label: 'iPhone 14, 6.1" Super Retina XDR' },
  { value: "samsung_galaxy_s21", label: 'Samsung Galaxy S21, 6.2" Dynamic AMOLED 2X' },
  { value: "samsung_galaxy_s22", label: 'Samsung Galaxy S22, 6.1" Dynamic AMOLED 2X' },
  { value: "samsung_galaxy_s23", label: 'Samsung Galaxy S23, 6.1" Dynamic AMOLED 2X' },

];

const screenStyles: StylesConfig<(typeof screenOptions)[0], false> = {
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
};

interface ScreenSelectProps {
  onChange: (
    selectedOption: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => void;
  value: SingleValue<{ value: string; label: string }>;
  className?: string;
}

const ScreenSelect: React.FC<ScreenSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect={true}
    isMulti={false}
    options={screenOptions}
    styles={screenStyles}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default ScreenSelect;
