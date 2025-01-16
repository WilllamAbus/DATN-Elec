import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Link } from "react-router-dom";
import { truncateText } from "../listPage/truncate/truncateText";
import { products } from "../../../../services/product_v2/client/types/listPageAuction";
import { motion } from "framer-motion";
import WarningAuction from "./warningAuction";

export interface ProductItemProps {
  product: products;
  index: number;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, index }) => {
  const [showWarning, setShowWarning] = useState(false);
  const isEnded = product.auctionPricing && product.auctionPricing.status === 'ended';
  const statusWarningTimeout = useSelector((state: RootState) => state.productClient.getUserCart.statusWarningTimeout);
  const statusAuction = useSelector((state: RootState) => state.productClient.getUserCart.statusAuction);
  const timeLimit = useSelector((state: RootState) => state.productClient.getUserCart.timeLimit);
  const warning = useSelector((state: RootState) => state.productClient.getUserCart.warning);
  const isBanned = useSelector((state: RootState) => state.productClient.getUserCart.isBanned);
  const isDisabled = statusAuction === 'disabled';
  const hasWarningTimeout = statusWarningTimeout === true;
  const isUserBanned = isBanned === true;
  const isWithinTimeLimit = timeLimit && new Date() < new Date(timeLimit);

  const cannotClickProduct = isDisabled || hasWarningTimeout || isUserBanned || isWithinTimeLimit;

  const warningMessage = `Hệ thống ghi nhận bạn đã hủy ${warning} lần, nên hệ thống sẽ phạt bạn ${timeLimit ? `${Math.ceil((new Date(timeLimit).getTime() - new Date().getTime()) / 60000)} phút mới vào được đấu giá` : "0 phút"
    }.`;

  const handleProductClick = () => {
    if (cannotClickProduct) {
      setShowWarning(true);
    }
  };

  return (
    <div
      key={index}
      className={`relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md ${isEnded ? 'opacity-50' : ''
        }`}
      onClick={handleProductClick}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-sm bg-white/30"
      >
        <figure className="relative w-full h-0 pb-[100%] overflow-hidden transition-all duration-300 cursor-pointer">
          <img
            className="absolute inset-0 w-full h-full object-contain rounded-lg p-8"
            style={{ filter: isEnded ? "blur(4px)" : "" }}
            src={product.image[0]}
            alt={`product ${index + 1}`}
          />
          {isEnded && (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-70 flex items-center justify-center">
              <span className="text-white text-lg text-center font-semibold">Phiên đấu giá kết thúc đang trong quá trình xử lý</span>
            </div>
          )}
        </figure>
      </motion.div>
      {showWarning && cannotClickProduct && (
        <div className="px-2 mt-2 text-xs font-medium text-gray-700">
          <WarningAuction warningCount={warning} penaltyDuration={warningMessage} />
        </div>
      )}
      {!cannotClickProduct && (
        <Link to={`/product-auction/${product.slug}`} className="absolute inset-0">
          <span className="sr-only">đi đến trang chi tiết</span>
        </Link>
      )}
      <div className="pt-1 mb-10">
        <div className="mb-4 px-2 flex items-center justify-between gap-4">

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
};

export default ProductItem;
