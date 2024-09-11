import { useForm } from "react-hook-form";
import { updateQuantityShelf, getListProducts } from "../../../../services/inventory/crudInventory.service";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "../../../../ultils/success";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb";
import { ProductV2 } from "../../../../types/ProductV2";
import { Inventory } from "../../../../types/Inventories";
interface IFormInput {
    product_id: string;
    quantity: number;

}

const AddInventory: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>();
    const [] = useState<File | null>(null);
    const [] = useState<boolean>(true);
    const [, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductV2[]>([]);
    const [selectedProductInventory, setSelectedProductInventory] = useState<Inventory | null>(null);

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedData = e.clipboardData.getData('Text');
        if (!/^\d+$/.test(pastedData)) {
            e.preventDefault();
        }
    };
    const handleProductChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const productId = e.target.value;
    
        if (productId) {
            try {
                const response = await fetch(`http://localhost:4000/api/inventory/get-one/${productId}`);
                if (!response.ok) throw new Error('Failed to fetch inventory data');
                
                const responseData = await response.json();
                // console.log("Fetched Inventory Data:", responseData); // Kiểm tra dữ liệu
                if (responseData.success && responseData.data) {
                    setSelectedProductInventory(responseData.data);
                } else {
                    setError("Dữ liệu không hợp lệ.");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin inventory:", error);
                setError("Không thể lấy dữ liệu kho hàng.");
            }
        } else {
            setSelectedProductInventory(null);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getListProducts();
                console.log("Fetched products:", data);
                setProducts(data.productsInInventory || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);
    const submitFormAdd = async (data: IFormInput) => {
        try {
            if (!selectedProductInventory) {
                setError("Vui lòng chọn một sản phẩm hợp lệ.");
                return;
            }

            if (data.quantity > selectedProductInventory.quantityStock) {
                setError("Số lượng nhập lên kệ vượt quá số lượng tồn kho.");
                return;
            }
            const payload = {
                product_id: data.product_id,
                quantity: data.quantity,
            };
            await updateQuantityShelf(payload);
            notify();
            setTimeout(() => {
                navigate("/admin/listInventory");
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            setError("Đã xảy ra lỗi khi cập nhật kệ. Vui lòng thử lại.");
        }
    };
 

    return (
        <form onSubmit={handleSubmit(submitFormAdd)} encType="multipart/form-data">
            <ToastContainer />
            <ReusableBreadcrumb items={breadcrumbItems.addInventory} />
            <div className="mb-4 ml-4 col-span-full xl:mb-2">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    Cập nhật kho hàng lên kệ
                </h1>
            </div>
            <div className=" px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900">
                <div className="col-span-full xl:col-auto">
                    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                        <h3 className="mb-4 text-xl font-semibold dark:text-white">Tổng quan cập nhật</h3>

                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="first-name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Tên sản phẩm
                                </label>
                                <select
                                    id="product_id"
                                    className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    {...register("product_id", { required: "Sản phẩm không được bỏ trống" })}
                                    onChange={handleProductChange}
                                >
                                    <option value="">Chọn sản phẩm</option>
                                    {products.length > 0 ? (
                                        products.map((product, index) => (
                                            <option key={product._id || index} value={product._id}>
                                                {product.product_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Không có sản phẩm nào</option>
                                    )}
                                </select>
                                {errors.product_id && (
                                    <span className="text-red-500 text-xs italic">
                                        {errors.product_id.message?.toString()}
                                    </span>
                                )}
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="quantity"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Số lượng kệ
                                </label>
                                <input
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    id="quantity"
                                    type="text"
                                    {...register("quantity",
                                        {
                                            required: "Số lượng không được bỏ trống",
                                            valueAsNumber: true,
                                            validate: value => {
                                                if (selectedProductInventory) {
                                                    // Check if quantityShelf is 30
                                                    if (selectedProductInventory.quantityShelf === 30) {
                                                        return "Số lượng kệ đã đầy.";
                                                    }
                                    
                                                    // Check if the quantity exceeds quantityStock
                                                    if (value > selectedProductInventory.quantityStock) {
                                                        return "Số lượng nhập lên kệ nhiều hơn số lượng tồn kho.";
                                                    }
                                                    
                                                    return true;
                                                }
                                                return "Vui lòng chọn sản phẩm.";
                                            }
                                        })}
                                    onInput={handleInput}
                                    onPaste={handlePaste}
                                    
                                />
                                {errors.quantity && (
                                    <span className="text-red-500 text-xs italic">
                                        {errors.quantity.message?.toString()}
                                    </span>
                                )}
                            </div>

                        </div>

                        <div className="col-span-6 sm:col-full">
                            <button
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Cập nhật kệ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddInventory;
