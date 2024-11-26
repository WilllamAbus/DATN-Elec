import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StarIcon } from "../listPage/svg";
import { truncateText } from "../listPage/truncate/truncateText";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import { searchProduct } from "../../../../services/product_v2/client/homeAllProduct";
import currencyFormatter from "currency-formatter";

function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}
const search: React.FC = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const fetchProducts = async () => {
    if (keyword) {
      try {
        const result = await searchProduct(keyword);
        setProducts(result.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      console.log(`lỗi`);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [keyword]);
  return (
    <>
        <h1 className="text-center text-3xl m-3">Sản phẩm có từ khóa: {keyword}</h1>
        {/* <!-- products --> */}
          {(keyword ?? "").length > 0 && (
            <div className="grid md:grid-cols-5 gap-2 m-10 ">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div
                  key={index}
                  className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
                >
                  <div className="backdrop-blur-sm bg-white/30">
                    <Link to={`/product/${product.slug}`}>
                      <figure className="relative w-full h-0 pb-[100%] overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0">
                        <img
                          className="absolute inset-0 w-full h-full object-cover rounded-lg p-8"
                          src={product.image[0]}
                          alt={`product ${index + 1}`}
                        />
                      </figure>
                    </Link>
                  </div>
                  <div className="pt-1 mb-10">
                    <div className="mb-4 px-2 flex items-center justify-between gap-4">
                      {product.variants.length > 0 && product.variants[0].product_discount?.isActive && (
                        <span className="rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                          Giảm giá {product.variants[0].product_discount?.discountPercent}%
                        </span>
                      )}
                    </div>
            
            
                    <div className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white">
                      <div className="mt-1 px-2 pb-1">
                        <a href="#">
                          <h5 className="text-sm tracking-tight text-slate-900 font-medium">
                            {truncateText(product.product_name, 30)}
                          </h5>
                        </a>
                      </div>
                    </div>
            
                    <div className="px-2 flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.product_ratingAvg ? product.product_ratingAvg.toFixed(1) : "N/A"}
                      </p>
                      <StarIcon />
            
                    </div>
                    <div className="mt-2 px-2 flex items-center gap-2">
                      {product.variants.length > 0 && (
                        product.variants[0].product_discount?.discountPercent > 0 ? (
                          <div className="flex w-full">
                            <p className="text-xs font-medium text-rose-700 flex-grow">
                              {formatCurrency(product.variants[0].variant_price)} đ
                            </p>
                            <p className="text-xs font-medium text-gray-400 line-through flex-shrink-0">
                              {formatCurrency(product.variants[0].variant_original_price)} đ
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs font-medium text-rose-700">
                            {formatCurrency(product.variants[0].variant_price)} đ
                          </p>
                        )
                      )}
                    </div>
            
                    <div className="mt-2 px-2">
                      <div className="mt-2 flex flex-wrap gap-4">
                        {product.variants.map((variant:any, idx:any) => (
                          variant.storage ? (
                            <div
                              key={idx}
                              className={`flex items-center justify-center w-auto h-auto p-1 text-sm border border-gray-300 rounded-md 
                      ${idx === 0 ? 'border-primary-700 text-primary-700 bg-customGray' : 'text-gray-800'}`}
                            >
                              <p className="font-medium">{variant.storage.name ? variant.storage.name : "N/A"}</p>
                            </div>
                          ) : null
                        ))}
                      </div>
                    </div>
            
            
            
            
            
            
            
            
            
            
                  </div>
                </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  Không có sản phẩm nào được tìm thấy
                </div>
              )}
            </div>
          )}
        
    </>
  );
};

export default search;
