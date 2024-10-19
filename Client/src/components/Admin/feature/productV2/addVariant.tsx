import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify, notifyError } from "./toast/msgtoast";
import ReusableBreadcrumb from "../../../../ultils/breadcrumb/ReusableBreadcrumb";
import { breadcrumbItems } from "../../../../ultils/breadcrumb/breadcrumbData";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import { ProductVariant, RAM, CPU, COLOR, GRAPHICSCARD, SCREEN, BATTERY,OPERATINGSYSTEM,STORAGE,ProductVariantResponse } from "../../../../services/product_v2/admin/types/addVariant";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { addVariantThunk } from "../../../../redux/product/admin/Thunk";

import {
  RamSelect,
  ColorSelect,
  ScreenSelect,
  CpuSelect,
  CardSelect,
  BatterySelect,
  StorageSelect,
  OsSelect

} from "./selectVariant";
import {
  handleRamChange,
  handleColorChange,
  handleScreenChange,
  handleCPUChange,
  handleCardChange,
  handleBatteryChange,
  handleOsChange,
  handleStorageChange
} from "./handlersVariant";
import { SingleValue,MultiValue } from "react-select";
import Productdescription from "./description/product_description";
import FormInput from "./Form/forminput";
const AddVariant: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const productIdString = productId ?? "";
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductVariant>({
    defaultValues: {
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { imgPreview, handleImageChange } = useImageUpload();
  const [selectedRam, setSelectedRam] = useState<SingleValue<RAM>>(null);
  const [selectedColors, setSelectedColors] = useState<MultiValue<COLOR>>([]);
  const [selectedScreen, setSelectedScreen] = useState<SingleValue<SCREEN>>(null);
  const [selectedCPU, setSelectedCPU] = useState<SingleValue<CPU>>(null);
  const [selectedCard, setSelectedCard] = useState<SingleValue<GRAPHICSCARD>>(null);
  const [selectedBattery, setSelectedBattery] = useState<SingleValue<BATTERY>>(null);
  const [selectedOS, setSelectedOs] = useState<SingleValue<OPERATINGSYSTEM>>(null); 
  const [selectedStorage, setSelectedStorage] = useState<SingleValue<STORAGE>>(null); 
  const onRamChange = (selectedOptions: SingleValue<RAM>) => {
    handleRamChange(selectedOptions, setSelectedRam, setValue);
  };

  const onColorChange = (selectedOptions: MultiValue<COLOR>) => {
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
  const navigate = useNavigate();

  const submitFormAdd: SubmitHandler<ProductVariant> = async (data) => {
    setIsLoading(true);

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
      notifyError((error as ProductVariantResponse).msg); 
    }
  };

  return (
    <form onSubmit={handleSubmit(submitFormAdd)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addVariant} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Thêm biến thể sản phẩm
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

              <FormInput
                id="product_price"
                label="Giá gốc"
                format
                suffix=" đ"
                register={register}
                error={errors.variant_price}
                validation={{
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
                }}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setValue("variant_price", floatValue ?? 0);
                }}
              />
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Dung lượng RAM
                </label>
                <RamSelect value={selectedRam} onChange={onRamChange} />
                {errors.ram && (
                  <span className="text-red-600">
                    {errors.ram.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Ổ cứng
                </label>
                <StorageSelect value={selectedStorage} onChange={onStorageChange} />
                {errors.storage && (
                  <span className="text-red-600">
                    {errors.storage.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                 Hệ điều hành
                </label>
                <OsSelect value={selectedOS} onChange={onOsChange} />
                {errors.operatingSystem && (
                  <span className="text-red-600">
                    {errors.operatingSystem.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Màn hình
                </label>
                <ScreenSelect value={selectedScreen} onChange={onScreenChange} />
                {errors.screen && (
                  <span className="text-red-600">
                    {errors.screen.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  CPU
                </label>
                <CpuSelect value={selectedCPU} onChange={onCPUChange} />
                {errors.cpu && (
                  <span className="text-red-600">
                    {errors.cpu.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Màu sắc
                </label>
                <ColorSelect value={selectedColors} onChange={onColorChange} />
                {errors.color && (
                  <span className="text-red-600">
                    {errors.color.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Card Đồ Họa
                </label>
                <CardSelect value={selectedCard} onChange={onCardChange} />
                {errors.graphicsCard && (
                  <span className="text-red-600">
                    {errors.graphicsCard.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Pin
                </label>
                <BatterySelect value={selectedBattery} onChange={onBatteryChange} />
                {errors.battery && (
                  <span className="text-red-600">
                    {errors.battery.message?.toString()}
                  </span>
                )}
              </div>
            </div>
            <Productdescription register={register} errors={errors} />

            <div className="col-span-6 sm:col-full">
              <button
                type="submit"
                className={`text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
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
