import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RootState, AppDispatch } from "../../../../redux/store";
import {
  fetchCategoryByIdThunk,
  updateCategoryThunk,
} from "../../../../redux/categories/categoriesThunk";
import { getFileFirebase } from "../../../../services/firebase/getFirebse.service";
import "../../../../assets/css/admin.style.css";
import AlertCustomStyles from "../../../../ultils/alert.succes";
import { ToastContainer } from "react-toastify";
import {
  breadcrumbItems,
  ReusableBreadcrumb,
} from "../../../../ultils/breadcrumb/admin";
interface IFormInput {
  name: string;
  path: string;
  imgCate: FileList;
}

const EditCate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const category = useSelector(
    (state: RootState) => state.categories.selectedCategory
  );

  const [img, setImg] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryByIdThunk(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("path", category.path);
      if (category.imgURL) {
        getFileFirebase(category.imgURL).then((url) => {
          setImgPreview(url);
        });
      }
    }
  }, [category, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImgPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setImg(file);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (id) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("path", data.path);
      if (img) {
        formData.append("imgCate", img);
      }
      try {
        await dispatch(updateCategoryThunk({ id, formData }));
        setAlertMessage("Cập nhật thành công!");
        setAlertType("success");
        setTimeout(() => {
          navigate("/admin/listCategories");
        }, 2000);
      } catch (error) {
        setAlertMessage("Failed to update category.");
        setAlertType("error");
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      {alertMessage && (
        <AlertCustomStyles message={alertMessage} type={alertType} />
      )}
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.editProducts} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Cập nhật sản phẩm
        </h1>
      </div>
      <div className="grid grid-cols-[1fr_2fr] px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              {imgPreview && (
                <div className="image-preview">
                  <img src={imgPreview} alt="Image Preview" />
                </div>
              )}
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                  Hình ảnh
                </h3>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  JPG, GIF or PNG. Max size of 800KB
                </div>

                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="imgCate"
                    {...register("imgCate")}
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Tổng quan sản phẩm
            </h3>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tên danh mục
                </label>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Bonnie"
                  id="name"
                  {...register("name", {
                    required: "Tên không được bỏ trống",
                    minLength: {
                      value: 3,
                      message: "Độ đài phải có ít nhất 3 kí tự",
                    },
                    // validate: {
                    //   noSpecialChars: (value) =>
                    //     /^[a-zA-Z\s]*$/.test(value) ||
                    //     "Tên không được chứa ký tự đặc biệt",
                    // },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Path
                </label>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Green"
                  id="path"
                  {...register("path", {
                    required: "Path không được bỏ trống",
                  })}
                />
                {errors.path && (
                  <p className="text-red-500 text-xs italic">
                    {errors.path.message}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-6 mt-4 sm:col-full flex space-x-4">
              <button
                type="submit"
                className="text-white bg-blue-600
                 hover:bg-primary-800 focus:ring-4
                  focus:ring-primary-300 font-medium 
                  rounded-lg text-sm px-5 py-2.5 
                  text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Cập nhật
              </button>
              <Link
                to="/admin/listCategories"
                className="text-white bg-emerald-700 hover:bg-lime-600 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Trở lại
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditCate;
