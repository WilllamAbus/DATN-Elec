import React from "react";
import Select, { StylesConfig, SingleValue, ActionMeta } from "react-select";

const cpuOptions = [
  { value: "i5_12450h_2ghz", label: "Intel Core i5-12450H, 2GHz" },
  { value: "i7_13700k_3ghz", label: "Intel Core i7-13700K, 3GHz" },
  { value: "ryzen_5_5600x_3_7ghz", label: "AMD Ryzen 5 5600X, 3.7GHz" },
  { value: "ryzen_7_5800x_3_8ghz", label: "AMD Ryzen 7 5800X, 3.8GHz" },
  { value: "i5_12600k_3_7ghz", label: "Intel Core i5-12600K, 3.7GHz" },
  { value: "i9_12900k_3_2ghz", label: "Intel Core i9-12900K, 3.2GHz" },
  { value: "ryzen_9_5900x_3_7ghz", label: "AMD Ryzen 9 5900X, 3.7GHz" },
  { value: "i7_12700f_2_1ghz", label: "Intel Core i7-12700F, 2.1GHz" },
  { value: "ryzen_7_5700x_3_4ghz", label: "AMD Ryzen 7 5700X, 3.4GHz" },
  { value: "i5_1135g7_2_4ghz", label: "Intel Core i5-1135G7, 2.4GHz" },
  { value: "a15_bionic_6core", label: "Apple A15 Bionic, 6-core CPU" },
  { value: "a16_bionic_6core", label: "Apple A16 Bionic, 6-core CPU" },
  { value: "a17_pro_6core", label: "Apple A17 Pro, 6-core CPU" },
  { value: "m1_8core", label: "Apple M1, 8-core CPU" },
  { value: "m1_pro_10core", label: "Apple M1 Pro, 10-core CPU" },
  { value: "m1_max_10core", label: "Apple M1 Max, 10-core CPU" },
  { value: "m2_8core", label: "Apple M2, 8-core CPU" },
  { value: "m2_pro_12core", label: "Apple M2 Pro, 12-core CPU" },
  { value: "m2_max_12core", label: "Apple M2 Max, 12-core CPU" }
];


const cpuStyles: StylesConfig<(typeof cpuOptions)[0], false> = {
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

interface CpuSelectProps {
  onChange: (
    selectedOption: SingleValue<(typeof cpuOptions)[0]>,
    actionMeta: ActionMeta<(typeof cpuOptions)[0]>
  ) => void;
  value: SingleValue<(typeof cpuOptions)[0]>;
  className?: string;
}

const CpuSelect: React.FC<CpuSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect={true}
    isMulti={false}
    options={cpuOptions}
    styles={cpuStyles}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default CpuSelect;
