import React from "react";
import AdminListRam from "../../../../components/Admin/feature/attribute/ram/getListRam";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
import GetListRam from "../../../../components/Admin/summary/getListRam";
const getListRam: React.FC = () => {

  return (
    <div>
      <ReusableBreadcrumb items={breadcrumbItems.listRam} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Danh sách ram
        </h1>
      </div>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="bg-white dark:bg-gray-800 relative border shadow-md sm:rounded-lg overflow-hidden">
            <GetListRam />
            <div className="overflow-x-auto">
              <AdminListRam />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default getListRam;
