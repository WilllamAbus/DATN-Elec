import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
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
import { ToggleSwitch } from "flowbite-react";

import {
  RamSelect,
  ColorSelect,
  ScreenSelect,
  CpuSelect,
  CardSelect,
  BatterySelect,
  OsSelect,
  StorageSelect,
} from "./select";
import { selectFetchData } from "./FetchData";
import SubmitButtonAdd from "./btn/SubmitButtonAdd";
import Productdescription from "./description/product_description";
import { useProductForm } from "./handlers/useHookProductAttributes";
import FormField from "./Form/formfile";
import FormInput from "./Form/forminput";
import FormSelect from "./Form/formselect";
import ImageUpload from "./Form/imageUpload";
import CategoryDiscountSelect from "./Form/cate_Discount";
import BrandSupplierSelect from "./Form/Brand_Supplier";
import { resetProductAttributes } from "./handlers/resetProductAttributes";
import { handleVariantChange } from "./Form/checkVariants";
const AddProduct: React.FC = () => {
  const {
    control,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductV2>({
    defaultValues: {
      hasVariants: false,
      product_attributes: [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { imgPreview, handleImageChange } = useImageUpload();
  const {
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
    setSelectedOS,
    setSelectedBattery,
    setSelectedCPU,
    setSelectedCard,
    setSelectedColors,
    setSelectedRam,
    setSelectedScreen,
    setSelectedStorage,
  } = useProductForm(setValue, getValues);
  const navigate = useNavigate();
  const { brands, suppliers, discounts, productFormats, conditionShoppingList, categories } =
    selectFetchData();

  const submitFormAdd: SubmitHandler<ProductV2> = async (data) => {
    console.log("Form Data:", data);
    console.log("Has Variants:", data.hasVariants);
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
  const [hasAttributes, setHasAttributes] = useState(false);

  const handleAttributesChange = (checked: boolean) => {
    setHasAttributes(checked);
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
          <ImageUpload
            imgPreview={imgPreview}
            register={register}
            handleImageChange={handleImageChange}
            error={errors.image?.message}
          />
          <CategoryDiscountSelect
            categories={categories}
            discounts={discounts}
            register={register}
            errors={{
              product_type: errors.product_type?.message,
              product_discount: errors.product_discount?.message,
            }}
          />
          <BrandSupplierSelect
            brands={brands}
            suppliers={suppliers}
            register={register}
            errors={{
              product_brand: errors.product_brand?.message,
              product_supplier: errors.product_supplier?.message,
            }}
          />
        </div>
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              {" "}
              <h3 className="text-xl font-semibold dark:text-white">Tổng quan sản phẩm</h3>
              <Controller
                control={control}
                name="hasVariants"
                render={({ field }) => (
                  <ToggleSwitch
                    checked={field.value}
                    onChange={async (checked: boolean) => {
                      await handleVariantChange(
                        checked,
                        setValue,
                        getValues,
                        resetProductAttributes,
                        setSelectedRam,
                        setSelectedColors,
                        setSelectedScreen,
                        setSelectedCPU,
                        setSelectedCard,
                        setSelectedBattery,
                        setSelectedOS,
                        setSelectedStorage,
                        handleAttributesChange
                      );
                      field.onChange(checked);
                    }}
                    label="Có thuộc tính biến thể"
                    className="ml-4"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-6 gap-6">
              <FormInput
                id="product_name"
                label="Tên sản phẩm"
                placeholder="Bonnie"
                register={register}
                error={errors.product_name}
                validation={{
                  required: {
                    value: true,
                    message: "Tên không được để trống",
                  },
                }}
              />

              <FormInput
                id="product_price"
                label="Giá gốc"
                format
                suffix=" đ"
                register={register}
                error={errors.product_price}
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
                  setValue("product_price", floatValue ?? 0);
                }}
              />

              <FormInput
                id="weight_g"
                label="Khối lượng (kg)"
                format
                suffix=" kg"
                register={register}
                error={errors.weight_g}
                validation={{
                  required: "Khối lượng không được bỏ trống",
                  min: {
                    value: 0.01,
                    message: "Khối lượng phải lớn hơn 0",
                  },
                }}
                onValueChange={(values: { floatValue: number | undefined }) => {
                  const { floatValue } = values;
                  setValue("weight_g", floatValue ?? 0);
                }}
              />

              <FormInput
                id="createdAt"
                label="Ngày nhập"
                type="date"
                register={register}
                error={errors.createdAt}
                validation={{
                  required: "Ngày nhập không được bỏ trống",
                }}
              />

              <FormSelect
                label="Định dạng sản phẩm"
                id="product_format"
                options={productFormats.map((format) => ({
                  _id: format._id,
                  name: format.formats,
                }))}
                register={register}
                errorMessage={errors.product_format?.message}
              />
              <FormSelect
                label="Điều kiện mua sắm"
                id="product_condition"
                options={conditionShoppingList.map((condition) => ({
                  _id: condition._id,
                  name: condition.nameCondition,
                }))}
                register={register}
                validation={{
                  required: "Vui lòng chọn điều kiện mua sắm",
                }}
                errorMessage={errors.product_condition?.message}
              />
              {hasAttributes ? (
                <>
                  <FormField
                    label="Hệ điều hành"
                    error={errors.product_attributes?.message?.toString()}
                  >
                    <OsSelect value={selectedOS} onChange={onOsChange} />
                  </FormField>

                  <FormField
                    label="Màn hình"
                    error={errors.product_attributes?.message?.toString()}
                  >
                    <ScreenSelect value={selectedScreen} onChange={onScreenChange} />
                  </FormField>
                </>
              ) : (
                <>
                  <FormField
                    label="Hệ điều hành"
                    error={errors.product_attributes?.message?.toString()}
                  >
                    <OsSelect value={selectedOS} onChange={onOsChange} />
                  </FormField>

                  <FormField
                    label="Màn hình"
                    error={errors.product_attributes?.message?.toString()}
                  >
                    <ScreenSelect value={selectedScreen} onChange={onScreenChange} />
                  </FormField>

                  <FormField label="CPU" error={errors.product_attributes?.message?.toString()}>
                    <CpuSelect value={selectedCPU} onChange={onCPUChange} />
                  </FormField>

                  <FormField label="Màu sắc" error={errors.product_attributes?.message?.toString()}>
                    <ColorSelect value={selectedColors} onChange={onColorChange} />
                  </FormField>

                  <FormField
                    label="Card Đồ Họa"
                    error={errors.product_attributes?.message?.toString()}
                  >
                    <CardSelect value={selectedCard} onChange={onCardChange} />
                  </FormField>

                  <FormField label="Pin" error={errors.product_attributes?.message?.toString()}>
                    <BatterySelect value={selectedBattery} onChange={onBatteryChange} />
                  </FormField>

                  <FormField label="Ram" error={errors.product_attributes?.message?.toString()}>
                    <RamSelect value={selectedRam} onChange={onRamChange} />
                  </FormField>

                  <FormField label="Ổ cứng" error={errors.product_attributes?.message?.toString()}>
                    <StorageSelect value={selectedStorage} onChange={onStorageChange} />
                  </FormField>
                </>
              )}
            </div>
            <Productdescription register={register} errors={errors} />
            <div className="col-span-6 sm:col-full">
              <SubmitButtonAdd isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;
