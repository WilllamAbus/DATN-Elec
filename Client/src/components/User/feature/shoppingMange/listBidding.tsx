import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { fetchListBid } from "../../../../redux/listBiddings/listBidThunk";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";

import "../../../../assets/css/admin.style.css";

// Hàm để định dạng thời gian theo giờ Việt Nam
const formatDateVN = (dateString: string) => {
  const date = new Date(dateString); // Chuyển đổi chuỗi thành đối tượng Date
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh", // Thiết lập múi giờ
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

const ListProductTime: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { Bidding, totalPages } = useSelector(
    (state: RootState) => state.listBid
  );

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [search] = useState("");

  useEffect(() => {
    dispatch(fetchListBid({ page, pageSize, search }));
  }, [dispatch, page, pageSize, search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <div className="py-5 relative">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <h2 className=" text-3xl leading-10 text-black mb-9">Lịch sử lệnh đấu giá</h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    Hình ảnh
                  </th>
                  <th scope="col" className="p-4">
                    Tên sản phẩm
                  </th>
                  <th scope="col" className="p-4">
                    Người dùng
                  </th>
                  <th scope="col" className="p-4">
                    Giá
                  </th>
                  <th scope="col" className="p-4">
                    Thời gian{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Bidding && Bidding.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No products found
                    </td>
                  </tr>
                ) : (
                  Bidding?.map((trackBid) => (
                    <tr
                      key={trackBid._id}
                      className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center mr-3">
                          <img
                            src={trackBid.product.image[0]}
                            alt={trackBid.product.product_name}
                            className="h-12 w-12 object-cover mr-3"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {trackBid.product.product_name}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {trackBid.biddingUserObj.name}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {trackBid.bidAmount.toLocaleString()} VNĐ
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {formatDateVN(trackBid.bidTime)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ListProductTime;
