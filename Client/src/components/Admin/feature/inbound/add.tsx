import { useForm } from "react-hook-form";
import { addInbound, getListProducts } from "../../../../services/inbound/crudInbound.service";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "../../../../ultils/success";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
import { ProductVariant } from "../../../../types/ProductV2";
import FormInput from "./forminput";
import { Combobox } from '@headlessui/react';
interface IFormInput {
    product_variant_id: string;
    inbound_description: string;
    inbound_quantity: number;
    inbound_price: number;
    totalPriceInbound: number;

}

const AddInbound: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch
    } = useForm<IFormInput>();
    const [] = useState<File | null>(null);
    const [] = useState<boolean>(true);
    const [, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductVariant[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getListProducts();
                console.log("Variant:", data.productReady)
                setProducts(data.productReady || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);


    const filteredProducts =
        query === ''
            ? products
            : products.filter((product) =>
                product.variant_name.toLowerCase().includes(query.toLowerCase())
            );

    // Tính toán giá tổng lô hàng
    const calculateTotalPrice = (quantity: number, price: number) => {
        return quantity * price;
    };

    // Theo dõi sự thay đổi của số lượng và giá tiền
    useEffect(() => {
        const subscription = watch((value) => {
            const totalPrice = calculateTotalPrice(value.inbound_quantity || 0, value.inbound_price || 0);

            // So sánh với giá trị hiện tại từ watch
            if ((value.totalPriceInbound || 0) !== totalPrice) {
                setValue("totalPriceInbound", totalPrice); // Cập nhật giá tổng lô hàng
            }
        });

        return () => subscription.unsubscribe(); // Dọn dẹp subscription khi component unmount
    }, [watch, setValue]);

    const submitFormAdd = async (data: IFormInput) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const payload = {
                product_variant_id: data.product_variant_id,
                inbound_description: data.inbound_description || '',
                inbound_quantity: data.inbound_quantity,
                inbound_price: data.inbound_price,
                totalPriceInbound: data.totalPriceInbound
            };

            await addInbound(payload);
            notify();
            setTimeout(() => {
                navigate("/admin/listInbound");
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
        <>
            <div>
                <ToastContainer />
                <ReusableBreadcrumb items={breadcrumbItems.addInbounds} />
                <div className="mb-4 ml-4 col-span-full xl:mb-2">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                        Thêm lô hàng
                    </h1>
                </div>
                <form className=" px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900" onSubmit={handleSubmit(submitFormAdd)} encType="multipart/form-data">
                    <div className="col-span-full xl:col-auto">
                        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                            <h3 className="mb-4 text-xl font-semibold dark:text-white">Tổng quan lô hàng</h3>

                            <div className="col-span-6 sm:col-span-6 relative">
                                <label
                                    htmlFor="product_variant_id"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Tên sản phẩm
                                </label>
                                <Combobox
                                    value={selectedProduct}
                                    onChange={(value) => {
                                        setSelectedProduct(value);
                                        setValue("product_variant_id", value?._id || ""); // Cập nhật giá trị vào form
                                    }}
                                >
                                    <div className="relative">
                                        {/* Input with dropdown toggle */}
                                        <div className="relative w-full">
                                            <Combobox.Input
                                                id="product_variant_id"
                                                className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Nhập tên sản phẩm để tìm kiếm..."
                                                onChange={(event) => setQuery(event.target.value)} // Update search query
                                                displayValue={(product: ProductVariant) =>
                                                    product?.variant_name || ""
                                                }
                                            />
                                            {/* Dropdown toggle icon */}
                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="w-5 h-5 text-gray-500 dark:text-white"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M8.25 15l3.75-3.75 3.75 3.75"
                                                    />
                                                </svg>
                                            </Combobox.Button>
                                        </div>
                                        {/* Dropdown list */}
                                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-1/2 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((product) => (
                                                    <Combobox.Option
                                                        key={product._id}
                                                        value={product}
                                                        className={({ active }) =>
                                                            `cursor-pointer select-none relative py-2 pl-3 pr-9 ${active ? "bg-primary-600 text-white" : "text-gray-900"
                                                            }`
                                                        }
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${selected ? "font-medium" : "font-normal"
                                                                        }`}
                                                                >
                                                                    {product.variant_name}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth={2}
                                                                            stroke="currentColor"
                                                                            className="w-5 h-5"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M5 13l4 4L19 7"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Combobox.Option>
                                                ))
                                            ) : (
                                                <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                                                    Không có sản phẩm nào phù hợp
                                                </div>
                                            )}
                                        </Combobox.Options>
                                    </div>
                                </Combobox>
                                {/* Error message */}
                                {errors.product_variant_id && (
                                    <span className="text-red-500 text-xs italic">
                                        {errors.product_variant_id.message?.toString()}
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-6 mt-3 sm:grid-cols-1">
                                <div className="sm:col-span-1">
                                    <label
                                        htmlFor="quantity"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Số lượng
                                    </label>
                                    <input
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        id="inbound_quantity"
                                        type="number"
                                        {...register("inbound_quantity",
                                            {
                                                required: "Số lượng không được bỏ trống",
                                                valueAsNumber: true,
                                                validate: value => value > 0 || "Số lượng phải lớn hơn 0",
                                                max: { value: 1000, message: "Số lượng không được vượt quá 1000" } 
                                            })}
                                        onInput={handleInput}
                                        onPaste={handlePaste}
                                    />
                                    {errors.inbound_quantity && (
                                        <span className="text-red-500 text-xs italic">
                                            {errors.inbound_quantity.message?.toString()}
                                        </span>
                                    )}
                                </div>
                                <div className="sm:col-span-1">
                                    <FormInput
                                        id="inbound_price"
                                        label="Giá gốc"
                                        format
                                        suffix=" đ"
                                        register={register}
                                        control={control}
                                        error={errors.inbound_price}
                                        validation={{
                                            required: "Giá sản phẩm không được bỏ trống",
                                            min: {
                                                value: 1000,
                                                message: "Giá sản phẩm không thể thấp hơn 1000",
                                            },
                                            max: {
                                                value: 2000000000,
                                                message: "Giá sản phẩm không thể vượt quá 2.000.000.000",
                                            },
                                            valueAsNumber: true,
                                        }}
                                        onValueChange={(values) => {
                                            const { floatValue } = values;
                                            setValue("inbound_price", floatValue ?? 0);
                                        }}
                                    />
                                </div>
                                <div className="sm:col-span-1">
                                    <FormInput
                                        id="totalPriceInbound"
                                        label="Tổng giá lô hàng"
                                        format
                                        suffix=" đ"
                                        register={register}
                                        control={control}
                                        error={errors.totalPriceInbound}
                                        validation={{
                                            required: "Giá sản phẩm không được bỏ trống",
                                            min: {
                                                value: 1000,
                                                message: "Giá sản phẩm không thể thấp hơn 1000",
                                            },
                                            max: {
                                                value: 2000000000,
                                                message: "Giá sản phẩm không thể vượt quá 2.000.000.000",
                                            },
                                            valueAsNumber: true,
                                        }}
                                        onValueChange={(values) => {
                                            const { floatValue } = values;
                                            setValue("totalPriceInbound", floatValue ?? 0);
                                        }}
                                    />
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
                                        id="inbound_description"
                                        rows={8}
                                        className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                                        placeholder="Nhập mô tả..."
                                        {...register("inbound_description")}
                                    />
                                    {errors.inbound_description && (
                                        <span className="text-red-600">{errors.inbound_description.message?.toString()}</span>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-6 sm:col-full">
                                <button
                                    type="submit"
                                    className="text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Đang xử lý..." : "Thêm lô hàng"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </>



    );
};

export default AddInbound;
