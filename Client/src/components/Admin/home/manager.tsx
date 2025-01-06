import React, { useEffect, useState } from "react";
import { revenue } from "../../../services/statistical/statistical.service";
import currencyFormatter from "currency-formatter";
import { Pagination } from "@nextui-org/react";

// Hàm định dạng tiền tệ
function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}

const Manager = () => {
  const [data, setData] = useState<any[]>([]); // Danh sách sản phẩm
  const [totalRevenue, setTotalRevenue] = useState<number>(0); // Doanh thu hiện tại
  const [, setOverallRevenue] = useState<number>(0); // Doanh thu tổng (nếu không lọc)
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState<number>(1); // Tổng số trang
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  }); // Bộ lọc ngày
  const [productType, setProductType] = useState<string>("0"); // State for product type
  const [auctionRevenue, setAuctionRevenue] = useState<number>(0); // Doanh thu đấu giá
  const [normalRevenue, setNormalRevenue] = useState<number>(0);
  // Handle product type change
  const handleProductTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setProductType(value);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  // Hàm gọi API lấy dữ liệu
  const fetchData = async (page: number = 1) => {
    try {
      const params: any = {
        limit: 5,
        page,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

      const res = await revenue(params);

      if (res?.data) {
        const { totalRevenue = 0, totalPages = 1, products = [] } = res.data;

        setTotalRevenue(totalRevenue);
        setTotalPages(totalPages);

        // Lọc theo loại sản phẩm ngay lập tức khi nhận dữ liệu
        const filteredData = productType === "0"
          ? products
          : products.filter((item: any) => (productType === "1" ? item?.product_randBib : !item?.product_randBib));

        setData(filteredData);

        // Tính doanh thu cho từng loại sản phẩm
        let auctionRev = 0;
        let normalRev = 0;

        filteredData.forEach((item:any) => {
          const itemTotal = item?.price * item?.quantity;
          if (item?.product_randBib) {
            auctionRev += itemTotal;
          } else {
            normalRev += itemTotal;
          }
        });

        setAuctionRevenue(auctionRev);
        setNormalRevenue(normalRev);

        if (!filters.startDate && !filters.endDate) {
          setOverallRevenue(totalRevenue);
        }
      } else {
        setData([]);
        setTotalRevenue(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setTotalRevenue(0);
    }
  };

  // Xử lý khi thay đổi bộ lọc ngày
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Làm mới bộ lọc
  const resetFilters = () => {
    setFilters({ startDate: "", endDate: "" });
    setCurrentPage(1);
    setProductType('0');
  };

  // Thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Gọi API khi bộ lọc hoặc trang thay đổi
  useEffect(() => {
    fetchData(currentPage);
  }, [filters, currentPage, productType]);  // Thêm productType vào dependencies để theo dõi thay đổi

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg dark:border-gray-700 dark:bg-gray-800">
 <div>
 <h3 className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
  {filters.startDate || filters.endDate ? (
    <>
      {filters.startDate && filters.endDate
        ? `Doanh thu từ ${new Date(filters.startDate).toLocaleDateString(
            "vi-VN"
          )} đến ${new Date(filters.endDate).toLocaleDateString("vi-VN")}`
        : filters.startDate
        ? `Doanh thu ngày ${new Date(filters.startDate).toLocaleDateString(
            "vi-VN"
          )}`
        : filters.endDate
        ? `Doanh thu ngày ${new Date(filters.endDate).toLocaleDateString(
            "vi-VN"
          )}`
        : ""}{" "}
      
      {productType !== "0" && (
        <> - Sản phẩm {productType === "1" ? `đấu giá: ${formatCurrency(auctionRevenue)} đ` : `thông thường: ${formatCurrency(normalRevenue)} đ` }</>
      )}
      :{" "}
      {/* Chỉ hiển thị phần totalRevenue nếu không lọc loại sản phẩm là đấu giá */}
      {productType === "0" && (
        <span>
          {formatCurrency(totalRevenue)} đ
        </span>
      )}
    </>
  ) : (
    <>
      {productType === "1" ? (
        <>Doanh thu sản phẩm đấu giá: {formatCurrency(auctionRevenue)} đ</>
      ) : productType === "2" ? (
        <>Doanh thu sản phẩm thông thường: {formatCurrency(normalRevenue)} đ</>
      ) : (
        <>Doanh thu tổng: {formatCurrency(totalRevenue)} đ</>
      )}
    </>
  )}
</h3>




      </div>   
    <div className="w-full flex justify-between items-center mb-6">
      {/* Hiển thị thông tin doanh thu */}
     
      <div>
        <select
          className="rounded-lg p-2 bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={productType}
          onChange={handleProductTypeChange}
        >
          <option value="0">Tất cả sản phẩm</option>
          <option value="1">Sản phẩm đấu giá</option>
          <option value="2">Sản phẩm thông thường</option>
        </select>
      </div>
      {/* Bộ lọc */}
      <div className="flex items-center gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ngày bắt đầu:
          </label>
          <input
            type="date"
            value={filters.startDate}
            name="startDate"
            onChange={handleInputChange}
            className="rounded-lg p-2 bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ngày kết thúc:
          </label>
          <input
            type="date"
            value={filters.endDate}
            name="endDate"
            onChange={handleInputChange}
            className="rounded-lg p-2 bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={resetFilters}
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  
    {/* Bảng hiển thị dữ liệu */}
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Tên sản phẩm</th>
            <th className="px-6 py-3">Giá tiền</th>
            <th className="px-6 py-3">Loại sản phẩm</th>
            <th className="px-6 py-3">Số lượng</th>
            <th className="px-6 py-3">Thành tiền</th>
            <th className="px-6 py-3">Thời gian mua</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">{item?.product?.product_name || "N/A"}</td>
                <td className="px-6 py-4">{formatCurrency(item?.price || 0)} đ</td>
                <td className="px-6 py-4">
                  {item?.product_randBib ? "Đấu giá" : "Thông thường"}
                </td>
                <td className="px-6 py-4">{item?.quantity || 0}</td>
                <td className="px-6 py-4">{formatCurrency(item?.price || 0)} đ</td>
                <td className="px-6 py-4">
                  {item?.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  
    {/* Phân trang */}
    <div className="flex justify-center my-4">
      {data.length > 0 && (
        <Pagination
          isCompact
          loop
          showControls
          color="primary"
          total={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      )}
    </div>
  </div>
  
  );
};

export default Manager;
