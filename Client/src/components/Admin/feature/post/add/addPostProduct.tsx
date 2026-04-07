import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify, notifyError } from "../../productV2/toast/msgtoast";
import ReusableBreadcrumb from "../../../../../ultils/breadcrumb/admin/ReusableBreadcrumb";
import { breadcrumbItems } from "../../../../../ultils/breadcrumb/admin/breadcrumbData";
import { Post, responsePost } from "../../../../../services/post/admin/types/post";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import { addPostThunk } from "../../../../../redux/post/thunk";
import FormInput from "../form/formInput";
import CKEditorComponent from "../customEditor/ckeditor";
import ImageUpload from "../form/formImage";
import { useImageUpload } from "../hook/useImageUpload";
import { useFetchData } from "../hook/selectFetchData";
import FormSelect from "../form/formSelect";
const addPostProduct: React.FC = () => {
  const { categories, products } = useFetchData();
  const { register, handleSubmit, control,watch,setValue, formState: { errors } } = useForm<Post>();
  const [isLoading, setIsLoading] = useState(false);
  const { imgPreview, handleImageChange,error  } = useImageUpload();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const submitFormAdd: SubmitHandler<Post> = async (data) => {
    setIsLoading(true);
    try {
      if (error) {
        notifyError(error); // Hiển thị thông báo lỗi
        return; // Ngăn không cho gửi form
    }
      const actionResult = await dispatch(
        addPostThunk(data)
      ).unwrap();
      notify(actionResult.msg);
      setTimeout(() => {
        navigate("/admin/list-post");
      }, 2000);
    } catch (error) {
      notifyError((error as responsePost).msg);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(submitFormAdd)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addPostProduct} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Thêm bài viết cho sản phẩm
        </h1>
      </div>
      <div className="grid grid-cols-1 px-4 pt-4 xl:grid-cols-2 xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">Tổng quan bài viết</h3>

            <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-6">
                <FormInput
                  id="title"
                  label="Tiêu đề bài viết"
                  placeholder="Nhập tiêu đề bài viết"
                  register={register}
                  control={control}
                  error={errors.title}
                  validation={{ required: "Tiêu đề là bắt buộc" }}
                />
              </div>
              
              <div className="col-span-3 1sm:col-span-3">
                <FormSelect
                  label="Danh mục"
                  id="category"
                  options={categories.map((category) => ({
                    _id: category._id,
                    name: category.name,
                  }))}
                  register={register}
                  validation={{ required: "Danh mục là bắt buộc" }}
                  errorMessage={errors.category?.message}
                />
              </div>
              <div className="col-span-3 1sm:col-span-3">
                <FormSelect
                  label="Sản phẩm"
                  id="product"
                  options={products.map((product) => ({
                    _id: product._id,
                    name: product.product_name,
                  }))}
                  register={register}
                  validation={{ required: "Danh mục là bắt buộc" }}
                  errorMessage={errors.product?.message}
                />
              </div>
              <div className="col-span-6 sm:col-span-6">
              <ImageUpload
                imgPreview={imgPreview}
                register={register}
                handleImageChange={handleImageChange}
                error={error || errors.thumbnail?.message}
                validation={{ required: "vui lòng chọn ảnh" }}
              />
              </div>



              <div className="col-span-6 1sm:col-span-3 mb-4">
                <CKEditorComponent
                  name="content"
                  value={watch("content")} 
                  onChange={(data) => setValue("content", data)}
                />

              </div>

            </div>


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
                  "Thêm bài viết"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default addPostProduct;
