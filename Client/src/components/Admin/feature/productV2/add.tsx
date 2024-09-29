import React, { useState } from "react";
import { useForm,  SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify, notifyError } from "./toast/msgtoast";
import ReusableBreadcrumb from "../../../../ultils/breadcrumb/ReusableBreadcrumb";
import { breadcrumbItems } from "../../../../ultils/breadcrumb/breadcrumbData";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import { Product } from "../../../../services/product_v2/admin/types/add-product";
import { ApiResponse } from "../../../../services/product_v2/admin/types/apiResponse";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { add } from "../../../../redux/product/admin/Thunk";
import { selectFetchData } from "./FetchData";
import SubmitButtonAdd from "./btn/SubmitButtonAdd";
import Productdescription from "./description/product_description";
import FormInput from "./Form/forminput";
import FormSelect from "./Form/formselect";
import ImageUpload from "./Form/imageUpload";
import CategoryDiscountSelect from "./Form/cate_Discount";
import BrandSupplierSelect from "./Form/Brand_Supplier";


const AddProduct: React.FC = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>({
    defaultValues: {
      hasVariants: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { imgPreview, handleImageChange } = useImageUpload();

  const navigate = useNavigate();
  const { brands, suppliers, discounts, productFormats, conditionShoppingList, categories } =
    selectFetchData();
  const submitFormAdd: SubmitHandler<Product> = async (data) => {
    setIsLoading(true);
    try {
      const actionResult = await dispatch(add(data)).unwrap();
      notify(actionResult.msg);
      setTimeout(() => {
        navigate("/admin/listproduct");
      }, 2000);
    } catch (error) {
      const errorMsg = (error as ApiResponse<null>).msg || "Có lỗi xảy ra khi thêm sản phẩm";
      notifyError(errorMsg);
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
