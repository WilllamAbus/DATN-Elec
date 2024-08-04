import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import AlertCustomStyles from "../../../../ultils/alert.succes";
import { createCategoryThunk } from "../../../../redux/categories/categoriesThunk";
import { useNavigate } from "react-router-dom";
import "../../../../assets/css/admin.style.css";

interface IFormInput {
  name: string;
  path: string;
  imgCate: FileList;
}

const AddCate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

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
      setSuccessMessage("Category added successfully!");
      setAlertType("success");
      setTimeout(() => {
        navigate("/admin/listCategories");
      }, 2000); // 2 seconds delay before navigating
    } else if (status === "failed") {
      setError(message);
      setSuccessMessage(null);
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
      const resultAction = await dispatch(createCategoryThunk(formData) as any).unwrap();
      setError(null);
      setSuccessMessage(resultAction.message);
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
    <main className="w-full flex-grow p-6">
      <div className="flex flex-wrap">
        <div className="w-full mt-6 pl-0 lg:pl-2">
          <div className="leading-loose">
            <div className="mt-4">
              {successMessage && alertType && (
                <AlertCustomStyles message={successMessage} type={alertType} />
              )}
              {error && (
                <div className="mt-4">
                  <span className="text-red-600">{error}</span>
                </div>
              )}
            </div>
            <form
              id="addNewForm"
              className="p-10 bg-white rounded shadow-xl"
              encType="multipart/form-data"
            >
              <div>
                <label className="block text-sm text-gray-600" htmlFor="nameCate">
                  Name
                </label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Tên không được bỏ trống",
                  })}
                />
                {errors.name && <span className="text-red-600">{errors.name.message}</span>}
              </div>
              <div className="mt-2">
                <label className="block text-sm text-gray-600" htmlFor="path">
                  Path
                </label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                  id="path"
                  type="text"
                  {...register("path", {
                    required: "Đường truyền không được bỏ trống",
                  })}
                />
                {errors.path && <span className="text-red-600">{errors.path.message}</span>}
              </div>
              <div className="mt-2">
                <label className="block text-sm text-gray-600" htmlFor="imgCate">
                  Image
                </label>
                <input
                  className="w-full px-5 py-4 text-gray-700 bg-gray-200 rounded"
                  id="imgCate"
                  type="file"
                  {...register("imgCate", {
                    required: "Hình không bỏ trống",
                  })}
                  onChange={handleFileChange}
                />
                {errors.imgCate && <span className="text-red-600">{errors.imgCate.message}</span>}
              </div>
              {previewImage && (
                <div className="mt-4">
                  <img src={previewImage} alt="Preview" className="w-40 h-40 object-cover" />
                </div>
              )}
              <div className="mt-6 flex gap-2">
                <button
                  id="addNewButton"
                  type="button"
                  onClick={handleButtonClick}
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                >
                  Thêm mới
                </button>
                <button
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                  type="button"
                >
                  <a href="/admin/listCategories">Danh sách</a>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddCate;
