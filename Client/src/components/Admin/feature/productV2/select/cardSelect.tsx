import React from "react";
import Select, { StylesConfig, MultiValue } from "react-select";
const cardOptions = [
  { value: "rtx_3050", label: "NVIDIA RTX 3050 6GB" },
  { value: "rtx_3060", label: "NVIDIA RTX 3060 12GB" },
  { value: "rtx_3070", label: "NVIDIA RTX 3070 8GB" },
  { value: "rtx_3080", label: "NVIDIA RTX 3080 10GB" },
  { value: "rtx_3090", label: "NVIDIA RTX 3090 24GB" },
  { value: "gtx_1650", label: "NVIDIA GTX 1650 4GB" },
  { value: "gtx_1660", label: "NVIDIA GTX 1660 6GB" },
  { value: "gtx_1660ti", label: "NVIDIA GTX 1660 Ti 6GB" },
  { value: "gtx_1660super", label: "NVIDIA GTX 1660 Super 6GB" },
  { value: "gtx_1070", label: "NVIDIA GTX 1070 8GB" },
  { value: "gtx_1080", label: "NVIDIA GTX 1080 8GB" },
  { value: "gtx_1080ti", label: "NVIDIA GTX 1080 Ti 11GB" },
  { value: "rx_5500", label: "AMD RX 5500 XT 8GB" },
  { value: "rx_5600", label: "AMD RX 5600 XT 6GB" },
  { value: "rx_5700", label: "AMD RX 5700 8GB" },
  { value: "rx_5700xt", label: "AMD RX 5700 XT 8GB" },
  { value: "rx_6600", label: "AMD RX 6600 8GB" },
  { value: "rx_6600xt", label: "AMD RX 6600 XT 8GB" },
  { value: "rx_6700", label: "AMD RX 6700 XT 12GB" },
  { value: "rx_6800", label: "AMD RX 6800 16GB" },
  { value: "rx_6800xt", label: "AMD RX 6800 XT 16GB" },
  { value: "rx_6900xt", label: "AMD RX 6900 XT 16GB" },
  { value: "pro_5700", label: "AMD Radeon Pro 5700 8GB" },
  { value: "pro_5700xt", label: "AMD Radeon Pro 5700 XT 8GB" },
  { value: "quadro_p1000", label: "NVIDIA Quadro P1000 4GB" },
  { value: "quadro_p2000", label: "NVIDIA Quadro P2000 5GB" },
  { value: "quadro_p4000", label: "NVIDIA Quadro P4000 8GB" },
  { value: "quadro_rtx_4000", label: "NVIDIA Quadro RTX 4000 8GB" },
  { value: "quadro_rtx_5000", label: "NVIDIA Quadro RTX 5000 16GB" },
];


const cardStyles: StylesConfig<(typeof cardOptions)[0], true> = {
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

interface CardSelectProps {
  onChange: (selectedOptions: MultiValue<{ value: string; label: string }>) => void;
  value: MultiValue<{ value: string; label: string }>;
  className?: string;
}

const CardSelect: React.FC<CardSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect={false}
    isMulti
    options={cardOptions}
    styles={cardStyles}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default CardSelect;
