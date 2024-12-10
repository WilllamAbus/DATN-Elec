import React from "react";
import AdminFetImageByVariantId from "../../../../components/Admin/feature/productV2/getImageByVariantId";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
import GetImage_VariantId from "../../../../components/Admin/summary/getImageByVariantId";
const GetImageByVariantId: React.FC = () => {

  return (
    <div>
      <ReusableBreadcrumb items={breadcrumbItems.listproduct} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Danh sách hình ảnh và màu sắc
        </h1>
      </div>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="bg-white dark:bg-gray-800 relative border shadow-md sm:rounded-lg overflow-hidden">
            <GetImage_VariantId />
            <div className="overflow-x-auto">
              <AdminFetImageByVariantId />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetImageByVariantId;
