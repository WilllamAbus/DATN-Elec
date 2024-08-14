import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../../../redux/store";
import {
  fetchCategoryByIdThunk,
  updateCategoryThunk,
} from "../../../../redux/categories/categoriesThunk";
import { getFileFirebase } from "../../../../services/firebase/getFirebse.service";
import "../../../../assets/css/admin.style.css";
import AlertCustomStyles from "../../../../ultils/alert.succes";

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
  
    const [, setImg] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
  
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<IFormInput>();
  
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
        setValue("imgCate", files);
        setImg(file);
  
        const reader = new FileReader();
        reader.onloadend = () => {
          setImgPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
      if (id) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("path", data.path);
        if (data.imgCate?.[0]) {
          formData.append("imgCate", data.imgCate[0]);
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
    <main className="w-full flex-grow p-6">
      <div className="flex flex-wrap">
        <div className="w-full mt-6 pl-0 lg:pl-2">
          {alertMessage && (
            <AlertCustomStyles message={alertMessage} type={alertType} />
          )}
          <div className="leading-loose">
            <form
              id="editForm"
              className="p-10 bg-white rounded shadow-xl"
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="">
                <label className="block text-sm text-gray-600" htmlFor="name">
                  Name
                </label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                  id="name"
                  {...register("name", {
                    required: "Tên không được bỏ trống",
                    minLength: { value: 3, message: "Độ đài phải có ít nhất 3 kí tự" },
                    validate: {
                      noSpecialChars: (value) =>
                        /^[a-zA-Z\s]*$/.test(value) ||
                        "Tên không được chứa ký tự đặc biệt",
                    //   noNumbers: (value) =>
                    //     !/\d/.test(value) || "Tên không được chứa số",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="">
                <label className="block text-sm text-gray-600" htmlFor="path">
                  Path
                </label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                  id="path"
                  {...register("path", {
                    required: "Path không được bỏ trống",
                    // validate: {
                    //     noSpecialChars: (value) =>
                    //       /^[a-zA-Z\s]*$/.test(value) ||
                    //       "Tên không được chứa ký tự đặc biệt",
                    //   //   noNumbers: (value) =>
                    //   //     !/\d/.test(value) || "Tên không được chứa số",
                    //   },
                  })}
                />
                {errors.path && (
                  <p className="text-red-500 text-xs italic">
                    {errors.path.message}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <label className="block text-sm text-gray-600" htmlFor="imgCate">
                  Hình
                </label>
                <input
                  className="w-full px-5 py-4 text-gray-700 bg-gray-200 rounded"
                  type="file"
                  id="imgCate"
                  {...register("imgCate")}
                  onChange={handleImageChange}
                />
                {imgPreview && (
                  <div className="image-preview">
                    <img src={imgPreview} alt="Image Preview" />
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  id="editButton"
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                  type="submit"
                >
                  Cập nhật
                </button>
                <button
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                  type="button"
                  onClick={() => navigate("/admin/listCategories")}
                >
                  Danh sách
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditCate;
