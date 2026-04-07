import React from "react";
import AdminFetPostList from "../../../../components/Admin/feature/post/list/getListPost";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
import SummaryGetListPost from "../../../../components/Admin/summary/getListPost";
const GetPostList: React.FC = () => {

  return (
    <div>
      <ReusableBreadcrumb items={breadcrumbItems.listPost} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Danh sách bài viết
        </h1>
      </div>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="bg-white dark:bg-gray-800 relative border shadow-md sm:rounded-lg overflow-hidden">
            <SummaryGetListPost />
            <div className="overflow-x-auto">
              <AdminFetPostList />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetPostList;
