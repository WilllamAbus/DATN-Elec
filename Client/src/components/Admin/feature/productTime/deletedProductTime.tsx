import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { fetchTimeTracksDeletd, restoreTimeTrackAdminThunk } from "../../../../redux/adminTimeTrack/deleted/deletedTimeProdThunk";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import SearchFormProduct from "./search/searchFormTimeTrack";
import "../../../../assets/css/admin.style.css";
import withReactContent from "sweetalert2-react-content";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer ,toast} from "react-toastify";
import Swal, { SweetAlertResult } from "sweetalert2";
import {TimeTrackRestore} from '../../../../types/adminTimeTrack/restoreTimeTrack'
const MySwal = withReactContent(Swal);

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

const DeletedProductTime: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {timeTrackDeletds , totalPages } = useSelector(
    (state: RootState) => state.adminDeletedTimeProd
  );

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [, setTimeTrack] = useState<TimeTrackRestore[]>([]);
  useEffect(() => {
    dispatch(fetchTimeTracksDeletd({ page, pageSize, search }));
  }, [dispatch, page, pageSize, search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  };

  const handleRestoreTimeTrack = async (id: string) => {
    MySwal.fire({
      title: "Hủy sản phẩm?",
      text: "Bạn có chắc muốn khôi phục sản phẩm này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
 await dispatch(restoreTimeTrackAdminThunk({ id })).unwrap();
      setTimeTrack((prevTimeTrack) =>
        prevTimeTrack.filter((track) => track._id!== id)
      );
      toast.success("Khôi phục sản phẩm thành công");

      }else {
        toast.error("Có lỗi xảy ra khi khôi phục sản phẩm");
      }
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between mx-4 py-4 border-t dark:border-gray-700 space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-grow">
          <SearchFormProduct onSearch={handleSearch} />
        </div>

      
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">Hình ảnh</th>
            <th scope="col" className="p-4">Tên sản phẩm</th>
            <th scope="col" className="p-4">Giờ bắt đầu</th>
            <th scope="col" className="p-4">Giờ kết thúc</th>
            <th scope="col" className="p-4">Trạng thái</th>
            <th scope="col" className="p-4">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {timeTrackDeletds && timeTrackDeletds.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            timeTrackDeletds?.map((track) => (
              <tr key={track._id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center mr-3">
                    <img
                      src={track.product.image[0]}
                      alt={track.product.product_name}
                      className="h-12 w-12 object-cover mr-3"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {track.product.product_name}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {formatDateVN(track.startTime)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {formatDateVN(track.endTime)}
                </td>
                <td className={`inline-flex items-center rounded-md px-2 py-1 mt-5 ml-5 text-xs font-medium ring-1 ring-current ${
                      track.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}>
                {track.status === "active" ? "Hiển thị" : "Đã ẩn"}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center space-x-4">
                    <button onClick={()=>  handleRestoreTimeTrack(track._id)} className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-600-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                      Khôi phục
                    </button>
              
                  </div>
                </td>
              </tr>
            ))
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

export default DeletedProductTime;
