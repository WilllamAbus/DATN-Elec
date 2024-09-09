import { useState } from "react";
import { SingleValue } from "react-select";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import {
  ColorOption,
  RamOption,
  ScreenOption,
  CPUOption,
  CardOption,
  BatteryOption,
  OsOption,
  StorageOption,
} from "../types/main_product";
import {
  handleColorChange,
  handleRamChange,
  handleScreenChange,
  handleCPUChange,
  handleCardChange,
  handleBatteryChange,
  handleOsChange,
  handleStorageChange,
} from "../handlers";

export const useProductForm = (
  setValue: UseFormSetValue<ProductV2>,
  getValues: UseFormGetValues<ProductV2>
) => {
  const [selectedRam, setSelectedRam] = useState<SingleValue<RamOption>>(null);
  const [selectedColors, setSelectedColors] = useState<SingleValue<ColorOption>>(null);
  const [selectedScreen, setSelectedScreen] = useState<SingleValue<ScreenOption>>(null);
  const [selectedCPU, setSelectedCPU] = useState<SingleValue<CPUOption>>(null);
  const [selectedCard, setSelectedCard] = useState<SingleValue<CardOption>>(null);
  const [selectedBattery, setSelectedBattery] = useState<SingleValue<BatteryOption>>(null);
  const [selectedOS, setSelectedOS] = useState<SingleValue<OsOption>>(null);
  const [selectedStorage, setSelectedStorage] = useState<SingleValue<StorageOption>>(null);

  const onColorChange = (selectedOptions: SingleValue<ColorOption>) => {
    handleColorChange(selectedOptions, setSelectedColors, setValue, getValues);
  };
  const onRamChange = (selectedOptions: SingleValue<RamOption>) => {
    handleRamChange(selectedOptions, setSelectedRam, setValue, getValues);
  };
  const onScreenChange = (selectedOptions: SingleValue<ScreenOption>) => {
    handleScreenChange(selectedOptions, setSelectedScreen, setValue, getValues);
  };
  const onCPUChange = (selectedOptions: SingleValue<CPUOption>) => {
    handleCPUChange(selectedOptions, setSelectedCPU, setValue, getValues);
  };
  const onCardChange = (selectedOptions: SingleValue<CardOption>) => {
    handleCardChange(selectedOptions, setSelectedCard, setValue, getValues);
  };
  const onBatteryChange = (selectedOptions: SingleValue<BatteryOption>) => {
    handleBatteryChange(selectedOptions, setSelectedBattery, setValue, getValues);
  };
  const onOsChange = (selectedOptions: SingleValue<OsOption>) => {
    handleOsChange(selectedOptions, setSelectedOS, setValue, getValues);
  };
  const onStorageChange = (selectedOptions: SingleValue<StorageOption>) => {
    handleStorageChange(selectedOptions, setSelectedStorage, setValue, getValues);
  };

  return {
    selectedRam,
    selectedColors,
    selectedScreen,
    selectedCPU,
    selectedCard,
    selectedBattery,
    selectedOS,
    selectedStorage,
    onColorChange,
    onRamChange,
    onScreenChange,
    onCPUChange,
    onCardChange,
    onBatteryChange,
    onOsChange,
    onStorageChange,
    setSelectedRam,
    setSelectedColors,
    setSelectedScreen,
    setSelectedCPU,
    setSelectedCard,
    setSelectedBattery,
    setSelectedOS,
    setSelectedStorage,
  };
};
