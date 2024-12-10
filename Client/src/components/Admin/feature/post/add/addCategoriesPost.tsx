import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { notify, notifyError } from "../toast/msgtoast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addCategoryPostThunk } from "../../../../../redux/post/thunk"
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../../ultils/breadcrumb/admin";
import { Category } from "../../../../../services/post/admin/types/CategoryPost";
import { Card, CardBody } from "@nextui-org/react";
import { useImageUpload } from "../../../../../hooks/useImageUpload";
import ImageUpload from "../imageUpload/imageUpload";
const AddCategoriesPost: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Category>({});
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { imgPreview, handleImageChange } = useImageUpload();


  const submitFormAdd: SubmitHandler<Category> = async (data) => {
    setIsLoading(true);
    try {
      const actionResult = await dispatch(
        addCategoryPostThunk(data)
      ).unwrap();
      notify(actionResult.msg);
      setTimeout(() => {
        navigate("/admin/list-categories-post");
      }, 2000);
    } catch (error) {
      notifyError((error as { msg: string }).msg);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(submitFormAdd)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addCategories} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Thêm danh mục bài viết
        </h1>
      </div>
      <Card className='m-4' >
        <CardBody>
          <div className="grid grid-cols-[1fr_1fr] px-4 pt-4 xl:grid-cols-[1fr_1fr] xl:gap-4 dark:bg-gray-900">
            <div className="col-span-full xl:col-auto">
              <ImageUpload
                imgPreview={imgPreview}
                register={register}
                handleImageChange={handleImageChange}
                error={errors.image?.message}
              />


            </div>
            <div className="col-span-full xl:col-auto">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold dark:text-white">Tổng quan sản phẩm</h3>

                <div className="grid grid-cols-1 gap-6">
                  <div className="col-span-3 sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tên danh mục bài viết
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md  focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Bonnie"
                      {...register("name", {
                        required: {
                          value: true,
                          message: "Tên không được để trống",
                        },
                      })}
                    />
                    {errors.name && (
                      <div className="flex items-center mt-2 text-red-600">
                        <span className="text-sm font-medium">{errors.name.message}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
            <div className="col-span-full mt-4 sm:col-full flex space-x-4 justify-end ">
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
                  "Thêm danh mục bài viết"
                )}
              </button>
              <Link
                to="/admin/listproduct"
                className="text-white bg-emerald-700 hover:bg-lime-600 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Danh sách
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

    </form>
  );
};

export default AddCategoriesPost;
