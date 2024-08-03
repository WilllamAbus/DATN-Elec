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
interface IFormInput {
  name: string;
  price: number;
  createdAt: string;
  quantity: number;
  categoryId: string;
  weight?: number;
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
    <main className="w-full flex-grow p-6">
      <div className="flex flex-wrap">
        <div className="w-full mt-6 pl-0 lg:pl-2">
          <div className="leading-loose">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-10 bg-white rounded shadow-xl"
              encType="multipart/form-data"
            >
              <ToastContainer />
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
                        message: "tài khoản không được để trống",
                      },
                      minLength: {
                        value: 5,
                        message: "5 ký tự",
                      },
                    })}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs italic">{errors.name.message?.toString()}</span>
                  )}
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Giá gốc</label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="price"
                    type="number"
                    {...register("price", { required: "Price is required" })}
                  />
                  {errors.price && (
                    <span className="text-red-500 text-xs italic">{errors.price.message?.toString()}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Số lượng</label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="quantity"
                    type="number"
                    {...register("quantity", { required: "Số lượng không được bỏ trống" })}
                  />
                  {errors.quantity && (
                    <span className="text-red-500 text-xs italic">{errors.quantity.message?.toString()}</span>
                  )}
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Danh mục</label>
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="categoryId"
                    {...register("categoryId", { required: "Danh mục không được bỏ trống" })} // Thêm yêu cầu bắt buộc
                    defaultValue={defaultCategoryId} // Thiết lập giá trị mặc định
                    onChange={(e) => setValue("categoryId", e.target.value)} // Cập nhật giá trị khi thay đổi
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <span className="text-red-600">{errors.categoryId.message?.toString()}</span>}
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
                  {errors.createdAt && <span className="text-red-600">{errors.createdAt.message?.toString()}</span>}
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
                    type="number"
                    {...register("weight")}
                  />
                  {errors.weight && (
                    <span className="text-red-500 text-xs italic">{errors.weight.message?.toString()}</span>
                  )}
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
                    <span className="text-red-500 text-xs italic">{errors.brand.message?.toString()}</span>
                  )}
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
                  {errors.color && <span className="text-red-600">{errors.color.message?.toString()}</span>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Description
                </label>
                <textarea
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="description"
                  {...register("description")}
                />
                {errors.description && <span className="text-red-600">{errors.description.message?.toString()}</span>}
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
                  {errors.discount && <span className="text-red-600">{errors.discount.message?.toString()}</span>}
                </div>
              </div>
              <div className="mb-4">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Image</label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="image"
                  type="file"
                  {...register("image")}
                  onChange={handleImageChange}
                />
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
                  <a href="/admin/listProducts">Trở lại</a>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditProduct;
