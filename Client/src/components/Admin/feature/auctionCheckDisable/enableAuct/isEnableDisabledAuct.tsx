import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { getEnableAuctWinner, softDelAdminThunk } from "../../../../../redux/adminEnableAuct/enableAuctThunk";

// import "../../../../assets/css/admin.style.css";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer,  toast} from "react-toastify";
import Swal, { SweetAlertResult } from "sweetalert2";
import PaginationComponent from "../../../../../ultils/pagination/admin/paginationcrud";
import { EnableWinnerAll, EnableWinnerAllSoftDel } from "../../../../../types/adminEnbaleAuct/allEnableAuct";
import SearchFormOrders from "../serachForm/searchForm.isCheck";

import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const IsEnableAuct: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { enableWinnerAll, totalPages } = useSelector(
    (state: RootState) => state.enableAuct
  );

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [search, setSearch] = useState("");

  const [, setEnable] = useState<EnableWinnerAllSoftDel[]>([]);
  useEffect(() => {
    dispatch(getEnableAuctWinner({ page, pageSize, search }));
  }, [dispatch, page, pageSize, search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  };



  // const handleDownloadInvoicePDF = async (orderId: string) => {
  //   try {
  //     await getInvoicePDF(orderId);
  //     toast.success("Tải về thành công!");
  //   } catch (error) {
  //     toast.error("Failed to download the invoice.");
  //     console.error("Error downloading invoice:", error);
  //   }
  // };

    // const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //   const selectedFilter = event.target.value;
    //   setFilter(selectedFilter);
  
    //   dispatch(
    //     getOrders({
    //       page: 1,
    //       search: searchTerm,
    //       stateOrder: selectedFilter === "Tất cả" ? undefined : selectedFilter,
    //     })
    //   );
    // };


      const handleSoftDelEnableAuct = async (id: string) => {
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
            await dispatch(softDelAdminThunk({ id })).unwrap();
            setEnable((prevSoftDel) =>
              prevSoftDel.filter((rand) => rand._id !== id)
            );
            toast.success("Xóa sản phẩm thành công");
          } else {
            toast.error("Có lỗi xảy ra khi xóa sản phẩm");
          }
        });
      };
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between mx-4 py-4 border-t dark:border-gray-700 space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-grow">
        <SearchFormOrders onSearch={handleSearch} />
        </div>
     
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
               STT
            </th>
            <th scope="col" className="p-4">
              NGƯỜI DÙNG
            </th>
            <th scope="col" className="p-4">
              EMAIL
            </th>
            <th scope="col" className="p-4">
              SỐ ĐIỆN THOẠI
            </th>
            <th scope="col" className="p-4">
              VỊ THẾ 
            </th>
            <th scope="col" className="p-4">
              CẢNH BÁO
            </th>
            <th scope="col" className="p-4">
              TRẠNG THÁI
            </th>
            <th scope="col" className="p-4">
              CHỨC NĂNG
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(enableWinnerAll) && enableWinnerAll.length > 0 ? (
            enableWinnerAll?.map((winnneerCheck: EnableWinnerAll) => (
              <tr
                key={winnneerCheck._id}
                className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {winnneerCheck.serialNumber}
                </td>
                <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                  {winnneerCheck.userWinnerAuct.name}
                </th>
                <td className="py-4 px-6 border-b border-grey-light">
                  {winnneerCheck.userWinnerAuct.email}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">
                  {winnneerCheck.userWinnerAuct.phone}
                </td>
                <td  className={`inline-flex items-center rounded-md px-2 py-1 mt-5 ml-5 text-xs font-medium ring-1 ring-current ${
                    winnneerCheck.auctionReturnStatus === "canceled"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {winnneerCheck.auctionReturnStatus === "canceled" ? "Hủy chiến thắng đấu giá" : "Khóa tài khoản"}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">
                  {winnneerCheck.coundDisabledAuction}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">
                  <span
                    className={`mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${
                      winnneerCheck.auctionStausIsCheck === "Đã duyệt hủy chiến thắng"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : winnneerCheck.auctionStausIsCheck === "Cảnh báo đầu tiên"
                        ? "bg-violet-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : winnneerCheck.auctionStausIsCheck === "Cảnh báo cuối cùng"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : winnneerCheck.auctionStausIsCheck === "Khóa tài khoản"
                        ? "bg-orange-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                     
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {winnneerCheck.auctionStausIsCheck === "Đã duyệt hủy chiến thắng" && (
                      <svg
                        className="me-1 h-3 w-3"
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
                          stroke-width="2"
                          d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                        />
                      </svg>
                    )}
                    {winnneerCheck.auctionStausIsCheck === "Cảnh báo đầu tiên" && (
                      <svg
                        className="me-1 h-3 w-3"
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
                          stroke-width="2"
                          d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                        />
                      </svg>
                    )}

                
                    {winnneerCheck.auctionStausIsCheck === "Cảnh báo cuối cùng" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        className="me-1 h-4 w-4"
                        x="0px"
                        y="0px"
                        viewBox="0 0 29 37.5"
                      >
                        <g transform="translate(-270 -380)">
                          <g xmlns="http://www.w3.org/2000/svg">
                            <path d="M281.5,382l-11.5,6.64v12l11,6.351l0.5,0.289l0.5-0.289l2.618-1.512c1.152,2.66,3.799,4.521,6.882,4.521    c4.143,0,7.5-3.357,7.5-7.5c0-3.629-2.576-6.654-6-7.35v-6.511L281.5,382z M281.5,383.154l10,5.774l-4.5,2.599l-10-5.774    L281.5,383.154z M281,405.836l-10-5.773v-10.269l10,5.774V405.836z M281.5,394.702l-10-5.773l4.5-2.599l10.001,5.773    L281.5,394.702z M282,405.836v-10.268l10-5.774v5.231c-0.166-0.011-0.331-0.025-0.5-0.025c-4.143,0-7.5,3.357-7.5,7.5    c0,0.7,0.104,1.375,0.283,2.018L282,405.836z M298,402.5c0,3.59-2.91,6.5-6.5,6.5s-6.5-2.91-6.5-6.5s2.91-6.5,6.5-6.5    S298,398.91,298,402.5z" />
                            <polygon points="287.965,402.146 287.258,402.854 290.086,405.682 295.742,400.025 295.035,399.318 290.086,404.268   " />
                          </g>
                        </g>
                        <text
                          x="0"
                          y="45"
                          fill="#000000"
                          font-size="5px"
                          font-weight="bold"
                          font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
                        ></text>
                        <text
                          x="0"
                          y="50"
                          fill="#000000"
                          font-size="5px"
                          font-weight="bold"
                          font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
                        ></text>
                      </svg>
                    )}

                    {winnneerCheck.auctionStausIsCheck === "Khóa tài khoản" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        className="me-1 h-4 w-4"
                        x="0px"
                        y="0px"
                        viewBox="0 0 29 37.5"
                      >
                        <g transform="translate(-270 -380)">
                          <g xmlns="http://www.w3.org/2000/svg">
                            <path d="M281.5,382l-11.5,6.64v12l11,6.351l0.5,0.289l0.5-0.289l2.618-1.512c1.152,2.66,3.799,4.521,6.882,4.521    c4.143,0,7.5-3.357,7.5-7.5c0-3.629-2.576-6.654-6-7.35v-6.511L281.5,382z M281.5,383.154l10,5.774l-4.5,2.599l-10-5.774    L281.5,383.154z M281,405.836l-10-5.773v-10.269l10,5.774V405.836z M281.5,394.702l-10-5.773l4.5-2.599l10.001,5.773    L281.5,394.702z M282,405.836v-10.268l10-5.774v5.231c-0.166-0.011-0.331-0.025-0.5-0.025c-4.143,0-7.5,3.357-7.5,7.5    c0,0.7,0.104,1.375,0.283,2.018L282,405.836z M298,402.5c0,3.59-2.91,6.5-6.5,6.5s-6.5-2.91-6.5-6.5s2.91-6.5,6.5-6.5    S298,398.91,298,402.5z" />
                            <polygon points="287.965,402.146 287.258,402.854 290.086,405.682 295.742,400.025 295.035,399.318 290.086,404.268   " />
                          </g>
                        </g>
                        <text
                          x="0"
                          y="45"
                          fill="#000000"
                          font-size="5px"
                          font-weight="bold"
                          font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
                        ></text>
                        <text
                          x="0"
                          y="50"
                          fill="#000000"
                          font-size="5px"
                          font-weight="bold"
                          font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
                        ></text>
                      </svg>
                    )}
                    {winnneerCheck.auctionStausIsCheck}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-4">
                    {/* <button
                      className={`flex items-center border font-medium rounded-lg text-sm px-3 py-2 text-center ${
                        order.stateOrder === "Chờ xử lý"
                          ? "text-yellow-700 bg-yellow-200 hover:text-white border-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:border-yellow-500 dark:text-yellow-500 dark:hover:text-white dark:hover:bg-yellow-600 dark:focus:ring-yellow-900"
                       
                          : order.stateOrder === "Hủy đơn hàng" 
                          ? "text-red-700 bg-red-200 hover:text-white border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                          : "text-gray-500 bg-gray-200 border-gray-500 cursor-not-allowed dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
                      }`}
                      onClick={() => {
                        if (
                          order.stateOrder === "Chờ xử lý" 
                        ) {
                          handleSoftDelOrder(order._id);
                        }
                      }}
            
                      style={{ display: order.stateOrder === "Chờ xử lý" ? ' inline-flex ' : 'none' }}
                    >
                      Hủy đơn hàng
                    </button> */}
                        {winnneerCheck.coundDisabledAuction === 4 && (
                      <button
                        onClick={() => handleSoftDelEnableAuct(winnneerCheck._id)}
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
                        Hủy
                      </span>
                      </button>
                    )}
                    <Link to={`/admin/detailEnable/${winnneerCheck._id}`}>
                      {/* SVG Icon embedded directly */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12c0 5 9 9 9 9s9-4 9-9-9-9-9-9-9 4-9 9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                        />
                      </svg>
                      {/* Xem chi tiết */}
                    </Link>
                
                  </div>
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
      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ToastContainer />
    </>
  );
};

export default IsEnableAuct;
