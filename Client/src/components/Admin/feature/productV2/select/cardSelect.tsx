import React from "react";
import Select, { StylesConfig, SingleValue } from "react-select";

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
  { value: "a15_gpu_4core", label: "Apple A15 GPU, 4-core" },
  { value: "a16_gpu_5core", label: "Apple A16 GPU, 5-core" },
  { value: "a17_pro_gpu_6core", label: "Apple A17 Pro GPU, 6-core" },
  { value: "m1_gpu_7core", label: "Apple M1 GPU, 7-core" },
  { value: "m1_pro_gpu_14core", label: "Apple M1 Pro GPU, 14-core" },
  { value: "m1_max_gpu_32core", label: "Apple M1 Max GPU, 32-core" },
  { value: "m2_gpu_10core", label: "Apple M2 GPU, 10-core" },
  { value: "m2_pro_gpu_19core", label: "Apple M2 Pro GPU, 19-core" },
  { value: "m2_max_gpu_38core", label: "Apple M2 Max GPU, 38-core" }
];


const cardStyles: StylesConfig<{ value: string; label: string }, false> = {
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

interface CardSelectProps {
  onChange: (selectedOption: SingleValue<{ value: string; label: string }>) => void;
  value: SingleValue<{ value: string; label: string }>;
  className?: string;
}

const CardSelect: React.FC<CardSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect={true} // Đóng menu khi chọn một giá trị
    isMulti={false} // Cho phép chọn một giá trị duy nhất
    options={cardOptions}
    styles={cardStyles}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default CardSelect;
