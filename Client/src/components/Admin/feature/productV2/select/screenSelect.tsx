import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { StylesConfig, SingleValue, ActionMeta } from "react-select";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { getAllScreenThunk } from "../../../../../redux/product/attributes/Thunk"; 
import { Screen } from "../../../../../services/product_v2/types/attributes/getAllScreen";
const screenStyles: StylesConfig<{ value: string; label: string }, false> = {
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
  clearIndicator: (styles) => ({
    ...styles,
    color: "black",
    cursor: "pointer",
  }),
};

interface ScreenSelectProps {
  onChange: (
    selectedOption: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => void;
  value: SingleValue<{ value: string; label: string }> | null;
  className?: string;
}

const ScreenSelect: React.FC<ScreenSelectProps> = ({ onChange, value, className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { screens, isLoading } = useSelector(
    (state: RootState) => state.getAttributes.getAllScreen
  );

  useEffect(() => {
    dispatch(getAllScreenThunk());
  }, [dispatch]);

  if (isLoading) {
    return <p>Loading screens...</p>;
  }

  const screenOptions = screens.map((screen: Screen) => ({
    value: screen._id,
    label: screen.name,
  }));

  return (
    <Select
      classNamePrefix="react-select"
      closeMenuOnSelect={true}
      isMulti={false}
      options={screenOptions}
      styles={screenStyles}
      value={value}
      onChange={onChange}
      className={className}
      isClearable={true}
    />
  );
};

export default ScreenSelect;
