import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { StarIcon } from "../listPage/svg";
import { truncateText } from "../listPage/truncate/truncateText";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import { searchProduct } from "../../../../services/product_v2/client/homeAllProduct";
import currencyFormatter from "currency-formatter";
import { Skeleton } from '@nextui-org/react';

function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}

const Search: React.FC = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const [products, setProducts] = useState<{
    products: any[];
    auctions: any[];
  }>({ products: [], auctions: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    if (!keyword) {
      return;
    }
  
    setIsLoading(true); 
  
    try {
      const result = await searchProduct(keyword); // Gọi API
  
      if (result && result.data) {
        const { data1, data2 } = result.data;
        setProducts({
          products: data1 || [], // Lấy danh sách sản phẩm thông thường
          auctions: data2 || [], // Lấy danh sách sản phẩm đấu giá
        });
      } else {
        console.warn("No data found in response");
        setProducts({ products: [], auctions: [] });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setProducts({ products: [], auctions: [] });
    } finally {
      setIsLoading(false); // Đặt trạng thái loading về false khi hoàn thành (có thể là thành công hoặc lỗi)
    }
  };
  

  useEffect(() => {
    if (keyword) {
      fetchProducts();
    }
  }, [keyword]);

  return (
    <>
      {isLoading ? (
        <div className="text-center my-10">
          {/* Hiển thị Skeleton Loading */}
          <div className="grid md:grid-cols-5 gap-2 m-10">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                  <Skeleton style={{ height: "200px" }} />
                  <div className="pt-1 mb-10">
                    <Skeleton style={{ height: "20px", width: "70%" }} />
                    <Skeleton style={{ height: "15px", width: "50%" }} />
                    <Skeleton style={{ height: "15px", width: "60%" }} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <>
          {/* Sản phẩm đấu giá */}
          {(keyword ?? "").length > 0 && products.auctions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-center mt-6">
                Sản phẩm đấu giá
              </h2>
              <div className="grid md:grid-cols-5 gap-2 m-10">
                {products.auctions.map((auction, index) => (
                  <div
                    key={index}
                    className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
                  >
                    <div className="backdrop-blur-sm bg-white/30">
                      <Link to={`/product-auction/${auction.slug}`}>
                        <figure className="relative w-full h-0 pb-[100%] overflow-hidden transition-all duration-300 cursor-pointer">
                          <img
                            className="absolute inset-0 w-full h-full object-contain rounded-lg p-8"
                            src={auction.image[0]}
                            alt={`product ${index + 1}`}
                          />
                        </figure>
                      </Link>
                    </div>
                    <div className="pt-1 mb-10">
                      <div className="mb-4 px-2 flex items-center justify-between gap-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            data-tooltip-target="tooltip-add-to-favorites"
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            {/* Nút yêu thích */}
                          </button>
                        </div>
                      </div>
                      <div className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white">
                        <div className="mt-1 px-2 pb-1">
                          <a href="#">
                            <h5 className="text-sm tracking-tight text-slate-900 font-medium">
                              {truncateText(auction.product_name, 30)}
                            </h5>
                          </a>
                        </div>
                      </div>
                      <div className="mt-2 px-2 flex items-center gap-2">
                        {/* Thông tin thêm */}
                      </div>
                      <div className="px-2 mt-2 text-xs font-medium text-gray-700">
                        <span>Tình trạng: </span>
                        <span className="text-gray-900">
                          {auction.product_condition.nameCondition}
                        </span>
                      </div>
                      <div className="px-2 mt-2 text-xs font-medium text-gray-700">
                        <span>Thương hiệu: </span>
                        {auction.product_brand ? (
                          <span className="text-gray-900">
                            {auction.product_brand.name}
                          </span>
                        ) : (
                          <span className="text-gray-900">N/A</span>
                        )}
                      </div>
                      <div className="px-2 mt-2 text-xs font-medium text-gray-700">
                        <span>Nhà cung cấp: </span>
                        {auction.product_supplier ? (
                          <span className="text-gray-900">
                            {auction.product_supplier.name}
                          </span>
                        ) : (
                          <span className="text-gray-900">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sản phẩm thông thường */}
          {(keyword ?? "").length > 0 && products.products.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-center mt-6">
                Sản phẩm thông thường
              </h2>
              <div className="grid md:grid-cols-5 gap-2 m-10">
                {products.products.map((product, index) => (
                  <div
                    key={index}
                    className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
                  >
                    <div className="backdrop-blur-sm bg-white/30">
                      <Link to={`/product/${product.slug}`}>
                        <figure className="relative w-full h-0 pb-[100%] overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0">
                          <img
                            className="absolute inset-0 w-full h-full object-cover rounded-lg p-8"
                            src={product.image?.[0] || "placeholder.jpg"}
                            alt={`product ${index + 1}`}
                          />
                        </figure>
                      </Link>
                    </div>
                    <div className="pt-1 mb-10 h-full">
                      <h5 className="text-sm font-medium text-slate-900 px-2">
                        {truncateText(product.product_name, 30)}
                      </h5>
                      <p className="text-sm text-gray-700 px-2">
                        Giá:{" "}
                        {product.variants?.[0]?.variant_price
                          ? formatCurrency(product.variants[0].variant_price) + " đ"
                          : "Đang cập nhật"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nếu không có sản phẩm đấu giá và sản phẩm thông thường */}
          {products.auctions.length === 0 && products.products.length === 0 && (
            <div className="col-span-full text-center text-gray-500 mt-6">
              Không có sản phẩm nào được tìm thấy
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Search;
