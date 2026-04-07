import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { fetchRelatedProducts } from "../../../../../../services/detailProduct/relatedProducts";
import { ProductRelated, RelatedProductsResponse } from "../../../../../../services/product_v2/client/types/homeAllProduct"; // Updated import

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import {  Star } from "../svg";
// import { ToastContainer, toast } from "react-toastify";
import currencyFormatter from "currency-formatter";

import styles from "./css/section.module.css";
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
                const relatedData: RelatedProductsResponse = await fetchRelatedProducts(slug);
                console.log('Related Data:', relatedData); // Log dữ liệu phản hồi

                // Sử dụng tên thuộc tính "Sản phẩm gợi ý"
                if (relatedData && Array.isArray(relatedData["Sản phẩm gợi ý"])) {
                    console.log('Sản phẩm gợi ý:', relatedData["Sản phẩm gợi ý"]);
                    setRelatedVariants(relatedData["Sản phẩm gợi ý"]); // Cập nhật biến trạng thái với dữ liệu
                } else {
                    setError("Không thể lấy sản phẩm liên quan.");
                    // toast.error("Không thể lấy sản phẩm liên quan.");
                }
            } catch (error) {
                console.error('Error fetching related products:', error); // Log lỗi
                setError("Không thể tải dữ liệu.");
                // toast.error("Không thể tải dữ liệu.");
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
                        <SwiperSlide key={variant.variant_id || index}>
                            <div className={styles.productCard}>
                                <div className="backdrop-blur-sm bg-white/30">
                                    <Link to={`/product/${variant.slug}`} className={styles.productLink}>
                                        <figure className="relative w-full h-0 pb-[75%] overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0">
                                            {variant.images && variant.images.length > 0 ? (
                                                <img
                                                    className={`${styles.productImage}`}
                                                    src={variant.images[0]} // Show the first image
                                                    alt={`variant ${index + 1}`}
                                                />
                                            ) : (
                                                <img
                                                    className={`${styles.productImage}`}
                                                    src="placeholder-image-url" // Placeholder if no image is available
                                                    alt="placeholder"
                                                />
                                            )}
                                        </figure>
                                    </Link>
                                </div>

                                <div className={styles.productCardContent}>
                                    <div className={styles.productCardHeader}>
                                        {variant.discount_percent > 0 && (
                                            <span className={styles.productDiscount}>
                                                Giảm giá {variant.discount_percent}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white">
                                        <div className="mt-1 px-2 pb-1">
                                            <h5 className="text-sm tracking-tight text-slate-900 font-medium">
                                                {variant.variant_name}
                                            </h5>
                                        </div>
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
            {/* <ToastContainer /> */}
        </div>
    );
};

export default RelatedProduct;
