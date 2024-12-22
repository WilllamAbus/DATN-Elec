  import { Link } from "react-router-dom";
  import { truncateText } from "../listPage/truncate/truncateText";
  import { products } from "../../../../services/product_v2/client/types/listPageAuction";
  import { motion } from "framer-motion";

  export interface ProductItemProps {
    product: products;
    index: number;
  }
  export default function ProductItem({ product, index }: ProductItemProps) {
    return (
      <div
        key={index}
        className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-sm bg-white/30">
          <Link to={`/product-auction/${product.slug}`}>
            <figure className="relative w-full h-0 pb-[100%] overflow-hidden transition-all duration-300 cursor-pointer ">
              <img
                className="absolute inset-0 w-full h-full object-contain rounded-lg p-8 "
                src={product.image[0]}
                alt={`product ${index + 1}`}
              />
            </figure>
          </Link>
        </motion.div>
        <div className="pt-1 mb-10">
          <div className="mb-4 px-2 flex items-center justify-between gap-4">

            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                data-tooltip-target="tooltip-add-to-favorites"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >

              </button>
            </div>
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


          <div className="mt-2 px-2 flex items-center gap-2">

          </div>
          <div className="px-2 mt-2 text-xs font-medium text-gray-700">
            <span>Tình trạng: </span>
            <span className="text-gray-900">{product.product_condition.nameCondition}</span>
          </div>
          <div className="px-2 mt-2 text-xs font-medium text-gray-700">
            <span>Thương hiệu: </span>
            {product.product_brand ? (
              <span className="text-gray-900">{product.product_brand.name}</span>
            ) : (
              <span className="text-gray-900">N/A</span>
            )}
          </div>

          <div className="px-2 mt-2 text-xs font-medium text-gray-700">
            <span>Nhà cung cấp: </span>
            {product.product_supplier ? (
              <span className="text-gray-900">{product.product_supplier.name}</span>
            ) : (
              <span className="text-gray-900">N/A</span>
            )}
          </div>

        </div>
      </div>
    );
  }
