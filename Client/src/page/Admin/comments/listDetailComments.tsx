import React from "react";
import ListDetailComment from "../../../components/Admin/feature/comment/listDetailComment";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../ultils/breadcrumb/admin";
import SearchFormProduct from "../../../components/Admin/searchform/searchFomProduct";
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify";
const ListComments: React.FC = () => {
  
  return (
    <div>
      <ReusableBreadcrumb items={breadcrumbItems.listComments} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Danh sách bình luận
        </h1>
      </div>

      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 ">
              <SearchFormProduct />
            </div>
            <div className="overflow-x-auto">
              <ListDetailComment />
            
            </div>
          </div>
        </div>
      </section>
    <ToastContainer />

    </div>
  );
};

export default ListComments;
