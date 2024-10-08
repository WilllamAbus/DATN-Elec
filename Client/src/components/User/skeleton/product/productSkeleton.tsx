import React from "react";
import Skeleton from "@mui/material/Skeleton";
import styles from "../../feature/listPage/css/section.module.css";

interface ProductSkeletonListProps {
  length?: number;
}

const ProductSkeletonList: React.FC<ProductSkeletonListProps> = ({ length = 12 }) => {
  return (
    <div className={styles.gridContainer}>
      {[...Array(length)].map((_, index) => (
        <div
          key={index}
          className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
        >
          <div className="relative w-full h-0 pb-[100%] overflow-hidden">
            <Skeleton
              variant="rectangular"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              height={150}
            />
          </div>
          <div className="p-2">
            <div className="mb-4 px-2 flex items-center justify-between gap-4">
              <Skeleton
                variant="text"
                width="30%"
                height={20}
                className="rounded bg-primary-100 text-xs font-medium text-primary-800"
              />
              <div className="flex items-center justify-end gap-1">
                <Skeleton variant="circular" width={24} height={24} className="rounded-full" />
              </div>
            </div>
            {/* Skeleton cho tên sản phẩm */}
            <div className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white">
              <div className="mt-1 px-2 pb-1">
                <a href="#">
                  <h5 className="text-sm tracking-tight text-slate-900 font-medium">
                    <Skeleton variant="text" width="80%" height={24} />
                  </h5>
                </a>
              </div>
            </div>
            {/* Skeleton cho đánh giá */}
            <div className="px-2 flex items-center gap-2">
              <Skeleton variant="text" width="20%" height={20} />
              <Skeleton variant="circular" width={20} height={20} className="rounded-full" />
              <div className="text-xs text-gray-500 items-center flex-1">
                <Skeleton variant="text" width="40%" height={20} />
              </div>
            </div>
            {/* Skeleton cho giá */}
            <div className="mt-1 px-2 flex items-center gap-2 mb-11">
              <Skeleton
                variant="text"
                width="60%" // Điều chỉnh chiều rộng phù hợp
                height={24} // Điều chỉnh chiều cao nếu cần thiết
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeletonList;
