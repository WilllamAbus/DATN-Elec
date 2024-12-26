import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import {
  fetchPriceRandDeleted,
  restorePriceRandAdminThunk,
  softDelPriceRandAdminThunk
} from "../../../../redux/adminPriceRandAuc/deletedPriceRandAuct/deletedPriceRandAuctThunk";

import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import SearchFormProduct from "./searchForm/searchFormPriceRand";
import "../../../../assets/css/admin.style.css";
import { Link } from "react-router-dom";
import { PriceRangeRestoreAuct, PriceRangeAuctSoftDel } from "../../../../types/adminPriceRandAuct/deletePriceRandAuct";
import withReactContent from "sweetalert2-react-content";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Swal, { SweetAlertResult } from "sweetalert2";

const MySwal = withReactContent(Swal);
// Hàm để định dạng thời gian theo giờ Việt Nam
import currencyFormatter from "currency-formatter";
function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}

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
const ListPriceRandRecy: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { deletedPriceRandAuct, totalPages } = useSelector(
    (state: RootState) => state.deletedPriceRand
  );

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [autoActivated, setAutoActivated] = useState<{ [key: string]: boolean }>({});
  const [, setPriceRand] = useState<PriceRangeRestoreAuct[]>([]);
  const [, setPriceRandSoft] = useState<PriceRangeAuctSoftDel[]>([]);
  useEffect(() => {
    dispatch(fetchPriceRandDeleted({ page, pageSize, search }));
  }, [dispatch, page, pageSize, search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  };




  const handleSoftDelPriceRand = async (id: string) => {
    MySwal.fire({
      title: "Hủy sản phẩm?",
      text: "Bạn có chắc muốn hủy sản phẩm này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        await dispatch(softDelPriceRandAdminThunk({ id })).unwrap();
        setPriceRandSoft((prevSoftDel) =>
          prevSoftDel.filter((rand) => rand._id !== id)
        );
        toast.success("Xóa sản phẩm thành công");
      } else {
        toast.error("Có lỗi xảy ra khi xóa sản phẩm");
      }
    });
  };
  const autoTriggerPriceRand = async (id: string) => {
    try {
      await dispatch(restorePriceRandAdminThunk({ id })).unwrap();
      setPriceRand((prevSoftDel) =>     prevSoftDel.filter((rand) => rand._id!== id));

      setAutoActivated((prev) => ({ ...prev, [id]: true }));
      toast.success("Đưa sản phẩm lên phiên thành công");
    } catch (error) {
      toast.error(`Tự động kích hoạt thất bại cho sản phẩm ${id}`);
    }
  };

  useEffect(() => {
    const now = new Date().getTime();

    // Đặt trạng thái ban đầu
    const initialActivated: { [key: string]: boolean } = {};
    deletedPriceRandAuct.forEach((rand) => {
      const startTime = new Date(rand.startTime).getTime();
      if (now >= startTime) {
        initialActivated[rand._id] = true;
        autoTriggerPriceRand(rand._id); // Tự động kích hoạt nếu đã đến thời gian
      }
    });
    setAutoActivated(initialActivated);

    // Đặt timeout cho các sản phẩm chưa kích hoạt
    const timeouts = deletedPriceRandAuct
      .filter((rand) => new Date(rand.startTime).getTime() > now)
      .map((rand) => {
        const delay = new Date(rand.startTime).getTime() - now;
        return setTimeout(() => {
          setAutoActivated((prev) => ({ ...prev, [rand._id]: true }));
          autoTriggerPriceRand(rand._id); // Tự động kích hoạt khi đến thời gian
        }, delay);
      });

    return () => {
      // Xóa timeout khi component unmount
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [deletedPriceRandAuct]);
  //   const handleDeletePriceRand = async (id: string) => {
  //     MySwal.fire({
  //       title: "Hủy sản phẩm?",
  //       text: "Bạn có chắc muốn hủy sản phẩm này không?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Có",
  //       cancelButtonText: "Hủy",
  //     }).then(async (result: SweetAlertResult) => {
  //       if (result.isConfirmed) {
  //  await dispatch(deletePriceRandAdminThunk({ id })).unwrap();
  //  setPriceRandAuct((prevSoftDel) =>
  //   prevSoftDel.filter((rand) => rand._id!== id)
  //       );
  //       toast.success("Hủy sản phẩm thành công");

  //       }else {
  //         toast.error("Có lỗi xảy ra khi xóa sản phẩm");
  //       }
  //     });
  //   };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between mx-4 py-4 border-t dark:border-gray-700 space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-grow">
          <SearchFormProduct onSearch={handleSearch} />
        </div>
        <div className="flex-shrink-0">
          <Link
            to="/admin/addPriceRandAuct"
            id="createProductButton"
            className="inline-flex items-center justify-center text-white bg-blue-500 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            style={{ height: "40px", display: "flex", alignItems: "center" }}
          >
            <svg
              className="h-4 w-4 mr-1.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              />
            </svg>
            Mở phiên đấu giá
          </Link>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              STT
            </th>
            <th scope="col" className="p-4">
              Hình ảnh
            </th>
            <th scope="col" className="p-4">
              Tên sản phẩm
            </th>
            <th scope="col" className="p-4">
              Giá khởi điểm (đ)
            </th>
            <th scope="col" className="p-4">
              Giá tối đa (đ)
            </th>
            <th scope="col" className="p-4">
              Bước giá (đ)
            </th>
            <th scope="col" className="p-4">
              Thời gian bắt đầu{" "}
            </th>
            <th scope="col" className="p-4">
              Thời gian kết thúc{" "}
            </th>
            <th scope="col" className="p-4">
              Trạng thái
            </th>
            <th scope="col" className="p-4">
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody>
          {deletedPriceRandAuct && deletedPriceRandAuct.length > 0 ? (
            deletedPriceRandAuct.map((rand) => (
              <tr
                key={rand._id}
                className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {rand.serialNumber}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center mr-3">
                    <img
                      src={rand.product.image[0]}
                      className="h-12 w-12 object-cover mr-3"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {rand.product.product_name}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {formatCurrency(rand.startingPrice)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {formatCurrency(rand.maxPrice)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {formatCurrency(rand.priceStep)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {formatDateVN(rand.startTime)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {formatDateVN(rand.endTime)}
                </td>
                <td
                  className={`inline-flex items-center rounded-md px-2 py-1 mt-5 ml-5 text-xs font-medium ring-1 ring-current ${
                    rand.status === "active"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {rand.status === "active" ? "Hiển thị" : "Đã ẩn"}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center space-x-4">
                  {autoActivated[rand._id] ? (
                <span className="group relative flex items-center text-blue-700 bg-blue-200 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900">Đã kích hoạt</span>
              ) : (
                <span className="group relative flex items-center text-blue-700 bg-blue-200 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900">Chưa đến thời gian</span>
              )}
                    {/* <button
                      onClick={() => handleTriggerPriceRand(rand._id)}
                      className="group relative flex items-center text-blue-700 bg-blue-200 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-10 h-3 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 12a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12"
                        />
                      </svg>
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-white transition-opacity duration-300">
                        Kích hoạt
                      </span>
                    </button> */}

                    <Link
                      to={`/admin/editPriceRandAuct/${rand._id}`}
                      className="group relative py-2 px-3 flex items-center justify-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.066 19.646a4.5 4.5 0 01-1.682 1.062l-3.248 1.083 1.083-3.248a4.5 4.5 0 011.062-1.682L16.862 3.487z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 6.75L17.25 13.5"
                        />
                      </svg>
                      <span
                        className="absolute top-1/2 
                      left-1/2 -translate-x-1/2 
                      -translate-y-1/2 opacity-0
                       group-hover:opacity-100 text-[10px] text-white
                       transition-opacity duration-300"
                      >
                        Sửa
                      </span>
                    </Link>
                    <button
                      onClick={() => handleSoftDelPriceRand(rand._id)}
                      className="group relative flex items-center text-red-700
                       bg-red-200 hover:text-white border
                        border-red-700 hover:bg-red-800 focus:ring-4
                         focus:outline-none focus:ring-red-300 font-medium 
                      rounded-lg text-sm px-2 py-2 text-center 
                      dark:border-red-500 dark:text-red-500 
                      dark:hover:text-white dark:hover:bg-red-600 
                      dark:focus:ring-red-900"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span
                        className="absolute top-1/2 
                      left-1/2 -translate-x-1/2 
                      -translate-y-1/2 opacity-0
                       group-hover:opacity-100 text-[10px] text-white
                       transition-opacity duration-300"
                      >
                        Xóa
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ToastContainer />
    </>
  );
};

export default ListPriceRandRecy;
