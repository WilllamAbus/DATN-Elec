import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaginatedProducts } from "../../../../redux/product/admin/Thunk";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../redux/store";
import { truncateText } from "./truncate/truncateText";
import SyncLoader from "./loading/SyncLoader";
import { handleSoftDeleteProduct } from "./handlers/softDelete";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";

const ProductList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state.products.pagilistActive.pagination?.currentPage || 1);
  const totalPages = useSelector((state: RootState) => state.products.pagilistActive.pagination?.totalPages || 1);
  const products = useSelector((state: RootState) => state.products.pagilistActive.products || []);
  const loading = useSelector((state: RootState) => state.products.pagilistActive.status === "loading");

  useEffect(() => {
    dispatch(fetchPaginatedProducts({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(fetchPaginatedProducts({ page }));
  };

  if (loading) {
    return (
      
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-70 bg-white dark:bg-gray-800">
        <SyncLoader />
      </div>
    );
  }

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">Tên sản phẩm</th>
            <th scope="col" className="p-4">Danh mục</th>
            <th scope="col" className="p-4">Giá gốc</th>
            <th scope="col" className="p-4">Trạng thái</th>
            <th scope="col" className="p-4">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex items-center mr-3">
                  <img src={product.image[0]} className="h-8 w-auto mr-3" alt={product.product_name} />
                  <span>{truncateText(product.product_name, 30)}</span>
                </div>
              </th>
              <td className="px-4 py-3">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                  {product.product_type?.name || "Chưa có loại"}
                </span>
              </td>
              <td className="px-4 py-3">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.product_price)}
              </td>
              <td className="py-4 px-6 border-b border-grey-light">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-current ${product.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {product.status === "active" ? "Hiển thị" : "Đã ẩn"}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => handleSoftDeleteProduct(product._id, dispatch)}
                  >
                    Xoá
                  </button>
                  <Link
                    to={`/admin/editproduct/${product._id}`}
                    className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sửa
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ProductList;
