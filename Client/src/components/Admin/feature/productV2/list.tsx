import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaginatedProducts } from "../../../../redux/product/admin/Thunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import { truncateText } from "./truncate/truncateText";
import { handleSoftDeleteProduct } from "./handlers/softDelete";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import SearchFormProduct from "../../../../components/Admin/searchform/searchFomProduct";
import AddProductButton from "../../../../components/Admin/buttonAdd";
import DropdownCRUD from "./dropdown";
import { Chip, Avatar } from "@nextui-org/react";
import { CheckIcon } from "../../../../common/Icons/CheckIcon";
import DropdownVariant from "./dropdownVariant";
const ProductList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm] = useState("");
  const currentPage = useSelector(
    (state: RootState) => state.products.pagilistActive.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.pagilistActive.pagination?.totalPages || 1
  );
  const products = useSelector((state: RootState) => state.products.pagilistActive.products || []);

  useEffect(() => {
    dispatch(fetchPaginatedProducts({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(fetchPaginatedProducts({ page, search: searchTerm }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <SearchFormProduct />
        <AddProductButton type="addProduct" />
      </div>
      {products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-center">
            Không có sản phẩm nào khớp với tìm kiếm của bạn.
          </p>
        </div>
      ) : (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                Biến thể
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
                className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
              >
                <td
                  scope="row"
                  className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="flex items-center mr-3">
                    <img
                      src={product.image[0]}
                      className="w-16 md:w-32 max-w-full max-h-full sm:w-24 sm:min-w-[96px] sm:min-h-[96px]"
                      alt={product.product_name}
                    />

                  </div>
                </td>

                <td className="px-4 py-3">
                  <span>{truncateText(product.product_name, 15)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-4">
                    <Chip
                      variant="flat"
                      color="primary"
                      classNames={{
                        base: "bg-primary-500 from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                        content: "drop-shadow shadow-black text-white",
                      }}
                      avatar={
                        <Avatar

                          name={product.product_type?.name || "N/A"}
                          size="sm"
                          getInitials={(name) => name.charAt(0)}
                        />
                      }
                    >
                      {product.product_type?.name}
                    </Chip>

                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    product.product_price
                  )}
                </td>
                <td className="px-4 py-3 border-b border-grey-light">
                  <div className="flex gap-4">
                    <Chip
                      startContent={<CheckIcon size={18} />}
                      variant="faded"
                      color="success"
                    >
                      {product.status === "active" ? "Hiển thị" : "Đã ẩn"}
                    </Chip>
                  </div>
                </td>
                <td className="px-4 py-3 border-b border-grey-light">
                  <div className="flex gap-4">
                    <DropdownVariant variants={product.variants} />
                  </div>
                </td>

                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center space-x-4">
                    <DropdownCRUD productId={product._id} />
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

export default ProductList;
