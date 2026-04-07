import React from "react";
import AdminListOrderAuction from "../../../components/Admin/feature/orderAuctions/listOrdderAuction"
import { breadcrumbItems, ReusableBreadcrumb } from "../../../ultils/breadcrumb/admin";

import ProductSummary from "../../../components/Admin/summary/ProductSummary";

const listOrderAuction: React.FC = () => {


 
  return (
    <div>
      <ReusableBreadcrumb items={breadcrumbItems.listOrderGeneral} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Danh sách đơn hàng đấu giá
        </h1>
      </div>

      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <ProductSummary />
        
            <div className="overflow-x-auto">
              <AdminListOrderAuction />
       
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default listOrderAuction;