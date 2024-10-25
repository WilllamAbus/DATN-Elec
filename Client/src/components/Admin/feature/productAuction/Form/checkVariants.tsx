import Swal from "sweetalert2";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { SingleValue } from "react-select";
import { Product} from "../../../../../services/product_v2/admin/types/add-product";
import {
  OsOption,
  StorageOption,
  BatteryOption,
  CardOption,
  CPUOption,
  ScreenOption,
  RamOption,
  ColorOption,
} from "../../productV2/types/main_product";

export const handleVariantChange = async (
  checked: boolean,
  setValue: UseFormSetValue<Product>,
  getValues: UseFormGetValues<Product>,
  resetProductAttributes: (setValue: UseFormSetValue<Product>) => void,
  setSelectedRam: React.Dispatch<React.SetStateAction<RamOption | null>>,
  setSelectedColors: React.Dispatch<React.SetStateAction<ColorOption | null>>,
  setSelectedScreen: React.Dispatch<React.SetStateAction<ScreenOption | null>>,
  setSelectedCPU: React.Dispatch<React.SetStateAction<CPUOption | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<CardOption | null>>,
  setSelectedBattery: React.Dispatch<React.SetStateAction<BatteryOption | null>>,
  setSelectedOS: React.Dispatch<React.SetStateAction<SingleValue<OsOption> | null>>,
  setSelectedStorage: React.Dispatch<React.SetStateAction<StorageOption | null>>,
  handleAttributesChange: (checked: boolean) => void
) => {
  if (checked) {
    const filledFields = getValues();
    if (
      filledFields.variants &&
      Object.keys(filledFields.variants).length > 0
    ) {
      const result = await Swal.fire({
        title: "Xác nhận",
        text: "Bạn đã điền các giá trị, chọn biến thể sẽ xoá tất cả các giá trị đã nhập. Bạn có chắc chắn không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, Xoá tất cả",
        cancelButtonText: "Huỷ",
      });
      if (result.isConfirmed) {
        setValue("product_type", "");
        setValue("product_brand", "");
        setValue("product_supplier", "");
        resetProductAttributes(setValue);
        setSelectedRam(null);
        setSelectedColors(null);
        setSelectedScreen(null);
        setSelectedCPU(null);
        setSelectedCard(null);
        setSelectedBattery(null);
        setSelectedOS(null);
        setSelectedStorage(null);

        handleAttributesChange(true);
      } else {
        handleAttributesChange(false);
      }
    } else {
      handleAttributesChange(true);
    }
  } else {
    handleAttributesChange(false);
  }
};
