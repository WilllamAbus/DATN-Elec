import { useEffect, useState } from "react";
import { productCate } from "../../../services/statistical/statistical.service";
import { totalCategories } from "../../../services/statistical/statistical.service";

import Plot from "react-plotly.js";
const CharProduct = () => {
  const [, setTotalCate] = useState<number>(0);
  const [, setXArray] = useState<string[]>([]);
  const [yArray, setYArray] = useState<number[]>([]);
  const fetchAndSetTotalCate = async () => {
    try {
      const categoryData = await totalCategories();
      const productData = await productCate();

      // Cập nhật tổng số danh mục
      setTotalCate(categoryData.data.totalCategories);

      // Tính số danh mục chưa hoạt động
      const disableCate =
        categoryData.data.totalCategories - categoryData.data.activeCategories;

      // Lấy số lượng danh mục và sản phẩm
      const activeCategoryCount = categoryData.data.activeCategories; // Số danh mục đang hoạt động
      const activeProductCount = productData.data.activeProducts.length; // Số lượng sản phẩm đang hoạt động
      const inactiveCategoryCount = disableCate; // Số danh mục không hoạt động
      const disableProductCount = productData.data.disabledProducts.length; // Số lượng sản phẩm không hoạt động

      const xArray = [
        "Danh mục hoạt động",
        "Sản phẩm hoạt động",
        "Danh mục không hoạt động",
        "Sản phẩm không hoạt động",
      ];

      const yArray = [
        activeCategoryCount,
        activeProductCount,
        inactiveCategoryCount,
        disableProductCount,
      ];

      setXArray(xArray);
      setYArray(yArray);

   

      return { xArray, yArray };
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAndSetTotalCate();
  }, []);
  return (
    <>
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="w-full">
          <div className="mb-4">
            <h3 className="mb-2 text-bas  e font-normal text-gray-500 dark:text-gray-400">
              Trạng thái danh mục và sản phẩm
            </h3>
            <div className="text-center">
              <div className="w-full max-w-lg mx-auto text-center">
                <Plot
                  data={[
                    {
                      x: ["Đang hoạt động", "Không hoạt động"], 
                      y: [yArray[0], yArray[2]], 
                      type: "bar",
                      name: "Danh mục",
                      marker: { color: "#FFA500" },
                      showlegend: false,

                    },
                    {
                      x: ["Đang hoạt động", "Không hoạt động"], 
                      y: [yArray[1], yArray[3]], 
                      type: "bar",
                      name: "Sản phẩm",
                      marker: { color: "#00BFFF" },
                      showlegend: false,

                    },
                  ]}
                  layout={{
                    width: window.innerWidth < 768 ? 350 : 500,
                    height: window.innerWidth < 768 ? 300 : 400,
                    barmode: "group", 
                    bargap: 0.3, 
                    
                  }}
                  config={{
                    scrollZoom: false, 
                    displayModeBar: false,  
                  }}
                  className="w-full h-auto bg-transparent"
                />
              </div>
              <div className="mt-4">
                {[
                  "Danh mục hoạt động",
                  "Sản phẩm hoạt động",
                  "Danh mục không hoạt động",
                  "Sản phẩm không hoạt động",
                ].map((label, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div
                      className="w-4 h-4 mr-2"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#FFA500" : "#00BFFF", 
                      }}
                    />
                    <span>
                      {label}: {yArray[Math.floor(index / 2) * 2 + (index % 2)]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div id="traffic-channels-chart" className="w-full" />
        </div>
      </div>
    </>
  );
};
export default CharProduct;
