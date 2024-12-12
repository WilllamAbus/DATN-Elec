import React, { useEffect, useState } from "react";
import { listSuppliers, softDeleteSupplier, searchSuppliers } from "../../../../services/supplier/crudSuppliers.service";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate, useLocation } from "react-router-dom";

const MySwal = withReactContent(Swal);


const supplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Thêm state để lưu từ khóa tìm kiếm
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page") || "1", 10);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setIsSearching(true);

      try {
        const queryParams = new URLSearchParams(location.search);
        const keyword = queryParams.get("keyword") || ""; // Lấy từ khóa từ URL
        const page = parseInt(queryParams.get("page") || "1", 10);

        // Gọi API tùy theo có từ khóa hay không
        const response = keyword.trim()
          ? await searchSuppliers(keyword, page)
          : await listSuppliers(page);

        if (response && response.data) {
          setSuppliers(response.data);
          setTotalPages(response.totalPages);
          setSearchTerm(keyword); // Cập nhật state của searchTerm để giữ input đồng bộ với URL
        } else {
          setError("Dữ liệu không hợp lệ từ server.");
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setError("Lỗi khi tìm kiếm nhà cung cấp.");
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    fetchSuppliers();
  }, [location.search]); // Theo dõi sự thay đổi của URL để gọi lại API

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn việc tải lại trang
    setIsSearching(true);

    try {
      const url = new URL(window.location.href);

      if (searchTerm.trim()) {
        // Nếu có từ khóa, thêm từ khóa vào URL
        url.searchParams.set('keyword', searchTerm.trim());
      } else {
        // Nếu không có từ khóa, xóa tham số keyword khỏi URL
        url.searchParams.delete('keyword');
      }

      // Khi tìm kiếm, luôn bắt đầu từ trang 1
      url.searchParams.set('page', "1");
      window.history.pushState({}, '', url.toString());

      // Gọi API tìm kiếm hoặc lấy danh sách nhà cung cấp
      const response = searchTerm.trim()
        ? await searchSuppliers(searchTerm.trim(), 1)  // Luôn tìm từ trang 1 khi có từ khóa
        : await listSuppliers(1);  // Nếu không có từ khóa, trả về trang đầu tiên của danh sách

      // Kiểm tra dữ liệu phản hồi trước khi cập nhật state
      if (response && response.data) {
        setSuppliers(response.data);
        setTotalPages(response.totalPages);
      } else {
        setError("Dữ liệu không hợp lệ từ server.");
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setError("Lỗi khi tìm kiếm nhà cung cấp.");
    } finally {
      setIsSearching(false);
    }
  };

  const handlesoftDeleteSupplier = async (supplierId: string) => {
    MySwal.fire({
      title: "Xóa nhà cung cấp?",
      text: "Bạn có chắc muốn xóa nhà cung cấp này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await softDeleteSupplier(supplierId);
          setSuppliers(suppliers.filter((supplier) => supplier._id !== supplierId));
          MySwal.fire({
            title: "Đã xóa!",
            text: "Nhà cung cấp đã bị xóa.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting suppliers:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi xóa nhà cung cấp.",
            icon: "error",
          });
        }
      }
    });
  };

  const handlePageChange = (page: number) => {
    // Cập nhật URL khi trang thay đổi
    navigate(`?page=${page}`);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="flex-1 flex items-center space-x-2">
          <h5>
            <span className="text-gray-500">Tổng có: </span>
            <span className="dark:text-white"> {suppliers.length}</span>
          </h5>
          <h5 className="text-gray-500 dark:text-gray-400 ml-1">Nhà cung cấp</h5>
        </div>
      </div> */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <div className="w-full md:w-1/2">
          <form className="flex items-center" onSubmit={handleSearch}>
            <label htmlFor="simple-search" className="sr-only">
              Tìm
            </label>
            <div className="relative w-full">
              <input
                id="simple-search"
                type="search"
                value={searchTerm} // Gắn state searchTerm vào input
                onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm khi người dùng nhập liệu
                className="w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Tìm kiếm"

              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute inset-y-0 right-0 flex items-center p-2 text-white bg-blue-500 border border-gray-300 rounded-r-md"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.795 13.408l5.204 5.204a1 1 0 01-1.414 1.414l-5.204-5.204a7.5 7.5 0 111.414-1.414zM8.5 14A5.5 5.5 0 103 8.5 5.506 5.506 0 008.5 14z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <Link
            to="/admin/addSuppliers"
            id="createProductButton"
            data-modal-toggle="createProductModal"
            className="flex items-center justify-center text-white bg-blue-500 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          >
            <svg
              className="h-3.5 w-3.5 mr-1.5 -ml-1"
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
            Thêm nhà cung cấp
          </Link>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {/* <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  checkbox
                </label>
              </div>
            </th> */}
            <th scope="col" className="p-4">
              Tên nhà cung cấp
            </th>
            <th scope="col" className="p-4">
              Địa chỉ
            </th>
            <th scope="col" className="p-4">
              Số điện thoại
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
          {suppliers.map((supplier) => (
            <tr key={supplier._id} className="hover:bg-grey-lighter">
              {/* <td className="p-4 w-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td> */}
              <th
                scope="row"
                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <div className="flex items-center mr-3">
                  <img src={supplier.image} className="h-8 w-auto mr-3" />
                  {supplier.name}
                </div>
              </th>
              <td className="px-4 py-3">{supplier.address}</td>
              <td className="px-4 py-3">{supplier.phone}</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-[#ffffff] bg-[#1bc24e] ring-1 ring-current">
                  {supplier.status === "active" ? "Hiển thị" : "Đã ẩn"}
                </span>
              </td>

              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex items-center space-x-4">
                  <button
                    className="flex items-center text-[#C20E4D] bg-gray-100 hover:bg-gray-200 border border-red-700  focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => handlesoftDeleteSupplier(supplier._id)}
                  >
                    Xoá
                  </button>
                  <Link
                    to={`/admin/editSuppliers/${supplier._id}`}
                    className="py-2 px-3 flex items-center text-sm font-medium text-center rounded-lg text-success bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sửa
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <button
                onClick={() => handlePageChange(index + 1)}
                className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${currentPage === index + 1
                  ? "text-primary-600 bg-primary-50 border border-primary-300"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default supplierList;
