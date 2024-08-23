import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { getOneProduct, updateProduct } from "../../../../services/product/crudProduct.service";
import { getListCategories } from "../../../../services/product/crudProduct.service";
import { Category } from "../../../../types/Categories.d";
import { getFileFirebase } from "../../../../services/firebase/getFirebse.service";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyUpdate } from "../../../../ultils/success";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb";
interface IFormInput {
  name: string;
  price: number;
  createdAt: string;
  quantity: number;
  categoryId: string;
  weight: number;
  brand?: string;
  color?: string;
  description?: string;
  discount: string;
  image?: FileList;
}
const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultCategoryId, setDefaultCategoryId] = useState("");
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) {
      setError("Không có ID sản phẩm nào được cung cấp");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const product = await getOneProduct(id);
        setValue("name", product.name);
        setValue("price", product.price);
        setValue("quantity", product.quantity);
        setValue("createdAt", product.createdAt);
        setValue("weight", product.weight);
        setValue("brand", product.brand);
        setValue("color", product.color);
        setValue("description", product.description);
        setValue("categoryId", product.categoryId);
        setValue("image", product.image);
        setDefaultCategoryId(product.categoryId);
        if (product.image) {
          getFileFirebase(product.image).then((url) => {
            setImgPreview(url);
          });
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch product data");
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getListCategories();
        setCategories(data.cateReady || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
    fetchCategories();
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text");
    if (!/^\d+$/.test(pastedData)) {
      e.preventDefault();
    }
  };
  const onSubmit = async (data: IFormInput) => {
    if (id) {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", String(data.price));
        formData.append("quantity", String(data.quantity));
        formData.append("categoryId", data.categoryId);
        formData.append("createdAt", data.createdAt);
        formData.append("discount", data.discount);

        if (data.brand) formData.append("brand", data.brand);
        if (data.color) formData.append("color", data.color);
        if (data.description) formData.append("description", data.description);
        if (data.weight) formData.append("weight", String(data.weight));
        if (data.image && data.image.length > 0) formData.append("image", data.image[0]);
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        await updateProduct(id, formData);
        notifyUpdate();
        setTimeout(() => {
          navigate("/admin/listProducts");
        }, 2000);
      } catch (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
        setError("Lỗi khi cập nhật sản phẩm");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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
                <div className="mb-4 rounded-lg w-24 h-24 sm:mb-0 xl:mb-4 2xl:mb-0">
                  <img src={imgPreview} alt="Image Preview" />
                </div>
              )}
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Hình ảnh</h3>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  JPG, GIF or PNG. Max size of 800KB
                </div>

                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="image"
                    {...register("image")}
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  />
                  {errors.image && <span className="text-red-600">{errors.image.message}</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">Danh mục &amp; Giảm giá</h3>
            <div className="mb-4">
              <label
                htmlFor="settings-language"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Danh mục sản phẩm
              </label>
              <select
                id="categoryId"
                className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                {...register("brand")}
                value={defaultCategoryId}
                onChange={(e) => setValue("categoryId", e.target.value)}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className="text-red-600">{errors.categoryId.message?.toString()}</span>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="settings-timezone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Chương trình giảm giá
              </label>
              <select
                id="discount"
                className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                {...register("discount")}
              >
                <option value="0">0%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
              </select>
              {errors.discount && (
                <span className="text-red-600">{errors.discount.message?.toString()}</span>
              )}
            </div>
          </div>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Thương hiệu &amp; Màu sắc
            </h3>
            <div className="mb-4">
              <label
                htmlFor="settings-language"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Thương hiệu
              </label>
              <select
                id="brand"
                className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                {...register("brand")}
              >
                <option value="">Chọn Thương hiệu</option>
                <option value="ASUS">ASUS</option>
                <option value="ACER">ACER</option>
                <option value="LENOVO">LENOVO</option>
                <option value="DELL">DELL</option>
                <option value="CORSAIR">CORSAIR</option>
                <option value="GYGABYTE">GYGABYTE</option>
                <option value="MSI">MSI</option>
                <option value="SONY">SONY</option>
              </select>
              {errors.brand && (
                <span className="text-red-500 text-xs italic">
                  {errors.brand.message?.toString()}
                </span>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="settings-timezone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Màu sắc
              </label>
              <select
                id="color"
                className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                {...register("color")}
              >
                <option value="Màu đen">Màu đen</option>
                <option value="Màu xám">Màu xám</option>
                <option value="Màu trắng">Màu trắng</option>
                <option value="Màu đỏ">Màu đỏ</option>
                <option value="Màu xanh">Màu xanh</option>
                <option value="Màu hồng">Màu hồng</option>
              </select>
              {errors.color && (
                <span className="text-red-600">{errors.color.message?.toString()}</span>
              )}
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
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Bonnie"
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Tên không được để trống",
                    },
                    minLength: {
                      value: 5,
                      message: "5 ký tự",
                    },
                  })}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs italic">
                    {errors.name.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Giá gốc
                </label>
                <input
                  type="text"
                  id="price"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Green"
                  {...register("price", {
                    required: "Giá không được bỏ trống",
                    min: { value: 0.001, message: "Giá sản phẩm phải lớn hơn 0.000" },
                    validate: (value) => !isNaN(value) || "Giá sản phẩm phải là số",
                  })}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  onPaste={handlePaste}
                />
                {errors.price && (
                  <span className="text-red-500 text-xs italic">
                    {errors.price.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="quantity"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Số lượng
                </label>
                <input
                  type="text"
                  id="quantity"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  {...register("quantity", {
                    required: "Số lượng không được bỏ trống",
                    min: { value: 11, message: "Số lượng phải lớn hơn 11" },
                    validate: (value) => !isNaN(value) || "Số lượng sản phẩm phải là số",
                  })}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  onPaste={handlePaste}
                />
                {errors.quantity && (
                  <span className="text-red-500 text-xs italic">
                    {errors.quantity.message?.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="weight"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Khối lượng
                </label>
                <input
                  type="text"
                  id="weight"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  {...register("weight", {
                    required: "Khối lượng không được bỏ trống",
                    validate: (value) => !isNaN(value) || "Khối lượng sản phẩm phải là số",
                  })}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  onPaste={handlePaste}
                />
                {errors.weight && (
                  <span className="text-red-500 text-xs italic">
                    {errors.weight.message?.toString()}
                  </span>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="launch-year"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Thời điểm ra mắt
                </label>
                <input
                  type="number"
                  id="launch-year"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="2024"
                  min="2020"
                  max="2024"
                  step="1"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="birthday"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Ngày nhập
                </label>
                <input
                  type="date"
                  id="createdAt"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="12/12/2024"
                  {...register("createdAt", { required: "Ngày nhập không được bỏ trống" })}
                />
                {errors.createdAt && (
                  <span className="text-red-600">{errors.createdAt.message?.toString()}</span>
                )}
              </div>
            </div>
            <div className="w-full mb-4 border mt-6 border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
                <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 12 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
                        />
                      </svg>
                      <span className="sr-only">Attach file</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                      </svg>
                      <span className="sr-only">Embed map</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                      </svg>
                      <span className="sr-only">Upload image</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                        <path d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 0 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z" />
                      </svg>
                      <span className="sr-only">Format code</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z" />
                      </svg>
                      <span className="sr-only">Add emoji</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 21 18"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.5 3h9.563M9.5 9h9.563M9.5 15h9.563M1.5 13a2 2 0 1 1 3.321 1.5L1.5 17h5m-5-15 2-1v6m-2 0h4"
                        />
                      </svg>
                      <span className="sr-only">Add list</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                      </svg>
                      <span className="sr-only">Settings</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                        <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                      </svg>
                      <span className="sr-only">Timeline</span>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                        <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                      </svg>
                      <span className="sr-only">Download</span>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  data-tooltip-target="tooltip-fullscreen"
                  className="p-2 text-gray-500 rounded cursor-pointer sm:ms-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 19 19"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
                    />
                  </svg>
                  <span className="sr-only">Full screen</span>
                </button>
                <div
                  id="tooltip-fullscreen"
                  role="tooltip"
                  className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Show full screen
                  <div className="tooltip-arrow" data-popper-arrow="" />
                </div>
              </div>
              <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                <label htmlFor="editor" className="sr-only">
                  Publish post
                </label>
                <textarea
                  id="editor"
                  rows={8}
                  className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="Write an article..."
                  {...register("description")}
                />
                {errors.description && (
                  <span className="text-red-600">{errors.description.message?.toString()}</span>
                )}
              </div>
            </div>

            <div className="col-span-6 sm:col-full">
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProduct;
