import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify, notifyError } from "./toast/msgtoast";
import ReusableBreadcrumb from "../../../../ultils/breadcrumb/admin/ReusableBreadcrumb";
import { breadcrumbItems } from "../../../../ultils/breadcrumb/admin/breadcrumbData";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import { Product } from "../../../../services/product_v2/admin/types/add-product";
import { ApiResponse } from "../../../../services/product_v2/admin/types/apiResponse";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { add } from "../../../../redux/product/admin/Thunk";
import SubmitButtonAdd from "../productAuction/btn/SubmitButtonAdd";
import Productdescription from "../productAuction/description/product_description";
import FormInput from "./Form/forminput";
import FormSelect from "./Form/formselect";
import ImageUpload from "./Form/imageUpload";
import { useFetchData } from "./hook/selectFetchData";
import ProductVariantSelector from "./Form/checkboxForm";


const AddProduct: React.FC = () => {
  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { imgPreview, handleImageChange } = useImageUpload();

  const navigate = useNavigate();

  const { categories, brands, conditionShopping, suppliers } = useFetchData();
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
  const handleVariantChange = (hasVariants: boolean) => {
    setValue("hasVariants", hasVariants);
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
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="space-y-4">
              <FormSelect
                label="Danh mục"
                id="product_type"
                options={(categories || []).map((categorie) => ({
                  _id: categorie._id,
                  name: categorie.name,
                }))}
                register={register}
                validation={{ required: "Danh mục mua sắm là bắt buộc" }}
                errorMessage={errors.product_type?.message}
              />
              <FormSelect
                label="Thương hiệu"
                id="product_brand"
                options={(brands || []).map((brand) => ({
                  _id: brand._id,
                  name: brand.name,
                }))}
                register={register}
                validation={{ required: "Thương hiệu mua sắm là bắt buộc" }}
                errorMessage={errors.product_brand?.message}
              />
              <FormSelect
                label="Nhà cung cấp"
                id="product_supplier"
                options={(suppliers || []).map((supplier) => ({
                  _id: supplier._id,
                  name: supplier.name,
                }))}
                register={register}
                validation={{ required: "Nhà cung cấp mua sắm là bắt buộc" }}
                errorMessage={errors.product_supplier?.message}
              />
            </div>
          </div>
          <ProductVariantSelector
            label="Loại sản phẩm"
            id="hasVariants"
            onVariantChange={handleVariantChange}
            register={register}
            validation={{ required: "Vui lòng chọn loại sản phẩm" }}
            errorMessage={errors.hasVariants?.message}
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
                register={register}
                control={control}
                error={errors.product_name}
                validation={{
                  required: {
                    value: true,
                    message: "Tên không được để trống",
                  },
                }}
              />


              <FormInput
                id="weight_g"
                label="Trọng lượng"
                format
                suffix=" "
                register={register}
                control={control}
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
                control={control}
                error={errors.createdAt}
                validation={{
                  required: "Ngày nhập không được bỏ trống",
                }}
              />



              <FormSelect
                label="Điều kiện mua sắm"
                id="product_condition"
                options={(conditionShopping || []).map((conditionShopping) => ({
                  _id: conditionShopping._id,
                  name: conditionShopping.nameCondition,
                }))}
                register={register}
                validation={{ required: "Điều kiện mua sắm là bắt buộc" }}
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
