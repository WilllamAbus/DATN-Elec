import React from "react";
import { Skeleton } from "@nextui-org/react";
import styles from "../../feature/listPage/css/section.module.css";

interface ProductSkeletonListProps {
  length?: number;
}

const ProductAuctionSkeleton: React.FC<ProductSkeletonListProps> = ({ length = 12 }) => {
  return (
    <div className={styles.gridContainer}>
      {[...Array(length)].map((_, index) => (
        <div
          key={index}
          className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
        >
          {/* Skeleton for product image */}
          <div className="relative w-full h-0 pb-[100%] overflow-hidden rounded-lg">
            <Skeleton className="absolute inset-0 w-full h-full bg-gray-200" />
          </div>

          <div className="pt-4 mb-10">
            {/* Skeleton for product name */}
            <div className="mt-1 px-2 pb-1">
              <Skeleton className="w-4/5 h-5 rounded bg-gray-300" />
            </div>

            {/* Skeleton for price */}
            <div className="mt-2 px-2 flex items-center gap-2">
              <Skeleton className="w-2/5 h-4 rounded bg-gray-300" />
              <Skeleton className="w-1/3 h-4 rounded bg-gray-300" />
            </div>

            {/* Skeleton for condition */}
            <div className="px-2 mt-2">
              <Skeleton className="w-1/2 h-4 rounded bg-gray-300" />
            </div>

            {/* Skeleton for brand */}
            <div className="px-2 mt-2">
              <Skeleton className="w-1/3 h-4 rounded bg-gray-300" />
            </div>

            {/* Skeleton for supplier */}
            <div className="px-2 mt-2">
              <Skeleton className="w-1/3 h-4 rounded bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductAuctionSkeleton;
