// import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  totalQuantityProduct,
  pendingOrder,
  totalCategories
} from "../../../services/statistical/statistical.service";
interface TotalCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    totalCategories: number;
    activeCategories: number;
  };
}
const ProductStatistics = () => {
  const navigates = useNavigate();
 
  const [totalQuantity, setTotalQuantity] = useState<number | null>(null);
  const [pendingOders, setpendingOder] = useState<number | null>(null);
  const [totalCate, setTotalCate] = useState< TotalCategoriesResponse | null>(null);
  const fetchData = async () => {
    try {
      const response = await totalQuantityProduct();
      if (response.data) {
        setTotalQuantity(response.data);
      } else {
        setTotalQuantity(0);
      }
      // console.log(response.data);
    } catch (error) {
      // console.error("Error fetching total quantity:", error);
    }
  };
  const fetchOder = async () => {
    try {
      const response = await pendingOrder();
      setpendingOder(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchtoTalCate = async () => {
    try {
      const data = await totalCategories();
      setTotalCate(data);
    
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOder();
    fetchData();
    fetchtoTalCate()
  }, []);
  return (
    <>
      {/* sản phẩm */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm  dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white">
              Sản Phẩm
            </span>
            <h3 className="text-base font-light text-gray-500 dark:text-gray-400">
              Tổng số lượng sản phẩm:{" "}
              {totalQuantity !== null ? totalQuantity : "Loading..."}
            </h3>
          </div>
          <div className="flex items-center justify-end flex-1 text-base font-medium text-green-500 dark:text-green-400">
            <svg
              className="w-10 h-10 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
              ></path>
            </svg>
          </div>
        </div>
        <div id="main-chart" />
        {/* Card Footer */}
        <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-200 sm:pt-6 dark:border-gray-700">
          <div className="flex-shrink-0">
            <button
              onClick={() => navigates("/admin/listproduct")}
              className="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
            >
              Chi tiết
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* đơn hàng */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm  dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white">
              Đơn hàng
            </span>
            <h3 className="text-base font-light text-gray-500 dark:text-gray-400">
              Số lượng đơn hàng đang chờ xử lý: {pendingOders}
            </h3>
          </div>
          <div className="flex items-center justify-end flex-1 text-base font-medium text-green-500 dark:text-green-400">
            <svg
              className="w-10 h-10 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
        <div id="main-chart" />
        {/* Card Footer */}
        <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-200 sm:pt-6 dark:border-gray-700">
          <div className="flex-shrink-0">
            <button
              onClick={() => navigates("/admin/listOrders")}

              className="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
            >
              Chi tiết
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* danh mục */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm  dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white">
              Danh mục
            </span>
            <h3 className="text-base font-light text-gray-500 dark:text-gray-400">
              Số lượng danh mục: {totalCate?.data?.totalCategories}
           
            </h3>
          </div>
          <div className="flex items-center justify-end flex-1 text-base font-medium text-green-500 dark:text-green-400">
            <svg
              className="w-10 h-10 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 6h8M6 10h12M8 14h8M6 18h12"
              ></path>
            </svg>
          </div>
        </div>
        <div id="main-chart" />
        {/* Card Footer */}
        <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-200 sm:pt-6 dark:border-gray-700">
          <div className="flex-shrink-0">
            <button
              onClick={() => navigates("/admin/listCategories")}
              className="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
            >
              Chi tiết
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    
      {/* sản phẩm mới  */}
    </>
  );
};
export default ProductStatistics;
