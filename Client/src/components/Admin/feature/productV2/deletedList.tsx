import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteListProductThunk } from "../../../../redux/product/admin/Thunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import SyncLoader from "./loading/SyncLoader";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import SearchFomDeletelistProduct from "../../../../components/Admin/searchform/searchFomDeletelistProduct";
import ProductTable from "./productTable/deletetListProduct";
const DeletetListProduct: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm] = useState("");
  const currentPage = useSelector(
    (state: RootState) => state.products.pagiDeletedList.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.pagiDeletedList.pagination?.totalPages || 1
  );
  const products = useSelector((state: RootState) => state.products.pagiDeletedList.products || []);
  const loading = useSelector(
    (state: RootState) => state.products.pagiDeletedList.status === "loading"
  );

  useEffect(() => {
    dispatch(DeleteListProductThunk({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(DeleteListProductThunk({ page, search: searchTerm }));
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
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <SearchFomDeletelistProduct />
      </div>
      {products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
         <p className="text-gray-500 text-center">Không có sản phẩm nào khớp với tìm kiếm của bạn.</p>
        </div>
      ) : (
        <ProductTable
        products={products}
        dispatch={dispatch}
        currentPage={currentPage}
        searchTerm={searchTerm}
      />
      )}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default DeletetListProduct;
