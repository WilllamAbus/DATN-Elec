import { useForm } from "react-hook-form";
import { updateQuantityShelf, getListProducts, getOneInventoryItem } from "../../../../services/inventory/crudInventory.service";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "../../../../ultils/success";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
import { ProductVariant } from "../../../../types/ProductV2";
import { Inventory } from "../../../../types/Inventories";
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface IFormInput {
    product_variant: string;
    quantity: number;

}

const AddInventory: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IFormInput>();
    const [] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [] = useState<boolean>(true);
    const [, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [product_variant, setProducts] = useState<ProductVariant[]>([]);
    const [selectedProductInventory, setSelectedProductInventory] = useState<Inventory | null>(null);
    const [query, setQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<ProductVariant | null>(null);

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedData = e.clipboardData.getData('Text');
        if (!/^\d+$/.test(pastedData)) {
            e.preventDefault();
        }
    };

    const filteredProducts =
        query === ''
            ? product_variant
            : product_variant.filter((product) =>
                product.variant_name.toLowerCase().includes(query.toLowerCase())
            );
    const handleProductChange = async (product: ProductVariant | null) => {
        if (product) {
            try {
                // Replace `getOneInventoryItem` with your actual API call
                const inventoryItem = await getOneInventoryItem(product._id);
                setSelectedProductInventory(inventoryItem);
            } catch (error: unknown) {
                const typedError = error as Error;
                console.error(typedError.message);
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
        if (isSubmitting) return;
        setIsSubmitting(true);
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
            setError("Đã xảy ra lỗi khi thêm lô hàng. Vui lòng thử lại.");
        } finally {
            setTimeout(() => {
                setIsSubmitting(false);
            }, 3000);
        }
    };


    return (
        <form onSubmit={handleSubmit(submitFormAdd)} encType="multipart/form-data">
            <ToastContainer />
            <ReusableBreadcrumb items={breadcrumbItems.addInventory} />
            <div className="mb-4 ml-4 col-span-full xl:mb-2">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    Cập nhật số lượng hàng khả dụng
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
                                <Combobox value={selectedProduct} onChange={(product) => {
                                    setSelectedProduct(product);
                                    handleProductChange(product);
                                    setValue("product_variant", product?._id || "");
                                }}>
                                    <div className="relative">
                                        <ComboboxInput
                                            id="product_variant"
                                            className={clsx(
                                                'w-full bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5',
                                                'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                                            )}
                                            onChange={(event) => setQuery(event.target.value)}
                                            displayValue={(product: ProductVariant | null) => product?.variant_name || ''}
                                            placeholder="Nhập tên sản phẩm để tìm kiếm..."
                                        />
                                        <ComboboxButton className="absolute inset-y-0 right-0 px-2 flex items-center">
                                            <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-white" />
                                        </ComboboxButton>
                                    </div>
                                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-1/3 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map((product) => (
                                                <ComboboxOption
                                                    key={product._id}
                                                    value={product}
                                                    className={({ active }) =>
                                                        clsx(
                                                            'cursor-pointer select-none relative py-2 pl-3 pr-9',
                                                            active ? 'bg-primary-600 text-white' : 'text-gray-900'
                                                        )
                                                    }
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span
                                                                className={clsx(
                                                                    'block truncate',
                                                                    selected ? 'font-medium' : 'font-normal'
                                                                )}
                                                            >
                                                                {product.variant_name}
                                                            </span>
                                                            {selected ? (
                                                                <span
                                                                    className={clsx(
                                                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                        active ? 'text-white' : 'text-primary-600'
                                                                    )}
                                                                >
                                                                    <CheckIcon className="w-5 h-5" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </ComboboxOption>
                                            ))
                                        ) : (
                                            <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                                                Không có sản phẩm nào phù hợp
                                            </div>
                                        )}
                                    </ComboboxOptions>
                                </Combobox>
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
                                    Số lượng khả dụng
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
                                                    return `Số lượng khả dụng vượt quá số lượng tồn kho. Tối đa có thể thêm: ${availableStock}`;
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

                        <div className="col-span-6 sm:col-full mt-3">
                            <button
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddInventory;
