import { useForm } from "react-hook-form";
import { updateQuantityShelf, getListProducts, getOneInventoryItem } from "../../../../services/inventory/crudInventory.service";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "../../../../ultils/success";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb";
import { ProductVariant } from "../../../../types/ProductV2";
import { Inventory } from "../../../../types/Inventories";
import SubmitButtonAdd from "../productAuction/btn/SubmitButtonAdd";

interface IFormInput {
    product_variant: string;
    quantity: number;

}

const AddInventory: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>();
    const [] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [] = useState<boolean>(true);
    const [, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [product_variant, setProducts] = useState<ProductVariant[]>([]);
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
                const inventoryItem = await getOneInventoryItem(productId);
                setSelectedProductInventory(inventoryItem);
            } catch (error: unknown) {
                const typedError = error as Error;
                setError(typedError.message);
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
        setIsLoading(true);
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
                product_variant: data.product_variant,
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
            setIsLoading(false);
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
                                    id="product_variant"
                                    className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    {...register("product_variant", { required: "Sản phẩm không được bỏ trống" })}
                                    onChange={handleProductChange}
                                >
                                    <option value="">Chọn sản phẩm</option>
                                    {product_variant.length > 0 ? (
                                        product_variant.map((product, index) => (
                                            <option key={product._id || index} value={product._id}>
                                                {product.variant_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Không có sản phẩm nào</option>
                                    )}
                                </select>
                                {errors.product_variant && (
                                    <span className="text-red-500 text-xs italic">
                                        {errors.product_variant.message?.toString()}
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
                                                console.log("Validating quantity:", value);
                                                console.log("selectedProductInventory:", selectedProductInventory);
                                            
                                                if (!selectedProductInventory) {
                                                    return "Vui lòng chọn sản phẩm trước.";
                                                }
                                            
                                                const currentShelfQuantity = selectedProductInventory.quantityShelf || 0;
                                                const maxShelfCapacity = 30;
                                                const availableStock = selectedProductInventory.quantityStock || 0;
                                            
                                                // Kiểm tra nếu số lượng kệ ban đầu đã lớn hơn hoặc bằng 30
                                                if (currentShelfQuantity >= maxShelfCapacity) {
                                                    return `Kệ đã đạt sức chứa tối đa (${maxShelfCapacity}). Không thể thêm sản phẩm.`;
                                                }
                                            
                                                // Kiểm tra nếu tổng số lượng trên kệ (hiện tại + mới) vượt quá 30
                                                if (currentShelfQuantity + value > maxShelfCapacity) {
                                                    return `Số lượng vượt quá sức chứa của kệ. Tối đa có thể thêm: ${maxShelfCapacity - currentShelfQuantity}`;
                                                }
                                            
                                                // Kiểm tra nếu số lượng nhập vào lớn hơn số lượng tồn kho khả dụng
                                                if (value > availableStock) {
                                                    return `Số lượng nhập lên kệ vượt quá số lượng tồn kho. Tối đa có thể thêm: ${availableStock}`;
                                                }
                                            
                                                // Kiểm tra nếu số lượng là số âm hoặc 0
                                                if (value <= 0) {
                                                    return "Số lượng phải là số dương";
                                                }
                                            
                                    
                                                return true;
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
              <SubmitButtonAdd isLoading={isLoading} />
            </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddInventory;
