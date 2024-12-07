import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import AlertCustomStyles from "../../../../ultils/alert.succes";
import { createCategoryThunk } from "../../../../redux/categories/categoriesThunk";
import { Link, useNavigate } from "react-router-dom";
import "../../../../assets/css/admin.style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "../../../../ultils/success";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
interface IFormInput {
  name: string;
  path: string;
  imgCate: FileList;
}

const AddCate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();
  const status = useSelector((state: any) => state.categories.status);
  const message = useSelector((state: any) => state.categories.message);

  useEffect(() => {
    if (status === "succeeded") {
      reset();
      setPreviewImage(null);
      setError(null);
    } else if (status === "failed") {
      setError(message);
    }
  }, [status, reset, message, navigate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (!file) {
      setError("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("path", data.path);
    formData.append("imgCate", file);

    try {
      await dispatch(createCategoryThunk(formData) as any).unwrap();
      setError(null);
      notify();
      setTimeout(() => {
        navigate("/admin/listCategories");
      }, 2000); 
    } catch (error) {
      const errorMessage =
        (
          error as {
            message?: string;
          }
        )?.message || "Error creating category";
      setError(errorMessage);
      console.error("Error:", errorMessage);
    }
  };

  const handleButtonClick = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addCategories} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Cập nhật sản phẩm
        </h1>
      </div>
      <div className="grid grid-cols-[1fr_2fr] px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              {previewImage && (
                <div className="mt-4">
                  <img src={previewImage} alt="Preview" className="w-40 h-40 object-cover" />
                </div>
              )}
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Hình ảnh</h3>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  JPG, GIF or PNG. Max size of 800KB
                </div>

                <div className="flex items-center space-x-4">
                  <input
                    id="imgCate"
                    type="file"
                    {...register("imgCate", {
                      required: "Hình không bỏ trống",
                    })}
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  />
                  {errors.imgCate && <span className="text-red-600">{errors.imgCate.message}</span>}
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

                    minLength: { value: 3, message: "Độ đài phải có ít nhất 3 kí tự" },
                    // validate: {
                    //   noSpecialChars: (value) =>
                    //     /^[a-zA-Z\s]*$/.test(value) || "Tên  không được chứa ký tự đặc biệt",
                    // },
                  })}
                />
                {errors.name && <span className="text-red-600">{errors.name.message}</span>}
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
                    required: "Đường truyền không được bỏ trống",
                    minLength: { value: 3, message: "Độ đài phải có ít nhất 3 kí tự" },
                    validate: {},
                  })}
                />
                {errors.path && <span className="text-red-600">{errors.path.message}</span>}
              </div>
            </div>

            <div className="col-span-6 mt-4 sm:col-full flex space-x-4">
              <button
                id="addNewButton"
                type="button"
                onClick={handleButtonClick}
                className="text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Thêm mới
              </button>
              <Link
                to="/admin/listCategories"
                className="text-white bg-emerald-700 hover:bg-lime-600 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Danh sách
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddCate;
