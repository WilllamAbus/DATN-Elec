import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { fetchRelatedProducts } from "../../../../../../services/detailProduct/relatedProducts";
import { ProductRelated } from "../../../../../../services/product_v2/client/types/homeAllProduct"; // Updated import

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Heart, Star } from "../svg";
import { ToastContainer, toast } from "react-toastify";
import currencyFormatter from "currency-formatter";

// Function to format currency values
function formatCurrency(value: number) {
    return currencyFormatter.format(value, { code: "VND", symbol: "" });
}

const RelatedProduct: React.FC = () => {
    const [relatedVariants, setRelatedVariants] = useState<ProductRelated[]>([]); // Using Variant instead of ProductRelated
    const { slug } = useParams<{ slug: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) {
                console.log("Product slug is not available.");
                return;
            }
            try {
                setLoading(true);
                const relatedData = await fetchRelatedProducts(slug);
                if (relatedData && Array.isArray(relatedData.relatedVariants)) {
                    setRelatedVariants(relatedData.relatedVariants);
                } else {
                    setError("Không thể lấy sản phẩm liên quan.");
                    toast.error("Không thể lấy sản phẩm liên quan.");
                }
            } catch (error) {
                setError("Không thể tải dữ liệu.");
                toast.error("Không thể tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    return (
        <div className="container pb-16">
            <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6 mt-4">
                Sản phẩm liên quan
            </h2>
            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
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
                    {relatedVariants.map((variant, index) => (
                        <SwiperSlide key={variant._id || index}>
                            <div className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                                <div className="backdrop-blur-sm bg-white/30">
                                    <Link to={`/detailProd/${variant._id}`}>
                                        <figure className="relative w-full h-0 pb-[75%] overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0">
                                            {variant.image && variant.image.length > 0 ? (
                                                <img
                                                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                                    src={variant.image[0].image[0]} // Show the first image
                                                    alt={`variant ${index + 1}`}
                                                />
                                            ) : (
                                                <img
                                                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                                    src="placeholder-image-url" // Placeholder if no image is available
                                                    alt="placeholder"
                                                />
                                            )}
                                        </figure>
                                    </Link>
                                </div>

                                <div className="pt-1 mb-10">
                                    <div className="mb-4 px-2 flex items-center justify-between gap-4">
                                         {variant.product_discount.discountPercent > 0 && (
                                            <span className="rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                                                Giảm giá {variant.product_discount.discountPercent}%
                                            </span>
                                        )} 
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                            >
                                                <Heart fill="red" size="1em" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white">
                                        <div className="mt-1 px-2 pb-1">
                                            <h5 className="text-sm tracking-tight text-slate-900 font-medium">
                                                {variant.variant_name} 
                                            </h5>
                                        </div>
                                    </div>

                                     <div className="px-2 flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {variant.product_ratingAvg?.toFixed(1) || "N/A"}
                                        </p>
                                        <Star />
                                        {/* <div className="text-xs text-gray-500 items-center">
                                            {variant.product_quantity > 0
                                                ? `(Còn ${variant.product_quantity} sản phẩm)`
                                                : "Hết hàng"}
                                        </div> */}
                                    </div>
                                    <div className="mt-2 px-2 flex items-center gap-2">
                                        <p className="text-xs font-medium text-rose-700">
                                                {formatCurrency(variant.variant_price)} đ
                                            </p>
                                    </div> 
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
            <ToastContainer />
        </div>
    );
};

export default RelatedProduct;
