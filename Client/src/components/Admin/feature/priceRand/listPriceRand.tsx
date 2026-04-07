import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { fetchPriceRand, softDelPriceRandAdminThunk } from "../../../../redux/adminPriceRand/list/listPriceRandThunk";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import SearchFormProduct from "./searchForm/searchFormPriceRand";
import "../../../../assets/css/admin.style.css";
import { Link } from "react-router-dom";
import {PriceRangeSoftDel} from '../../../../types/adminPriceRand/softDelPriceRand'
import withReactContent from "sweetalert2-react-content";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer ,toast} from "react-toastify";
import Swal, { SweetAlertResult } from "sweetalert2";
const MySwal = withReactContent(Swal);
// Hàm để định dạng thời gian theo giờ Việt Nam


const ListPriceRand: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { listPriceRand,  totalPages } = useSelector(
    (state: RootState) => state.adminListPriceRand
  );

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [, setPriceRand] = useState<PriceRangeSoftDel[]>([]);
  useEffect(() => {
    dispatch(fetchPriceRand({ page, pageSize, search }));
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
 setPriceRand((prevSoftDel) =>
  prevSoftDel.filter((rand) => rand._id!== id)
      );
      toast.success("Xóa sản phẩm thành công");

      }else {
        toast.error("Có lỗi xảy ra khi xóa sản phẩm");
      }
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between mx-4 py-4 border-t dark:border-gray-700 space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-grow">
          <SearchFormProduct onSearch={handleSearch} />
        </div>

        <div className="flex-shrink-0">
          <Link
            to="/admin/addPriceRand"
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
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="p-4">Hình ảnh</th>
          <th scope="col" className="p-4">Tên sản phẩm</th>
          <th scope="col" className="p-4">Giá thấp nhất (VNĐ)</th>
          <th scope="col" className="p-4">Giá trung bình (VNĐ)</th>
          <th scope="col" className="p-4">Giá cao nhất (VNĐ)</th>
          <th scope="col" className="p-4">Giá kích hoạt (VNĐ)</th>
          <th scope="col" className="p-4">Trạng thái</th>
          <th scope="col" className="p-4">Chức năng</th>
        </tr>
      </thead>
      <tbody>
        {listPriceRand && listPriceRand.length > 0 ? (
          listPriceRand.map((rand) => (
            <tr key={rand._id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex items-center mr-3">
                  <img
                    src={rand.product.image[0]}
                    className="h-12 w-12 object-cover mr-3"
                  />
                </div>
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                {rand.product_randBib.product_name}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {rand.minBid.toLocaleString()} 
              </td>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {rand.midBid.toLocaleString()} 
              </td>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {rand.maxBid.toLocaleString()} 
              </td>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {rand.bidInput.toLocaleString()} 
              </td>
              <td className={`inline-flex items-center rounded-md px-2 py-1 mt-5 ml-5 text-xs font-medium ring-1 ring-current ${
                      rand.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}>
                {rand.status === "active" ? "Hiển thị" : "Đã ẩn"}
                </td>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex items-center space-x-4">
                  <button onClick={()=>  handleSoftDelPriceRand(rand._id)} className="lex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                    Xóa
                  </button>
                
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8} className="text-center py-4">Không có dữ liệu</td>
          </tr>
        )}
      </tbody>
    </table>

      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ToastContainer/>
    </>
  );
};

export default ListPriceRand;
