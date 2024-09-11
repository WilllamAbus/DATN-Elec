import React, { useEffect, useState } from "react";
import { listInventory } from "../../../../services/inventory/crudInventory.service";
// import Swal, { SweetAlertResult } from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate, useLocation } from "react-router-dom";


// const MySwal = withReactContent(Swal);

const InventoryList: React.FC = () => {
  const [inventories, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page") || "1", 10);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await listInventory(currentPage);
        console.log(response.data);
        setInventory(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        setError("Error fetching inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    // Cập nhật URL khi trang thay đổi
    navigate(`?page=${page}`);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
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
            </th>
            <th scope="col" className="p-4">Tên sản phẩm</th>
            <th scope="col" className="p-4">Tên nhà cung cấp</th>
            <th scope="col" className="p-4">Số lượng kho</th>
            <th scope="col" className="p-4">Số lượng kệ</th>
            <th scope="col" className="p-4">Giá tiền</th>
            <th scope="col" className="p-4">Trạng thái kệ</th>
          </tr>
        </thead>
        <tbody>
          {inventories && inventories.length > 0 ? (
            inventories.map((inventory) => {
              const { product, supplier, quantityStock, quantityShelf, price, _id } = inventory;

              let buttonText = "Còn trống";
              let buttonClass =
                "py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800";
              let buttonDisabled = false;
              let quantityWarning = "";

              if (quantityShelf <= 5) {
                quantityWarning = "Cần nhập thêm hàng!";
              } else if (quantityShelf >= 30) {
                buttonText = "Kệ đầy";
                buttonClass =
                  "py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-gray-400 rounded-lg cursor-not-allowed";
                buttonDisabled = true;
              }

              return (
                <tr key={_id} className="hover:bg-grey-lighter">
                  <td className="p-4 w-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-search-${_id}`}
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor={`checkbox-table-search-${_id}`} className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {product.product_name}
                  </td>
                  <td className="px-4 py-3">{supplier.name}</td>
                  <td className="px-4 py-3">{quantityStock}</td>
                  <td className="px-4 py-3">
                    {quantityShelf}
                    {quantityWarning && (
                      <p className="text-red-500 text-xs italic">{quantityWarning}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">{price}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex items-center space-x-4">
                      {buttonDisabled ? (
                        <span className={buttonClass}>{buttonText}</span>
                      ) : (
                        <Link
                          to={`/admin/addInventory`}
                          className={buttonClass}
                        >
                          {buttonText}
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-4">
                Không có kho hàng nào để hiển thị
              </td>
            </tr>
          )}
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


export default InventoryList;
