import React, { useEffect, useState } from "react";
import { getBestSellings } from "../../services/best-selling/best-selling.service";
import { BestSellingProduct } from "../../types/best-selling/best-selling";
import { Link } from "react-router-dom";
import currencyFormatter from "currency-formatter";
function formatCurrency(value: number) {
    return currencyFormatter.format(value, { code: "VND", symbol: "" });
}
const Arrivale: React.FC = () => {
    const [products, setProducts] = useState<BestSellingProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productListResponse = await getBestSellings();
                setProducts(productListResponse.data); // Lấy danh sách sản phẩm từ `data`
            } catch (error) {
                console.error(`Lỗi khi tải danh sách sản phẩm:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <p>Đang tải sản phẩm bán chạy...</p>;
    }
    return (
        <section className="p-1 mb-4 m-4 bg-white border border-gray-100 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/icon%2FOrange%20White%20Modern%20Gradient%20%20IOS%20Icon%20(6).svg?alt=media&token=8b339c30-9226-465e-a6ba-59a96504f454"
                        alt="Icon"
                        className="w-10 h-10"
                    />
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                        Sản phẩm bán chạy
                    </h1>
                </div>
            </div>
            <div className="mx-auto max-w-screen-2xl px-4 2xl:px-0 mt-4">
                <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-4 xl:grid-cols-4">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="h-56 w-full">
                                <Link to={`/product/${product.productDetails.slug}`} title={product.productDetails.product_name}>
                                    <img
                                        src={product.productDetails.image[0]}
                                        alt={product.productDetails.product_name}
                                        className="mx-auto h-full object-cover"
                                    />
                                </Link>
                            </div>
                            <div className="pt-6">
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    {product.discountPercent > 0 ? <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                                        Giảm giá {product.discountPercent}%
                                    </span> : <span className="me-2 rounded px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                                    </span>}
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            data-tooltip-target="tooltip-quick-look"
                                            className="flex items-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            {product.totalViewCount > 0 ? <span className="mr-2">({product.totalViewCount})</span> : ''}

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
                                            <span className="sr-only"> Quick look </span>
                                        </button>
                                        <div
                                            id="tooltip-quick-look"
                                            role="tooltip"
                                            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                                            data-popper-placement="top"
                                        >
                                            Quick look
                                            <div className="tooltip-arrow" data-popper-arrow="" />
                                        </div>
                                        <button
                                            type="button"
                                            data-tooltip-target="tooltip-add-to-favorites"
                                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            <span className="sr-only"> Add to Favorites </span>
                                            <svg
                                                className="h-5 w-5"
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
                                                    d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <a
                                    href="#"
                                    className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                                >
                                    {product.productDetails.product_name}
                                </a>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex items-center">
                                        <svg
                                            className="h-4 w-4 text-yellow-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                                        </svg>
                                        <svg
                                            className="h-4 w-4 text-yellow-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                                        </svg>
                                        <svg
                                            className="h-4 w-4 text-yellow-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                                        </svg>
                                        <svg
                                            className="h-4 w-4 text-yellow-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                                        </svg>
                                        <svg
                                            className="h-4 w-4 text-yellow-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">5.0</p>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {" "}
                                        <div className="flex gap-1 text-sm text-yellow-400">
                                            {Array.from({ length: product.productDetails.product_ratingAvg }, (_, i) => (
                                                <span key={i}>
                                                    <i className="fa-solid fa-star"></i>
                                                </span>
                                            ))}
                                        </div>
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
                                <div className="mt-4 flex items-center justify-between gap-6">
                                    <p className="text-xs font-extrabold leading-tight text-gray-900 dark:text-white">
                                        {product.discountPercent > 1 ? (
                                            <div className="flex w-full">
                                                {/* Giá đã giảm, hiển thị màu đỏ */}
                                                <p className="text-xs font-medium text-rose-700 flex-grow">
                                                    {formatCurrency(
                                                        product.totalOriginalPrice * (1 - product.discountPercent / 100)
                                                    )} đ
                                                </p>
                                                {/* Giá gốc, hiển thị gạch chéo và màu xám */}
                                                <p className="text-xs line-through text-gray-400 font-medium flex-shrink-0">
                                                    {formatCurrency(product.totalOriginalPrice)}đ
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-rose-700 font-medium">
                                                {/* Hiển thị giá nếu không có giảm giá */}
                                                {formatCurrency(product.variant_price)}đ
                                            </p>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default Arrivale;
