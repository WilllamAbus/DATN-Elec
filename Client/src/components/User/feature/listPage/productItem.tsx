import { Link } from "react-router-dom";
import { StarIcon } from "../listPage/svg";
import { truncateText } from "../listPage/truncate/truncateText";
import currencyFormatter from "currency-formatter";
import { products } from "../../../../services/clientcate/client/types/getProuctbyCategory";
import { motion } from "framer-motion";
import AvgRating from "../details/comment/avgRating";
import { useState } from "react";
function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}
export interface ProductItemProps {
  product: products;
  index: number;
}
export default function ProductItem({ product, index }: ProductItemProps) {
  const [averageRating, setAverageRating] = useState<string>("0");

  const handleAverageRating = (rating: string) => {
    setAverageRating(rating);
  };
  return (
    <div
      key={index}
      className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-sm bg-white/30"
      >
        <Link to={`/product/${product.slug}`}>
          <figure className="relative w-full h-0 pb-[100%] overflow-hidden transition-all duration-300 cursor-pointer">
            <img
              className="absolute inset-0 w-full h-full object-contain rounded-lg p-8"
              src={product.image[0]}
              alt={`product ${index + 1}`}
            />
          </figure>
        </Link>
      </motion.div>

      <div className="pt-2 mb-10">
        <div className="mb-4 px-2 flex items-center justify-between gap-4">
          {product.variants.length > 0 &&
            product.variants[0].product_discount.isActive && (
              <span className="rounded bg-red-700  px-2.5 py-0.5 text-xs font-medium text-white dark:bg-primary-900 dark:text-primary-300">
                Giảm giá {product.variants[0].product_discount.discountPercent}%
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
          {/* <p className="text-sm font-medium text-gray-900 dark:text-white">
            {product.product_ratingAvg ? product.product_ratingAvg.toFixed(1) : "N/A"}
          </p> */}
            <AvgRating
          slug={product.slug}
          onAverageRating={handleAverageRating}
        />
        {averageRating !== "0" ? (
          <p className="text-sm font-medium text-gray-900 dark:text-white flex">
            {averageRating} trên 5.0 <StarIcon />
          </p>
        ) : (
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Chưa có đánh giá
          </p>
        )}
        </div>
        <div className="mt-2 px-2 flex items-center gap-2">
          {product.variants.length > 0 &&
            (product.variants[0].product_discount.discountPercent > 0 ? (
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
            ))}
        </div>

        <div className="mt-2 px-2">
          <div className="mt-2 flex flex-wrap gap-4">
            {product.variants.map((variant, idx) =>
              variant.storage ? (
                <div
                  key={idx}
                  className={`flex items-center justify-center w-auto h-auto p-1 text-sm border border-gray-300 rounded-md 
          ${
            idx === 0
              ? "border-primary-700 text-primary-700 bg-customGray"
              : "text-gray-800"
          }`}
                >
                  <p className="font-medium">
                    {variant.storage.name ? variant.storage.name : "N/A"}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
