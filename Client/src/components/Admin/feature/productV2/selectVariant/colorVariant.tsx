import React from "react";
import chroma from "chroma-js";
import Select, { StylesConfig, SingleValue } from "react-select";

const colorOptions = [
  { value: "black", label: "Màu đen", color: "#000000" },
  { value: "gray", label: "Màu xám", color: "#808080" },
  { value: "white", label: "Màu trắng", color: "#fff3f3" },
  { value: "red", label: "Màu đỏ", color: "#FF0000" },
  { value: "purple", label: "Màu tím", color: "#3b0764" },
  { value: "pink", label: "Màu hồng", color: "#FFC0CB" },
  { value: "titan", label: "Titan tự nhiên", color: "#BEBEBE" },
];

const getColorStyles = (
  color: string,
  isDisabled: boolean,
  isSelected: boolean,
  isFocused: boolean
) => {
  const chromaColor = chroma(color);
  return {
    backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? color
      : isFocused
      ? chromaColor.alpha(0.1).css()
      : undefined,
    color: isDisabled
      ? "#ccc"
      : isSelected
      ? chroma.contrast(chromaColor, "white") > 2
        ? "white"
        : "black"
      : color,
    cursor: isDisabled ? "not-allowed" : "default",
  };
};

const colourStyles: StylesConfig<{ value: string; label: string; color: string }, false> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    ...getColorStyles(data.color, isDisabled, isSelected, isFocused),
    ":active": {
      ...styles[":active"],
      backgroundColor: !isDisabled
        ? isSelected
          ? data.color
          : chroma(data.color).alpha(0.3).css()
        : undefined,
    },
  }),
  singleValue: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
};

interface ColorSelectProps {
  onChange: (selectedOption: SingleValue<{ value: string; label: string; color: string }>) => void;
  value: SingleValue<{ value: string; label: string; color: string }>;
  className?: string;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect={true}
    isMulti={false}
    options={colorOptions}
    styles={colourStyles}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default ColorSelect;
