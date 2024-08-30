import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify, notifyError } from "./toast/msgtoast";
import ReusableBreadcrumb from "../../../../ultils/breadcrumb/ReusableBreadcrumb";
import { breadcrumbItems } from "../../../../ultils/breadcrumb/breadcrumbData";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import { ProductV2 } from "../../../../types/ProductV2";
import { ApiResponse } from "../../../../services/product_v2/admin/types/apiResponse";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { add } from "../../../../redux/product/admin/Thunk";
import {
  ColorOption,
  RamOption,
  ScreenOption,
  CPUOption,
  CardOption,
  BatteryOption,
} from "./types";
import {
  RamSelect,
  ColorSelect,
  ScreenSelect,
  CpuSelect,
  CardSelect,
  BatterySelect,
} from "./select";
import {
  handleRamChange,
  handleColorChange,
  handleScreenChange,
  handleCPUChange,
  handleCardChange,
  handleBatteryChange,
} from "./handlers";
import { selectFetchData } from "./FetchData";
import { DiscountSelect, CategorySelect, BrandSelect, SupplierSelect } from "./select";
import { MultiValue } from "react-select";
const AddProduct: React.FC = () => {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductV2>({
    defaultValues: {
      product_attributes: [],
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { imgPreview, handleImageChange } = useImageUpload();
  const [selectedRam, setSelectedRam] = useState<MultiValue<RamOption>>([]);
  const [selectedColors, setSelectedColors] = useState<MultiValue<ColorOption>>([]);
  const [selectedScreen, setSelectedScreen] = useState<MultiValue<ScreenOption>>([]);
  const [selectedCPU, setSelectedCPU] = useState<MultiValue<CPUOption>>([]);
  const [selectedCard, setSelectedCard] = useState<MultiValue<CardOption>>([]);
  const [selectedBattery, setSelectedBattery] = useState<MultiValue<BatteryOption>>([]);
  const onColorChange = (selectedOptions: MultiValue<ColorOption>) => {
    handleColorChange(selectedOptions, setSelectedColors, setValue, getValues);
  };
  const onRamChange = (selectedOptions: MultiValue<RamOption>) => {
    handleRamChange(selectedOptions, setSelectedRam, setValue, getValues);
  };
  const onScreenChange = (selectedOptions: MultiValue<ScreenOption>) => {
    handleScreenChange(selectedOptions, setSelectedScreen, setValue, getValues);
  };
  const onCPUChange = (selectedOptions: MultiValue<CPUOption>) => {
    handleCPUChange(selectedOptions, setSelectedCPU, setValue, getValues);
  };
  const onCardChange = (selectedOptions: MultiValue<CardOption>) => {
    handleCardChange(selectedOptions, setSelectedCard, setValue, getValues);
  };
  const onBatteryChange = (selectedOptions: MultiValue<BatteryOption>) => {
    handleBatteryChange(selectedOptions, setSelectedBattery, setValue, getValues);
  };

  const navigate = useNavigate();
  const { brands, suppliers, discounts, productFormats, conditionShoppingList, categories } =
    selectFetchData();

  const submitFormAdd: SubmitHandler<ProductV2> = async (data) => {
    setIsLoading(true);
    try {
      const actionResult = await dispatch(add(data)).unwrap();
      notify(actionResult.msg);
      setTimeout(() => {
        navigate("/admin/listproduct");
      }, 2000);
    } catch (error) {
      notifyError((error as ApiResponse<null>).msg);
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
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">Danh mục &amp; Giảm giá</h3>
            <CategorySelect
              categories={categories}
              register={register}
              error={errors.product_type}
            />
            <DiscountSelect
              discounts={discounts}
              register={register}
              error={errors.product_discount}
            />
          </div>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Thương hiệu &amp; Màu sắc
            </h3>
            <BrandSelect brands={brands} register={register} error={errors.product_brand} />

            <SupplierSelect
              suppliers={suppliers}
              register={register}
              error={errors.product_supplier}
            />
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
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Bonnie"
                  {...register("product_name", {
                    required: {
                      value: true,
                      message: "Tên không được để trống",
                    },
                  })}
                />
                {errors.product_name && (
                  <div className="flex items-center mt-2 text-red-600">
                    <span className="text-sm font-medium">{errors.product_name.message}</span>
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="product_price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Giá gốc
                </label>
                <NumericFormat
                  id="product_price"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  thousandSeparator="."
                  decimalSeparator=","
                  suffix=" đ"
                  {...register("product_price", {
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
                    setValue("product_price", floatValue ?? 0);
                  }}
                />
                {errors.product_price && (
                  <div className="flex items-center mt-2 text-red-600">
                    <span className="text-sm font-medium">{errors.product_price.message}</span>
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="quantity"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Số lượng
                </label>
                <input
                  type="text"
                  id="product_quantity"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  {...register("product_quantity", {
                    required: "Số lượng không được bỏ trống",
                    min: { value: 0, message: "Số lượng phải lớn hơn 0" },
                    validate: (value) => !isNaN(value) || "Số lượng sản phẩm phải là số",
                  })}
                />
                {errors.product_quantity && (
                  <div className="flex items-center mt-2 text-red-600">
                    <span className="text-sm font-medium">{errors.product_quantity.message}</span>
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="weight_g"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Khối lượng (kg)
                </label>
                <NumericFormat
                  id="weight_g"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  thousandSeparator="."
                  decimalSeparator=","
                  suffix=" kg"
                  decimalScale={2}
                  fixedDecimalScale={true}
                  {...register("weight_g", {
                    required: "Khối lượng không được bỏ trống",
                    min: {
                      value: 0.01,
                      message: "Khối lượng phải lớn hơn 0",
                    },
                  })}
                  onValueChange={(values: { floatValue: number | undefined }) => {
                    const { floatValue } = values;
                    setValue("weight_g", floatValue ?? 0);
                  }}
                />
                {errors.weight_g && (
                  <div className="flex items-center mt-2 text-red-600">
                    <span className="text-sm font-medium">{errors.weight_g.message}</span>
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="launch-year"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Thời điểm ra mắt
                </label>
                <input
                  type="number"
                  id="launch-year"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="2024"
                  min="2020"
                  max="2024"
                  step="1"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="birthday"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Ngày nhập
                </label>
                <input
                  type="date"
                  id="createdAt"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="12/12/2024"
                  {...register("createdAt", { required: "Ngày nhập không được bỏ trống" })}
                />
                {errors.createdAt && (
                  <div className="flex items-center mt-2 text-red-600">
                    <span className="text-sm font-medium">{errors.createdAt.message}</span>
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="product_format"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Định dạng sản phẩm
                </label>
                <select
                  id="product_format"
                  className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  {...register("product_format")}
                >
                  <option value="">Chọn định dạng sản phẩm</option>
                  {productFormats.map((format) => (
                    <option key={format._id} value={format._id}>
                      {format.formats}
                    </option>
                  ))}
                </select>
                {errors.product_format && (
                  <div className="flex items-center mt-2 text-red-600">
                    <span className="text-sm font-medium">{errors.product_format.message}</span>
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="condition_shopping"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Điều kiện mua sắm
                </label>
                <select
                  id="product_condition"
                  className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  {...register("product_condition", {
                    required: "Vui lòng chọn điều kiện mua sắm",
                  })}
                >
                  <option value="">Chọn điều kiện mua sắm</option>
                  {conditionShoppingList.map((condition) => (
                    <option key={condition._id} value={condition._id}>
                      {condition.nameCondition}
                    </option>
                  ))}
                </select>
                {errors.product_condition && (
                  <div className="flex items-center mt-2 text-red-600">
                    <span className="text-sm font-medium">{errors.product_condition.message}</span>
                  </div>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Dung lượng RAM
                </label>
                <RamSelect value={selectedRam} onChange={onRamChange} />
                {errors.product_attributes && (
                  <span className="text-red-600">
                    {errors.product_attributes.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Màn hình
                </label>
                <ScreenSelect value={selectedScreen} onChange={onScreenChange} />
                {errors.product_attributes && (
                  <span className="text-red-600">
                    {errors.product_attributes.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  CPU
                </label>
                <CpuSelect value={selectedCPU} onChange={onCPUChange} />
                {errors.product_attributes && (
                  <span className="text-red-600">
                    {errors.product_attributes.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Màu sắc
                </label>
                <ColorSelect value={selectedColors} onChange={onColorChange} />
                {errors.product_attributes && (
                  <span className="text-red-600">
                    {errors.product_attributes.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Card Đồ Họa
                </label>
                <CardSelect value={selectedCard} onChange={onCardChange} />
                {errors.product_attributes && (
                  <span className="text-red-600">
                    {errors.product_attributes.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Pin
                </label>
                <BatterySelect value={selectedBattery} onChange={onBatteryChange} />
                {errors.product_attributes && (
                  <span className="text-red-600">
                    {errors.product_attributes.message?.toString()}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full mb-4 border mt-6 border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
                <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 12 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
                        />
                      </svg>
                      <span className="sr-only">Attach file</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                      </svg>
                      <span className="sr-only">Embed map</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                      </svg>
                      <span className="sr-only">Upload image</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                        <path d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 0 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z" />
                      </svg>
                      <span className="sr-only">Format code</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z" />
                      </svg>
                      <span className="sr-only">Add emoji</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 21 18"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.5 3h9.563M9.5 9h9.563M9.5 15h9.563M1.5 13a2 2 0 1 1 3.321 1.5L1.5 17h5m-5-15 2-1v6m-2 0h4"
                        />
                      </svg>
                      <span className="sr-only">Add list</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                      </svg>
                      <span className="sr-only">Settings</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                        <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                      </svg>
                      <span className="sr-only">Timeline</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                        <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                      </svg>
                      <span className="sr-only">Download</span>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  data-tooltip-target="tooltip-fullscreen"
                  className="p-2 text-gray-500 rounded cursor-pointer sm:ms-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 19 19"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
                    />
                  </svg>
                  <span className="sr-only">Full screen</span>
                </button>
                <div
                  id="tooltip-fullscreen"
                  role="tooltip"
                  className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Show full screen
                  <div className="tooltip-arrow" data-popper-arrow="" />
                </div>
              </div>
              <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                <label htmlFor="editor" className="sr-only">
                  Publish post
                </label>
                <textarea
                  id="product_description"
                  rows={8}
                  className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="Write an article..."
                  {...register("product_description")}
                />
                {errors.product_description && (
                  <span className="text-red-600">
                    {errors.product_description.message?.toString()}
                  </span>
                )}
              </div>
            </div>

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

export default AddProduct;
