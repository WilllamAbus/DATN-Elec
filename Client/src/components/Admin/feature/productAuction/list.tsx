import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProductAuctionThunk } from "../../../../redux/product/admin/Thunk";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../redux/store";
import { truncateText } from "../productV2/truncate/truncateText";
import { handleSoftDeleteProduct } from "../productAuction/handlers/softDelete";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import SearchFomAuctionProduct from "../../../../components/Admin/searchform/searchFomAuctionProduct";
import AddProductButton from "../../../../components/Admin/buttonAdd";

const ProductListAuction: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm] = useState("");
  const currentPage = useSelector(
    (state: RootState) => state.products.LimitProductAuction.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.LimitProductAuction.pagination?.totalPages || 1
  );
  const products = useSelector((state: RootState) => state.products.LimitProductAuction.products || []);

  useEffect(() => {
    dispatch(listProductAuctionThunk({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(listProductAuctionThunk({ page, search: searchTerm }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <SearchFomAuctionProduct />
        <AddProductButton type="addProductAuction" />
      </div>
      {products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-center">
            Không có sản phẩm nào khớp với tìm kiếm của bạn.
          </p>
        </div>
      ) : (
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
                Danh mục
              </th>
              <th scope="col" className="p-4">
                Giá gốc
              </th>
              <th scope="col" className="p-4">
                Trạng thái
              </th>
              <th scope="col" className="p-4">
                Chức năng
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <th
                  scope="row"
                  className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="flex items-center mr-3">
                    <img
                      src={product.image[0]}
                      className="h-12 w-12 object-cover mr-3"
                      alt={product.product_name}
                    />
                  </div>
                </th>
                <td className="px-4 py-3">
                <span>{truncateText(product.product_name, 15)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                    {product.product_type?.name || "Chưa có loại"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    product.product_price
                  )}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-current ${
                      product.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {product.status === "active" ? "Hiển thị" : "Đã ẩn"}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                      onClick={() =>
                        handleSoftDeleteProduct(product._id, dispatch, currentPage, searchTerm)
                      }
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M17 6h5v2h-2v13a1 1 0 01-1 1H5a1 1 0 01-1-1V8H2V6h5V3a1 1 0 011-1h8a1 1 0 011 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" />
                      </svg>
                    </button>
                    <Link
                      to={`/admin/edit-product-auction/${product._id}`}
                      className="py-2 px-2 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
                        <path d="M16 2.012l3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z" />
                      </svg>
                    </Link>
                    <Link
                      to={`/admin/product/${product._id}/addvariant`}
                      className="py-2 px-2 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        height="1em"
                        width="1em"
                        className="mr-2"
                      >
                        <path d="M5 5h2v2H5V5M1 1h10v10H1V1m2 2v6h6V3H3m2 14h2v2H5v-2m-4-4h10v10H1V13m2 2v6h6v-6H3m10-2h4v2h2v-2h4v2h-4v2h4v6h-4v-2h-4v2h-2v-2h2v-2h-2v-6m8 8v-2h-2v2h2m-2-4h-2v-2h-2v4h4v-2m3.7-13.65l-1 1-2.05-2 1-1c.2-.21.54-.22.77 0l1.28 1.23c.21.2.22.54 0 .77M13 8.94l6.07-6.06 2.05 2.05L15.06 11H13V8.94z" />
                      </svg>
                    </Link>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ProductListAuction;
