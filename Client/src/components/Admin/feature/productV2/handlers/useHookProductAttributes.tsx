import { useState } from "react";
import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant, RAM, CPU, COLOR, GRAPHICSCARD, SCREEN, BATTERY,OPERATINGSYSTEM,STORAGE } from "../../../../../services/product_v2/admin/types/addVariant";

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
  setValue: UseFormSetValue<ProductVariant>,
) => {
  const [selectedRam, setSelectedRam] = useState<SingleValue<RAM>>(null);
  const [selectedColors, setSelectedColors] = useState<SingleValue<COLOR>>(null);
  const [selectedScreen, setSelectedScreen] = useState<SingleValue<SCREEN>>(null);
  const [selectedCPU, setSelectedCPU] = useState<SingleValue<CPU>>(null);
  const [selectedCard, setSelectedCard] = useState<SingleValue<GRAPHICSCARD>>(null);
  const [selectedBattery, setSelectedBattery] = useState<SingleValue<BATTERY>>(null);
  const [selectedOS, setSelectedOs] = useState<SingleValue<OPERATINGSYSTEM>>(null); 
  const [selectedStorage, setSelectedStorage] = useState<SingleValue<STORAGE>>(null); 


  const onRamChange = (selectedOptions: SingleValue<RAM>) => {
    handleRamChange(selectedOptions, setSelectedRam, setValue);
  };

  const onColorChange = (selectedOptions: SingleValue<COLOR>) => {
    handleColorChange(selectedOptions, setSelectedColors, setValue);
  };


  const onScreenChange = (selectedOptions: SingleValue<SCREEN>) => {
    handleScreenChange(selectedOptions, setSelectedScreen, setValue);
  };

  const onCPUChange = (selectedOptions: SingleValue<CPU>) => {
    handleCPUChange(selectedOptions, setSelectedCPU, setValue);
  };

  const onCardChange = (selectedOptions: SingleValue<GRAPHICSCARD>) => {
    handleCardChange(selectedOptions, setSelectedCard, setValue);
  };
  const onBatteryChange = (selectedOptions: SingleValue<BATTERY>) => {
    handleBatteryChange(selectedOptions, setSelectedBattery, setValue);
  };
  const onOsChange = (selectedOptions: SingleValue<OPERATINGSYSTEM>) => { 
    handleOsChange(selectedOptions, setSelectedOs, setValue);
  };

  const onStorageChange = (selectedOptions: SingleValue<STORAGE>) => { 
    handleStorageChange(selectedOptions, setSelectedStorage, setValue);
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
    setSelectedStorage,
  };
};
