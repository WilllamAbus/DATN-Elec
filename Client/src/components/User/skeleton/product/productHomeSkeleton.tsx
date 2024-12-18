import React from "react";
import { Skeleton } from "@nextui-org/react";
import styles from "../../feature/home/css/section.module.css";

interface ProductSkeletonListProps {
  length?: number;
}

const ProductSkeletonList: React.FC<ProductSkeletonListProps> = ({ length = 10 }) => {
  return (
    <div className={styles.gridContainer}>
      {[...Array(length)].map((_, index) => (
        <div
          key={index}
          className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
        >
          {/* Skeleton cho hình ảnh sản phẩm */}
          <Skeleton className="relative w-full h-0 pb-[100%] rounded-lg">
            <div className="absolute inset-0 w-full h-full bg-gray-200" />
          </Skeleton>
          <div className="pt-1 mb-10">
            {/* Skeleton cho giảm giá */}
            <div className="mb-4 px-2 flex items-center justify-between gap-4">
              <Skeleton className="w-1/3 rounded-lg">
                <div className="h-4 bg-gray-300" />
              </Skeleton>
              <Skeleton className="w-6 h-6 rounded-full">
                <div className="h-6 w-6 bg-gray-300 rounded-full" />
              </Skeleton>
            </div>
            {/* Skeleton cho tên sản phẩm */}
            <div className="px-2 text-md font-semibold leading-tight text-gray-900">
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-4 bg-gray-300" />
              </Skeleton>
            </div>
            {/* Skeleton cho giá */}
            <div className="mt-2 px-2 flex items-center gap-2">
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-4 bg-gray-300" />
              </Skeleton>
              <Skeleton className="w-1/3 rounded-lg">
                <div className="h-4 bg-gray-300" />
              </Skeleton>
            </div>
            {/* Skeleton cho tình trạng */}
            <div className="px-2 mt-2">
              <Skeleton className="w-1/2 rounded-lg">
                <div className="h-4 bg-gray-300" />
              </Skeleton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeletonList;
