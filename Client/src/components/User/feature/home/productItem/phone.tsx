import { Link } from "react-router-dom";
import currencyFormatter from "currency-formatter";
import { ProductVariant } from "../../../../../services/home/types/getPhoneByVariants";
import { motion } from "framer-motion";

function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}

export interface ProductItemProps {
  productVariant: ProductVariant;
  index: number;
}

export default function ProductItem({ productVariant, index }: ProductItemProps) {
  return (
    <div
      className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-sm bg-white/30"
      >
        <Link to={`/product/${productVariant.product.slug}`}>
          <figure className="relative w-full h-0 pb-[100%] overflow-hidden transition-all duration-300 cursor-pointer">
            <img
              className="absolute inset-0 w-full h-full object-contain rounded-lg p-8"
              src={productVariant.image[0]?.image[0]}
              alt={`product ${index + 1}`}
            />
          </figure>


        </Link>
      </motion.div>

      <div className="pt-2 mb-10">
        <div className="mb-4 px-2 flex items-center justify-between gap-4">
          <span className="rounded bg-red-700 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-primary-900 dark:text-primary-300">
            Giảm giá {productVariant.product_discount.discountPercent}%
          </span>
        </div>

        <div className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white">
          <div className="mt-1 px-2 pb-1">
            <a href="#">
              <h5 className="text-sm tracking-tight text-slate-900 font-medium">
                {productVariant.variant_name}
              </h5>
            </a>
          </div>
        </div>

        <div className="mt-2 px-2 flex items-center gap-2">
          {productVariant.product_discount.discountPercent > 0 ? (
            <div className="flex w-full">
              <p className="text-xs font-medium text-rose-700 flex-grow">
                {formatCurrency(productVariant.variant_price)} đ
              </p>
              <p className="text-xs font-medium text-gray-400 line-through flex-shrink-0">
                {formatCurrency(productVariant.variant_original_price)} đ
              </p>
            </div>
          ) : (
            <p className="text-xs font-medium text-rose-700">
              {formatCurrency(productVariant.variant_price)} đ
            </p>
          )}
        </div>

        <div className="mt-2 px-2">
          <div className="mt-2 flex flex-wrap gap-4">
            {productVariant.storage && (
              <div
                className="flex items-center justify-center w-auto h-auto p-1 text-xs border-none bg-neutral-100 rounded-md text-gray-800"
              >
                <p className="font-medium">{productVariant.storage.name || "Chưa cập nhật"}</p>
              </div>
            )}

            {productVariant.screen && (
              <div
                className="flex items-center justify-center w-auto h-auto p-1 text-xs border-none rounded-md bg-neutral-100 text-gray-800"
              >
                <p className="font-medium">{productVariant.screen.name || "Chưa cập nhật"}</p>
              </div>
            )}

            {productVariant.ram && (
              <div
                className="flex items-center justify-center w-auto h-auto p-1 text-xs border-none bg-neutral-100 rounded-md text-gray-800"
              >
                <p className="font-medium">{productVariant.ram.name || "Chưa cập nhật"}</p>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
