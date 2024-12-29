import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { fetchListBid, fetchBiddingDetails } from "../../../../redux/listBiddings/listBidThunk";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import { Link } from "react-router-dom";

const ListProductTime: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, pagination, loading, error } = useSelector(
    (state: RootState) => state.listBid
  );

  const { details, loading: detailsLoading, error: detailsError } = useSelector(
    (state: RootState) => state.listBidDetails
  );

  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentProductSlug, setCurrentProductSlug] = useState<string | null>(null);

  const pageSize = 5; // Mặc định số item mỗi trang

  // Fetch dữ liệu khi trang thay đổi
  useEffect(() => {
    dispatch(fetchListBid({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  // Fetch bidding details for a product when modal is opened
  useEffect(() => {
    if (currentProductSlug) {
      dispatch(fetchBiddingDetails(currentProductSlug));
    }
  }, [currentProductSlug, dispatch]);

  // Hàm xử lý thay đổi trang
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  // Hàm xử lý mở modal
  const handleViewDetails = (slug: string) => {
    setCurrentProductSlug(slug);
    setShowModal(true); // Show the modal
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProductSlug(null); // Clear product slug when closing modal
  };

  return (
    <div className="py-5 relative">
      <h2 className="text-3xl leading-10 text-black mb-9 flex justify-between items-center">
        Lịch sử lượt đấu giá
      </h2>
      <div className="mt-7 border border-gray-300 pt-9">
        {/* Hiển thị trạng thái loading cho danh sách đấu giá */}
        {loading && <p className="text-center text-gray-600">Đang tải...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="order-item">
          {/* Kiểm tra nếu không có sản phẩm */}
          {products.length === 0 ? (
            <p className="text-center text-gray-600">Không có lịch sử đấu giá nào.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.productId}
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-6 shadow-xl rounded-2xl hover:scale-105 transform transition-all duration-300 ${product?.status === "active"
                    ? "bg-red-500"
                    : product?.status === "ended"
                      ? "bg-gray-500"
                      : "bg-white"
                  }`}
              >
                {/* Nội dung sản phẩm */}
                <div className="flex items-center">
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={product.image || "https://via.placeholder.com/150"}
                      alt={`product ${product.productName}`}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    />
                  </Link>
                  <div className="flex flex-col justify-center sm:ml-4 text-center sm:text-left">
                    <h6 className="font-manrope font-semibold text-lg sm:text-xl leading-7 sm:leading-8 text-indigo-900">
                      {product.productName}
                    </h6>
                  </div>
                </div>

                {/* Nút xem chi tiết */}
                <div className="mr-4">
                  <button
                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => handleViewDetails(product.slug)} // Gọi hàm mở modal
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Phần hiển thị phân trang */}
        <div className="mt-6 flex justify-center">
          <PaginationComponent
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal hiển thị chi tiết đấu giá */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Backdrop with blur effect */}
          <div className="absolute inset-0 bg-gray-100 bg-opacity-50 backdrop-blur-sm"></div>

          {/* Modal content */}
          <div className="bg-white p-6 rounded-lg w-3/4 md:w-1/2 z-10">
            <h3 className="text-2xl font-semibold mb-4">Chi tiết đấu giá</h3>

            {detailsLoading ? (
              <p className="text-center">Đang tải chi tiết đấu giá...</p>
            ) : detailsError ? (
              <p className="text-center text-red-600">Lỗi khi tải chi tiết: {detailsError}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border text-left">Giá Đặt</th>
                      <th className="px-4 py-2 border text-left">Thời Gian Đặt Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details?.data?.userBiddingDetails.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{item.bidPrice} VND</td>
                        <td className="px-4 py-2">{item.bidTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                className="text-white bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg"
                onClick={handleCloseModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ListProductTime;
