import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import {
  totalCategories,
  productByCateActive,
} from "../../../services/statistical/statistical.service";
import { useNavigate } from "react-router-dom";
interface TotalCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    totalCategories: number;
    activeCategories: number;
  };
}
interface Category {
  _id: string;
  name: string;
  productCount: number;
}
const CharCategories = () => {
  const [totalCate, setTotalCate] = useState<number>(0);
  const [xArray, setXArray] = useState<string[]>([]);
  const [yArray, setYArray] = useState<number[]>([]);
  const colors = ["#FFA500", "#00BFFF"];
  const navigates = useNavigate();
  const [xArray2, setXArray2] = useState<string[]>([]);
  const [yArray2, setYArray2] = useState<number[]>([]);
  const fetchTotalCate = async () => {
    try {
      const data: TotalCategoriesResponse = await totalCategories();
      setTotalCate(data.data.totalCategories);

      const disableCate =
        data.data.totalCategories - data.data.activeCategories;

      const xArray = ["Danh mục hoạt động", "Danh mục không hoạt động"];
      const yArray = [data.data.activeCategories, disableCate];

      setXArray(xArray);
      setYArray(yArray);

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProductByCateActive = async () => {
    try {
      const response: Category[] = await productByCateActive(); // Gán kiểu cho response
      // console.log(response); // Xem cấu trúc dữ liệu trả về

      // Lấy labels và values từ response
      const labels = response.map((item: Category) => item.name); // Xác định kiểu cho item
      const values = response.map((item: Category) => item.productCount); // Xác định kiểu cho item

      setXArray2(labels); // Cập nhật xArray
      setYArray2(values); // Cập nhật yArray
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchProductByCateActive();
    fetchTotalCate();
  }, []);
  return (
    <>
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="w-full">
          <div className=" mb-4">
            <h3 className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
              Danh mục sản phẩm
            </h3>
            <div className="text-center">
              <div className="w-full max-w-lg mx-auto text-center">
                <Plot
                  data={[
                    {
                      labels: xArray,
                      values: yArray,
                      type: "pie",
                      showlegend: false,
                    },
                  ]}
                  layout={{
                    width: window.innerWidth < 768 ? 350 : 500,
                    height: window.innerWidth < 768 ? 300 : 400,
                  }}
                  config={{
                    scrollZoom: false,
                    displayModeBar: false,
                  }}
                  className="w-full h-auto bg-transparent"
                />
              </div>
              <div className="mt-4 ">
                {xArray.map((label, index) => {
                  // Kiểm tra xem tổng số danh mục đã có giá trị hay chưa
                  if (totalCate === 0) return null;
                  // Tính phần trăm của từng danh mục
                  const percent = ((yArray[index] / totalCate) * 100).toFixed(
                    1
                  );
                  return (
                    <div key={index} className="flex items-center mb-2">
                      <div
                        className="w-4 h-4 mr-2"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                      <span>
                        {label}: {yArray[index]} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div id="traffic-channels-chart" className="w-full" />
        </div>
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

      {/* số lượng sản phẩm có trong danh mục  */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row lg:w-full md:w-1/2">
          <div className="w-full mb-4 lg:mb-0">
            <h3 className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
              Số lượng sản phẩm có trong danh mục đang hoạt động
            </h3>
            <div className="text-center">
              <div className="w-full max-w-lg mx-auto text-center">
                <Plot
                  data={[
                    {
                      x: xArray2, // Sử dụng xArray cho labels
                      y: yArray2, // Sử dụng yArray cho values
                      type: "bar",
                      showlegend: false,
                    },
                  ]}
                  layout={{
                    width: window.innerWidth < 768 ? 350 : 500,
                    height: window.innerWidth < 768 ? 300 : 400,
                  }}
                  config={{
                    scrollZoom: false,
                    displayModeBar: false,
                  }}
                  className="w-full h-auto bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

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
    </>
  );
};
export default CharCategories;
