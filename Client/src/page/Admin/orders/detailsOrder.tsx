// import React from "react";

// import AdminDetailOrder from "../../../components/Admin/feature/orders/detailOrders";

// const listOrdersDetails: React.FC = () => {
//   return (
//     <div className="bg-gray-100 font-family-karla flex">
//       <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
//         <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
//           <AdminDetailOrder />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default listOrdersDetails;
import React from "react";
import AdminDetailOrder from "../../../components/Admin/feature/orders/detailOrders";
import {
  breadcrumbItems,
  ReusableBreadcrumb,
} from "../../../ultils/breadcrumb/admin";

const listOrdersDetails: React.FC = () => {
  return (
    <div>
      <ReusableBreadcrumb items={breadcrumbItems.listDetailOrder} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Chi tiết đơn hàng
        </h1>
      </div>

      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <AdminDetailOrder />
              <nav
                className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                aria-label="Table navigation"
              ></nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default listOrdersDetails;
