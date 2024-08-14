import { useForm } from "react-hook-form";
import { addProduct } from "../../../../services/product/crudProduct.service";
import { getListCategories } from "../../../../services/product/crudProduct.service";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../../../../assets/css/admin.style.css";
import { Category } from "../../../../types/Categories.d";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "../../../../ultils/success";
interface IFormInput {
  name: string;
  price: number;
  createdAt: string;
  quantity: number;
  categoryid: string;
  weight: number;
  brand?: string;
  color?: string;
  description?: string;
  discount: string;
  image?: FileList;
}

const AddProduct: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const navigate = useNavigate();

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
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getListCategories();
        setCategories(data.cateReady || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
      e.preventDefault();
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
  const submitFormAdd = async (data: IFormInput) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name || "");
      formData.append("price", String(data.price));
      formData.append("quantity", String(data.quantity));
      formData.append("categoryid", data.categoryid || "");
      formData.append("createdAt", data.createdAt || "");
      formData.append("discount", String(data.discount));
      formData.append("brand", data.brand || "");
      formData.append("color", data.color || "");
      formData.append("description", data.description || "");
      formData.append("weight", String(data.weight));

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      } else {
        console.warn("No image provided");
      }

      await addProduct(formData);
      notify();
      setTimeout(() => {
        navigate("/admin/listProducts");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log("Data to send:", data);
  };

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
              onSubmit={handleSubmit(submitFormAdd)}
            >
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Tên sản phẩm
                  </label>
                  <input
                    id="name"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    {...register("name", {
                      required: {
                        value: true,
                        message: "Tên sản phẩm không được để trống",
                      },
                      minLength: {
                        value: 5,
                        message: "5 ký tự",
                      },
                    })}
                  />
                  {errors.name && <span className="text-red-600">{errors.name.message}</span>}
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Giá gốc</label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="price"
                    type="text"
                    {...register("price", { 
                      required: "Giá không được bỏ trống",
                      min: { value: 0.001, message: "Giá sản phẩm phải lớn hơn 0.000" },
                      validate: value => !isNaN(value) || "Giá sản phẩm phải là số"
                    })}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    onPaste={handlePaste}
                  />
                  {errors.price && <span className="text-red-600">{errors.price.message}</span>}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Số lượng</label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="quantity"
                    type="text"
                    {...register("quantity", 
                      { required: "Số lượng không được bỏ trống" ,
                         min: { value: 11, message: "Số lượng phải lớn hơn 11" },
                      validate: value => !isNaN(value) || "Số lượng sản phẩm phải là số"
                    
                      })}
                      onKeyDown={handleKeyDown}
                      onInput={handleInput}
                      onPaste={handlePaste}
                  />
                  {errors.quantity && <span className="text-red-600">{errors.quantity.message}</span>}
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Danh mục</label>
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="categoryid"
                    {...register("categoryid", { required: "ID danh mục không được bỏ trống" })}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryid && <span className="text-red-600">{errors.categoryid.message}</span>}
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Ngày nhập
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="createdAt"
                    type="date"
                    {...register("createdAt", { required: "Ngày nhập không được bỏ trống" })}
                  />
                  {errors.createdAt && <span className="text-red-600">{errors.createdAt.message}</span>}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Khối lượng
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="weight"
                    type="text"
                    {...register("weight", 
                      { required: "Khối lượng không được bỏ trống" ,
                          validate: value => !isNaN(value) || "Khối lượng sản phẩm phải là số"
                  })}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  onPaste={handlePaste}
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Thương hiệu
                  </label>
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="brand"
                    {...register("brand")}
                  >
                    <option value="">Chọn Thương hiệu</option>
                    <option value="HP">HP</option>
                    <option value="ASUS">ASUS</option>
                    <option value="ACER">ACER</option>
                    <option value="LENOVO">LENOVO</option>
                    <option value="DELL">DELL</option>
                    <option value="CORSAIR">CORSAIR</option>
                    <option value="GYGABYTE">GYGABYTE</option>
                    <option value="MSI">MSI</option>
                    <option value="SONY">SONY</option>
                  </select>
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Màu sắc</label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="color"
                    type="text"
                    placeholder="Màu sắc"
                    {...register("color")}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Mô tả</label>
                  <textarea
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="description"
                    placeholder="Mô tả"
                    {...register("description")}
                  ></textarea>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Chương trình giảm giá
                  </label>
                  <select
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="discount"
                    {...register("discount")}
                    required
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                  </select>
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-sm text-gray-600" htmlFor="imgCate">
                  Image
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="image"
                  type="file"
                  {...register("image")}
                  onChange={handleImageChange}
                />
                {errors.image && <span className="text-red-600">{errors.image.message}</span>}
              </div>
              {imgPreview && (
                <div className="image-preview">
                  <img src={imgPreview} alt="Image Preview" />
                </div>
              )}
              <div className="mt-6 flex gap-2">
                <button
                  id="addNewButton"
                  type="submit"
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                >
                  Thêm mới
                </button>
                <button className="p-5 py-1 text-white font-light tracking-wider bg-gray-900 rounded">
                  <a href="/admin/listProducts">Danh sách</a>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddProduct;
