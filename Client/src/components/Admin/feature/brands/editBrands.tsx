import { useForm } from "react-hook-form";
import { getListSuppliers, getListCategories, getOneBrand, updateBrand } from "../../../../services/brand/crudBrands.service";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../../../../assets/css/admin.style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFileFirebase } from "../../../../services/firebase/getFirebse.service";
import { notifyUpdate } from "../../../../ultils/success";

import { Category } from "../../../../types/Categories.d";
import { Supplier } from "../../../../types/Suppliers.d";



interface IFormInput {
    name: string;
    description: string;
    category_id: string;
    supplier_id: string;
    image?: FileList;

}

const EditBrand: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IFormInput>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [defaultCategory_id, setDefaultCategory_id] = useState("");
    const [defaultSupplier_id, setDefaultSupplier_id] = useState("");
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            setError("Không có ID thương hiệu nào được cung cấp");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const brand = await getOneBrand(id);
                setValue("name", brand.name);
                setValue("description", brand.description);
                setValue("category_id", brand.category_id);
                setValue("image", brand.image);
                setValue("supplier_id", brand.supplier_id);
                setDefaultCategory_id(brand.category_id);
                setDefaultSupplier_id(brand.supplier_id);

                if (brand.image) {
                    getFileFirebase(brand.image).then((url) => {
                        setImgPreview(url);
                    });
                }
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch brand data");
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
        const fetchSuppliers = async () => {
            try {
                const data = await getListSuppliers();
                setSuppliers(data.supplierReady || []);
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        };

        fetchData();
        fetchCategories();
        fetchSuppliers();
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
                formData.append("category_id", data.category_id);
                formData.append("supplier_id", data.supplier_id);
                if (data.description) formData.append("description", data.description);
                if (data.image && data.image.length > 0) formData.append("image", data.image[0]);
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                await updateBrand(id, formData);
                notifyUpdate();
                setTimeout(() => {
                    navigate("/admin/listBrands");
                }, 2000);
            } catch (error) {
                console.error("Lỗi cập nhật thương hiệu:", error);
                setError("Lỗi khi cập nhật thương hiệu");
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
                                        {...register("category_id", 
                                        { required: "Danh mục không được bỏ trống" })}
                                        defaultValue={defaultCategory_id} // Thiết lập giá trị mặc định
                                        onChange={(e) => setValue("category_id", e.target.value)}
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
                                        {...register("supplier_id",
                                        { required: "Nhà cung cấp không được bỏ trống" })}
                                        defaultValue={defaultSupplier_id} // Thiết lập giá trị mặc định
                                        onChange={(e) => setValue("supplier_id", e.target.value)}
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
                                    Cập nhật
                                </button>
                                <button className="p-5 py-1 text-white font-light tracking-wider bg-gray-900 rounded">
                                    <a href="/admin/listBrands">Danh sách</a>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EditBrand;
