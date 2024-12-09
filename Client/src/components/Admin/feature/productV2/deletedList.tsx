import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteListProductThunk } from "../../../../redux/product/admin/Thunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import SearchFomDeletelistProduct from "../../../../components/Admin/searchform/searchFomDeletelistProduct";
import ProductTable from "./productTable/deletetListProduct";
import SearchMessage from "./searchMessage"; 
import NoProductsMessage from "./noProduct"; 
import { Pagination } from "@nextui-org/react";

const DeletetListProduct: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(""); 
  const currentPage = useSelector(
    (state: RootState) => state.products.pagiDeletedList.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.pagiDeletedList.pagination?.totalPages || 1
  );
  const products = useSelector((state: RootState) => state.products.pagiDeletedList.products || []);


  useEffect(() => {
    dispatch(DeleteListProductThunk({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(DeleteListProductThunk({ page, search: searchTerm }));
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term); 
  };



  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <SearchFomDeletelistProduct onSearchChange={handleSearchChange} /> 
      </div>
      {products.length === 0 && searchTerm ? (
        <SearchMessage /> 
      ) : products.length === 0 ? (
        <NoProductsMessage /> 
      ) : (
        <ProductTable
          products={products}
          dispatch={dispatch}
          currentPage={currentPage}
          searchTerm={searchTerm}
        />
      )}
      {totalPages > 1 && (
        <div className="flex justify-center my-4">
          <Pagination
            isCompact
            loop
            showControls
            color="primary"
            total={totalPages}
            initialPage={currentPage}
            onChange={(page) => handlePageChange(page)}
          />
        </div>
      )}
    </>
  );
};

export default DeletetListProduct;
