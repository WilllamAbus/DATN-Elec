import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify, notifyError } from "./toast/msgtoast";
import ReusableBreadcrumb from "../../../../ultils/breadcrumb/ReusableBreadcrumb";
import { breadcrumbItems } from "../../../../ultils/breadcrumb/breadcrumbData";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import { ProductVariant } from "../../../../services/product_v2/admin/types";
import { ProductVariantResponse } from "../../../../services/product_v2/admin/types/addVariant";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { addVariantThunk } from "../../../../redux/product/admin/Thunk";
import {
  ColorOption,
  RamOption,
  ScreenOption,
  CPUOption,
  CardOption,
  BatteryOption,
} from "./types/variant_product";
import {
  RamSelect,
  ColorSelect,
  ScreenSelect,
  CpuSelect,
  CardSelect,
  BatterySelect,
} from "./selectVariant";
import {
  handleRamChange,
  handleColorChange,
  handleScreenChange,
  handleCPUChange,
  handleCardChange,
  handleBatteryChange,
} from "./handlersVariant";

import { SingleValue } from "react-select";
import Productdescription from "./description/product_description";
const AddVariant: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const productIdString = productId ?? "";
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductVariant>({
    defaultValues: {
      variant_attributes: [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { imgPreview, handleImageChange } = useImageUpload();
  const [selectedRam, setSelectedRam] = useState<SingleValue<RamOption>>(null);
  const [selectedColors, setSelectedColors] = useState<SingleValue<ColorOption>>(null);
  const [selectedScreen, setSelectedScreen] = useState<SingleValue<ScreenOption>>(null);
  const [selectedCPU, setSelectedCPU] = useState<SingleValue<CPUOption>>(null);
  const [selectedCard, setSelectedCard] = useState<SingleValue<CardOption>>(null);
  const [selectedBattery, setSelectedBattery] = useState<SingleValue<BatteryOption>>(null);
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

  const navigate = useNavigate();

  const submitFormAdd: SubmitHandler<ProductVariant> = async (data) => {
    setIsLoading(true);
    console.log("Submitting variant:", data);
    console.log("Product ID:", productIdString);

    try {
      const actionResult = await dispatch(
        addVariantThunk({ productId: productIdString, variant: data })
      ).unwrap();
      notify(actionResult.msg);
      setTimeout(() => {
        navigate("/admin/listproduct");
      }, 2000);
    } catch (error) {
      console.error("Error submitting variant:", error);
      notifyError((error as ProductVariantResponse<null>).msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitFormAdd)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addProducts} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Thêm sản phẩm
        </h1>
      </div>
      <div className="grid grid-cols-[1fr_2fr] px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              {imgPreview && (
                <div className="mb-4 rounded-lg w-24 h-24 sm:mb-0 xl:mb-4 2xl:mb-0">
                  <img src={imgPreview} alt="Image Preview" />
                </div>
              )}
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Hình ảnh</h3>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  JPG, GIF or PNG. Max size of 800KB
                </div>

                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    multiple
                    id="image"
                    {...register("image")}
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  />
                  {errors.image && <span className="text-red-600">{errors.image.message}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">Tổng quan sản phẩm</h3>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md   focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Bonnie"
                  {...register("variant_name", {
                    required: {
                      value: true,
                      message: "Tên không được để trống",
                    },
                  })}
                />
                {errors.variant_name && (
                  <div className="flex items-center mt-2 text-red-600">
                    <span className="text-sm font-medium">{errors.variant_name.message}</span>
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="variant_price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Giá gốc
                </label>
                <NumericFormat
                  id="variant_price"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  thousandSeparator="."
                  decimalSeparator=","
                  suffix=" đ"
                  {...register("variant_price", {
                    required: "Giá sản phẩm không được bỏ trống",
                    min: {
                      value: 1000,
                      message: "Giá sản phẩm không thể thấp hơn 1000",
                    },
                    max: {
                      value: 2000000000,
                      message: "Giá sản phẩm không thể vượt quá 2000000000",
                    },
                    valueAsNumber: true,
                  })}
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    setValue("variant_price", floatValue ?? 0);
                  }}
                />
                {errors.variant_price && (
                  <div className="flex items-center mt-2 text-red-600">
                    <span className="text-sm font-medium">{errors.variant_price.message}</span>
                  </div>
                )}
              </div>

              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Dung lượng RAM
                </label>
                <RamSelect value={selectedRam} onChange={onRamChange} />
                {errors.variant_attributes && (
                  <span className="text-red-600">
                    {errors.variant_attributes.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Màn hình
                </label>
                <ScreenSelect value={selectedScreen} onChange={onScreenChange} />
                {errors.variant_attributes && (
                  <span className="text-red-600">
                    {errors.variant_attributes.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  CPU
                </label>
                <CpuSelect value={selectedCPU} onChange={onCPUChange} />
                {errors.variant_attributes && (
                  <span className="text-red-600">
                    {errors.variant_attributes.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Màu sắc
                </label>
                <ColorSelect value={selectedColors} onChange={onColorChange} />
                {errors.variant_attributes && (
                  <span className="text-red-600">
                    {errors.variant_attributes.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Card Đồ Họa
                </label>
                <CardSelect value={selectedCard} onChange={onCardChange} />
                {errors.variant_attributes && (
                  <span className="text-red-600">
                    {errors.variant_attributes.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Pin
                </label>
                <BatterySelect value={selectedBattery} onChange={onBatteryChange} />
                {errors.variant_attributes && (
                  <span className="text-red-600">
                    {errors.variant_attributes.message?.toString()}
                  </span>
                )}
              </div>
            </div>
            <Productdescription register={register} errors={errors} />

            <div className="col-span-6 sm:col-full">
              <button
                type="submit"
                className={`text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Đang thêm...
                  </div>
                ) : (
                  "Thêm sản phẩm"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddVariant;
