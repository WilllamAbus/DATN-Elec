import React from "react";
import chroma from "chroma-js";
import Select, { StylesConfig, MultiValue } from "react-select";

const colorOptions = [
  { value: "black", label: "Màu đen", color: "#000000" },
  { value: "gray", label: "Màu xám", color: "#808080" },
  { value: "white", label: "Màu trắng", color: "#fff3f3" },
  { value: "red", label: "Màu đỏ", color: "#FF0000" },
  { value: "Purple", label: "Màu xanh", color: "#3b0764" },
  { value: "pink", label: "Màu hồng", color: "#FFC0CB" },
  { value: "titan", label: "Titan tự nhiên", color: "#BEBEBE" },
];

const colourStyles: StylesConfig<(typeof colorOptions)[0], true> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.3).css()
          : undefined,
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white",
    },
  }),
};

interface ColorSelectProps {
  onChange: (selectedOptions: MultiValue<(typeof colorOptions)[0]>) => void;
  value: MultiValue<(typeof colorOptions)[0]>;
  className?: string;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ onChange, value, className }) => (
  <Select
    classNamePrefix="react-select"
    closeMenuOnSelect={false}
    isMulti
    options={colorOptions}
    styles={colourStyles}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default ColorSelect;
