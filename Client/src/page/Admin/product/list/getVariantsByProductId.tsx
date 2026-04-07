import React from "react";
import AdminFetVariantsByProductId from "../../../../components/Admin/feature/productV2/getVariantsByProductId";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
import GetVariantByProductId from "../../../../components/Admin/summary/getVariantByProductId";
const GetVariantsByProductId: React.FC = () => {

  return (
    <div>
      <ReusableBreadcrumb items={breadcrumbItems.listproduct} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Danh sách sản phẩm biến thể
        </h1>
      </div>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="bg-white dark:bg-gray-800 relative border shadow-md sm:rounded-lg overflow-hidden">
            <GetVariantByProductId />
            <div className="overflow-x-auto">
              <AdminFetVariantsByProductId />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetVariantsByProductId;
