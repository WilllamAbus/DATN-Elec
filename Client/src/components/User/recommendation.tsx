import React, { useEffect, useState } from "react";
import { getRecommendations } from "../../services/recommendation/getRecommendation";
import { Link, useParams } from "react-router-dom";
import { Recommendation, ItemDetails } from "../../types/recommendation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const ListRecommendation: React.FC = () => {

    const [products, setProducts] = useState<Recommendation[]>([]); // Định nghĩa kiểu dữ liệu chính xác
    useParams<{ id: string }>();
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productList = await getRecommendations();
                console.log('Product list', productList);
                setProducts(productList); // Cập nhật giá trị products
            } catch (error) {
                console.error("Lỗi khi tải danh sách gợi ý:", error);
            }
        };

        fetchProducts();
    }, []);

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    return (
        <div className="p-1 mb-4 m-4 bg-white border border-gray-100 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/icon%2FOrange%20White%20Modern%20Gradient%20%20IOS%20Icon%20(2).svg?alt=media&token=2808ffec-93ee-4c1e-bf9a-ff30a48d7847"
                        alt="Icon"
                        className="w-6 h-6"
                    />
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                        Gợi ý dành cho bạn
                    </h1>
                </div>
            </div>

            <section className="md:py-12 ">
                {products.length > 0 ? (
                    <div className="px-1">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            slidesPerView={1}
                            spaceBetween={10}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 4,
                                },
                            }}
                        >
                            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                                <div className="mb-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                    {products.map((product, index) => (
                                        <SwiperSlide key={product.itemId || index}>
                                            <div
                                                key={product.itemId}
                                                className="rounded-md border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800 h-auto"
                                            >
                                                <div className="h-56 w-auto">
                                                    <Link to={`/product/${product.itemType === "productVariant" ? product.itemDetails?.product?.slug : "#"}`}>
                                                        <figure className="relative max-w-sm transition-all duration-300 cursor-pointer">
                                                            <img
                                                                className="rounded-lg object-contain"
                                                                src={
                                                                    product.itemType === "productVariant"
                                                                        ? product.itemDetails?.image?.[0]?.image?.[0] ?? "https://via.placeholder.com/150"
                                                                        : "https://via.placeholder.com/150"
                                                                }
                                                                alt={product.itemType === "productVariant"
                                                                    ? `Product ${(product.itemDetails as ItemDetails)?.variant_name || "Unknown"}`
                                                                    : "No Image Available"}
                                                            />
                                                        </figure>
                                                    </Link>
                                                </div>
                                                <div className="pt-6">
                                                    <div className="mb-4 flex items-center justify-between gap-4">
                                                        {product.discountPercent !== undefined && parseFloat(product.discountPercent.toString()) > 0 ? (
                                                            <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                                                                {product.itemType === "productVariant"
                                                                    ? `Giảm giá ${product.discountPercent}%`
                                                                    : `Giảm giá ${product.discountPercent}%`}
                                                            </span>
                                                        ) : (
                                                            <span className="me-2 rounded px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                                                                {/* Nếu không có giảm giá, không hiển thị gì */}
                                                            </span>
                                                        )}
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                type="button"
                                                                data-tooltip-target="tooltip-quick-look"
                                                                className="flex items-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                            >
                                                                {product.itemDetails.viewCount ? (
                                                                    <span className="mr-2">({product.itemDetails.viewCount})</span> // Hiển thị lượt xem nếu có
                                                                ) : null}

                                                                <svg
                                                                    className="h-5 w-5"
                                                                    aria-hidden="true"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={24}
                                                                    height={24}
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                                                                    />
                                                                    <path
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                                    />
                                                                </svg>
                                                                <span className="sr-only">Quick look</span>
                                                            </button>

                                                            <div
                                                                id="tooltip-quick-look"
                                                                role="tooltip"
                                                                className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                                                                data-popper-placement="top"
                                                            >
                                                                fcdsf Quick look
                                                                <div className="tooltip-arrow" data-popper-arrow="" />
                                                            </div> 
                                                        </div>
                                                    </div>
                                                    <a
                                                        href="#"
                                                        className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white"
                                                    >
                                                        {'variant_name' in product.itemDetails ? (
                                                            product.itemDetails.variant_name // Hiển thị tên phiên bản sản phẩm nếu tồn tại
                                                        ) : (
                                                            "Tên sản phẩm không xác định"
                                                        )}
                                                    </a>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <div className="flex items-center">
                                                            {product.itemType === "productVariant" && 'product' in product.itemDetails && (
                                                                // Xử lý sản phẩm dạng productVariant
                                                                Array.from({ length: 5 }, (_, i) => {
                                                                    const rating = product.itemDetails.product?.product_ratingAvg || 0; // Type Narrowing để xác định product là ItemDetails
                                                                    const isFullStar = i < Math.floor(rating); // Ngôi sao đầy
                                                                    const isHalfStar = i === Math.floor(rating) && rating % 1 !== 0; // Ngôi sao nửa

                                                                    return (
                                                                        <span key={i}>
                                                                            <svg
                                                                                className={`h-4 w-4 ${isFullStar ? "text-yellow-400" : isHalfStar ? "text-yellow-300" : "text-gray-300"
                                                                                    }`}
                                                                                aria-hidden="true"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {product.itemType === "productVariant" && 'product' in product.itemDetails
                                                                ? product.itemDetails.product?.product_ratingAvg || 0 // Type Narrowing ở đây
                                                                : 0}
                                                        </p>
                                                    </div>

                                                    <ul className="mt-2 flex items-center gap-4">
                                                        <li className="flex items-center gap-2">
                                                            <svg
                                                                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                                                                />
                                                            </svg>
                                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Giao hàng
                                                            </p>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <svg
                                                                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeWidth={2}
                                                                    d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                                                                />
                                                            </svg>
                                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Giá tốt
                                                            </p>
                                                        </li>
                                                    </ul>
                                                    <div className="mt-2 px-2 flex items-center gap-2">
                                                        <p className="text-xs leading-tight text-gray-900 dark:text-white">
                                                            {product.itemType === "productVariant" && 'product' in product.itemDetails ? (
                                                                // Kiểm tra nếu có thông tin giảm giá
                                                                product.itemDetails.product_discount?.discountPercent && product.itemDetails.product_discount.discountPercent > 0 ? (
                                                                    <div className="flex w-full">
                                                                        <p className="text-xs font-medium text-rose-700 flex-grow">
                                                                            {formatCurrency(
                                                                                product.itemDetails.variant_price *
                                                                                (1 - product.itemDetails.product_discount.discountPercent / 100)
                                                                            )}
                                                                            đ
                                                                        </p>
                                                                        <p className=" ms-4 text-xs font-medium line-through text-gray-400 flex-shrink-0">
                                                                            {formatCurrency(product.itemDetails.variant_original_price)} {/* Hiển thị giá gốc */}
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-xs font-medium text-rose-700">
                                                                        {formatCurrency(product.itemDetails.variant_price)}đ
                                                                    </p>
                                                                )
                                                            ) : null}
                                                        </p>
                                                    </div>
                                                    <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                                        <div className="mt-1 text-sm text-gray-800">

                                                        </div>
                                                    </ul>
                                                    <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                                        <div className="mt-1 text-sm text-gray-800">
                                                            <li>
                                                                <strong>Khối lượng:</strong>{" "}
                                                                <span>
                                                                    {product.itemType === "productVariant"
                                                                        ? `${(product.itemDetails as ItemDetails).product?.weight_g ?? 0} kg`
                                                                        : "0 kg"}
                                                                </span>
                                                            </li>
                                                        </div>
                                                    </ul>
                                                    
                                                </div>
                                            </div>
                                        </SwiperSlide>

                                    ))}
                                </div>
                            </div>
                        </Swiper>
                    </div>


                ) : (
                    <p></p>
                )}

            </section>
        </div>


    );
};

export default ListRecommendation;