import React from "react";
import AdminFetCategoryPostList from "../../../../components/Admin/feature/post/list/getCategoryPostList";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
import SummaryCategoryPostList from "../../../../components/Admin/summary/getCategoryPostList";
const GetCategoryPostList: React.FC = () => {

  return (
    <div>
      <ReusableBreadcrumb items={breadcrumbItems.listproduct} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Danh sách danh mục bài viết
        </h1>
      </div>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="bg-white dark:bg-gray-800 relative border shadow-md sm:rounded-lg overflow-hidden">
            <SummaryCategoryPostList />
            <div className="overflow-x-auto">
              <AdminFetCategoryPostList />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetCategoryPostList;
