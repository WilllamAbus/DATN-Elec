import { useForm } from "react-hook-form";
import { addBrands, getListSuppliers, getListCategories } from "../../../../services/brand/crudBrands.service";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../../../../assets/css/admin.style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "../../../../ultils/success";
import { Category } from "../../../../types/Categories.d";
import { Supplier } from "../../../../types/Suppliers.d";


interface IFormInput {
    name: string;
    description: string;
    category_id: string;
    supplier_id: string;
    image?: FileList;

}

const AddBrand: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>();
    const [] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
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
        const fetchSuppliers = async () => {
            try {
                const data = await getListSuppliers();
                setSuppliers(data.supplierReady || []);
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        };
        fetchSuppliers();
        fetchCategories();
    }, []);

    const submitFormAdd = async (data: IFormInput) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name || "");
            formData.append("description", data.description || "");
            formData.append("category_id", data.category_id || "");
            formData.append("supplier_id", data.supplier_id || "");

            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]);
            } else {
                console.warn("No image provided");
            }

            await addBrands(formData);
            notify();
            setTimeout(() => {
                navigate("/admin/listBrands");
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            setError("Đã xảy ra lỗi khi thêm nhà thương hiệu. Vui lòng thử lại.");
        }
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
                                        Tên thương hiệu
                                    </label>
                                    <input
                                        id="name"
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        type="text"
                                        {...register("name", {
                                            required: {
                                                value: true,
                                                message: "Tên thương hiệu không được để trống",
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
                                        Danh mục
                                    </label>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="category_id"
                                        {...register("category_id", { required: "Danh mục không được bỏ trống" })}
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <span className="text-red-600">{errors.category_id.message}</span>}
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
                                        Nhà cung cấp
                                    </label>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="supplier_id"
                                        {...register("supplier_id", { required: "Nhà cung cấp không được bỏ trống" })}
                                    >
                                        <option value="">Chọn nhà cung cấp</option>
                                        {suppliers.map((supplier) => (
                                            <option key={supplier._id} value={supplier._id}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && <span className="text-red-600">{errors.supplier_id.message}</span>}
                                </div>

                            </div>
                            <div className="mt-6 flex gap-2">
                                <button
                                    id="addNewButton"
                                    type="submit"
                                    className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                                >
                                    Thêm mới
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

export default AddBrand;
