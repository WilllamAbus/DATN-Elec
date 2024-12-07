import React, { useState } from "react";
import AdminSoftListVoucher from "../../../components/Admin/feature/vouchers/softDeleVoucher";
import {
  breadcrumbItems,
  ReusableBreadcrumb,
} from "../../../ultils/breadcrumb/admin";
import PaginationComponent from "../../../ultils/pagination/admin/paginationcrud";
import ProductSummary from "../../../components/Admin/summary/ProductSummary";
import SearchFormProduct from "../../../components/Admin/searchform/searchFomProduct";

const listDiscounts: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div>
      <ReusableBreadcrumb items={breadcrumbItems.recycleBinVoucher} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Danh sách xóa mềm
        </h1>
      </div>

      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <ProductSummary />
            <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
              <SearchFormProduct />
            </div>
            <div className="overflow-x-auto">
              <AdminSoftListVoucher />
              <PaginationComponent
                currentPage={currentPage}
                totalPages={5}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default listDiscounts;
