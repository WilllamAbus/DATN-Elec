import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { fetchRelatedProductAuctions } from "../../../../../services/detailProduct/relatedProducts";
import { Recommendation, RelatedProductsAuctionResponse } from "../../../../../services/detailProduct/types/relatedProductAuction";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./css/section.module.css";

const RelatedProduct: React.FC = () => {
  const [relatedProducts, setRelatedProducts] = useState<Recommendation[]>([]);
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
        const relatedData: RelatedProductsAuctionResponse = await fetchRelatedProductAuctions(slug); // Lấy mảng Recommendation[]
        console.log("Related Data:", relatedData);  // Kiểm tra lại cấu trúc dữ liệu trả về

        // Kiểm tra có đúng dữ liệu trả về là mảng trong "Sản phẩm gợi ý"
        if (relatedData && Array.isArray(relatedData["Sản phẩm gợi ý"])) {
          console.log('Sản phẩm gợi ý là:', relatedData["Sản phẩm gợi ý"]);
          setRelatedProducts(relatedData["Sản phẩm gợi ý"]); // Cập nhật mảng sản phẩm liên quan
        } else {
          setError("Không thể lấy sản phẩm liên quan.");
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        setError("Không thể tải dữ liệu.");
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
      ) : relatedProducts.length === 0 ? (
        <p>Không tìm thấy sản phẩm liên quan.</p>
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
        <div className={`gridContainer ${styles.gridContainer}`}>
         {relatedProducts.map((product) => (
            <SwiperSlide key={product.slug}>
              <div className={styles.productCard}>
                <div className="backdrop-blur-sm bg-white/30">
                  <Link
                    to={`/product-auction/${product.slug}`}
                    className={styles.productLink}
                  >
                    <figure className="relative w-full h-0 pb-[75%] overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0">
                      {product.image && product.image.length > 0 ? (
                        <img
                          className={`${styles.productImage}`}
                          src={product.image[0]} // Hiển thị hình ảnh đầu tiên
                          alt={product.product_name}
                        />
                      ) : (
                        <img
                          className={`${styles.productImage}`}
                          src="placeholder-image-url" // Placeholder nếu không có hình ảnh
                          alt="placeholder"
                        />
                      )}
                    </figure>
                  </Link>
                </div>

                <div className={styles.productCardContent}>
                  <div className="mt-1 px-2 pb-1">
                    <h5 className="text-sm tracking-tight text-slate-900 font-medium">
                      {product.product_name}
                    </h5>
                  </div>

                  <div className="px-2 mt-2 text-xs font-medium text-gray-700">
                    <span>Thương hiệu: </span>
                    {product.brand_name ? (
                      <span className="text-gray-900">{product.brand_name}</span>
                    ) : (
                      <span className="text-gray-900">N/A</span>
                    )}
                  </div>
                  <div className="px-2 mt-2 text-xs font-medium text-gray-700">
                    <span>Nhà cung cấp: </span>
                    {product.supplier_name ? (
                      <span className="text-gray-900">{product.supplier_name}</span>
                    ) : (
                      <span className="text-gray-900">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
         </div>
        </Swiper>
      )}
    </div>
  );
};

export default RelatedProduct;
