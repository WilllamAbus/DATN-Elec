import React from "react";
import AdminAddDiscount from "../../../components/Admin/feature/vouchers/addVoucher";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../ultils/breadcrumb";
const addDiscounts: React.FC = () => {
  return (
    <div>
      <ReusableBreadcrumb items={breadcrumbItems.addVouchers} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Thêm giảm giá
        </h1>
      </div>

      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800shadow-md sm:rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <AdminAddDiscount />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default addDiscounts;
