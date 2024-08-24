import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { getOneSupplier, updateSupplier } from "../../../../services/supplier/crudSuppliers.service";
import { getFileFirebase } from "../../../../services/firebase/getFirebse.service";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyUpdate } from "../../../../ultils/success";
interface IFormInput {
  name: string;
  address: string;
  phone: number;
  description: string;
  image?: FileList;
}
const EditSupplier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) {
      setError("Không có ID nhà cung cấp nào được cung cấp");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const supplier = await getOneSupplier(id);
        setValue("name", supplier.name);
        setValue("address", supplier.address);
        setValue("phone", supplier.phone);
        setValue("description", supplier.description);
        setValue("image", supplier.image);
        if (supplier.image) {
          getFileFirebase(supplier.image).then((url) => {
            setImgPreview(url);
          });
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch supplier data");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // in MB
      const fileType = file.type;

      if (fileSize > 2) {
        setError("Kích thước tệp quá lớn. Tối đa 2MB.");
      } else if (!fileType.match(/image\/*/)) {
        setError("Định dạng tệp không hợp lệ. Chỉ chấp nhận hình ảnh.");
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Đảm bảo rằng kết quả đọc từ FileReader là chuỗi
          if (typeof reader.result === "string") {
            setImgPreview(reader.result);
          }
          setError(null);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('Text');
    if (!/^\d+$/.test(pastedData)) {
      e.preventDefault();
    }
  };
  const onSubmit = async (data: IFormInput) => {
    if (id) {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("address", data.address || "");
        formData.append("phone", String(data.phone));
        if (data.description) formData.append("description", data.description);
        if (data.image && data.image.length > 0) formData.append("image", data.image[0]);
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        await updateSupplier(id, formData);
        notifyUpdate();
        setTimeout(() => {
          navigate("/admin/listSuppliers");
        }, 2000);
      } catch (error) {
        console.error("Lỗi cập nhật nhà cung cấp:", error);
        setError("Lỗi khi cập nhật nhà cung cấp");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="w-full flex-grow p-6">
      <div className="flex flex-wrap">
        <div className="w-full mt-6 pl-0 lg:pl-2">
          <div className="leading-loose">
            <ToastContainer />
            <form
              id="addNewForm"
              className="p-10 bg-white rounded shadow-xl"
              encType="multipart/form-data"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Tên nhà cung cấp
                  </label>
                  <input
                    id="name"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    {...register("name", {
                      required: {
                        value: true,
                        message: "Tên nhà cung cấp không được để trống",
                      },
                      minLength: {
                        value: 5,
                        message: "Tên lớn hơn 3 ký tự",
                      },
                    })}
                  />
                  {errors.name && <span className="text-red-600">{errors.name.message}</span>}
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Mô tả
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="description"
                    type="text"
                    {...register("description",
                      {
                        required: "Mô tả không được bỏ trống",
                        min: { value: 3, message: "Mô tả lớn hơn 3 kí tự" },
                      })}
                  />
                  {errors.description && <span className="text-red-600">{errors.description.message}</span>}
                </div>

              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Địa chỉ
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="address"
                    type=""
                    {...register("address",
                      {
                        required: "Địa chỉ không được bỏ trống",
                        min: { value: 3, message: "Địa chỉ lớn hơn 3 kí tự" },
                      })}
                  />
                  {errors.address && <span className="text-red-600">{errors.address.message}</span>}
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Hình ảnh
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="image"
                    type="file"
                    {...register("image")}
                    onChange={handleImageChange}

                  />
                  {errors.image && <span className="text-red-600">{errors.image.message}</span>}
                  {imgPreview && (
                    <div className="image-preview">
                      <img src={imgPreview} alt="Image Preview" />
                    </div>
                  )}

                </div>

              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Số điện thoại
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="phone"
                    type="text"
                    {...register("phone",
                      {
                        required: "Số điện thoại không được bỏ trống",
                        validate: value => !isNaN(value) || "Số điện thoại phải là số"
                      })}
                    onInput={handleInput}
                    onPaste={handlePaste}
                  />
                  {errors.phone && <span className="text-red-600">{errors.phone.message}</span>}
                </div>

              </div>
              <div className="mt-6 flex gap-2">
                <button
                  id="addNewButton"
                  type="submit"
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                >
                  Cập nhật
                </button>
                <button className="p-5 py-1 text-white font-light tracking-wider bg-gray-900 rounded">
                  <a href="/admin/listSuppliers">Danh sách</a>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditSupplier;
