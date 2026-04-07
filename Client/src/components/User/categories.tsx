import React from "react";
const Categories: React.FC = () => {
  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-4 flex items-center justify-between gap-4 md:mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Tìm kiếm nhiều nhất
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6">
          <a
            href="#"
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white px-4 py-4 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13_2_.png"
              alt="iPhone 15 128GB"
              className="object-cover h-12 w-12 mb-2"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              iPhone 15 128GB
            </span>
          </a>
          <a
            href="#"
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white px-4 py-4 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              src="https://cdn.tgdd.vn/content/Tainghe-128x129.png"
              alt="iPhone 15 128GB"
              className="object-cover h-12 w-12 mb-2"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              iPhone 15 128GB
            </span>
          </a>
          <a
            href="#"
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white px-4 py-4 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              src="https://cdn.tgdd.vn/content/Laptop-129x129.png"
              alt="iPhone 15 128GB"
              className="object-cover h-12 w-12 mb-2"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              iPhone 15 128GB
            </span>
          </a>
          <a
            href="#"
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white px-4 py-4 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              src="https://cdn.tgdd.vn/content/chuot-128x129.png"
              alt="iPhone 15 128GB"
              className="object-cover h-12 w-12 mb-2"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              iPhone 15 128GB
            </span>
          </a>
          <a
            href="#"
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white px-4 py-4 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/m/image_4_1__1.png"
              alt="iPhone 15 128GB"
              className="object-cover h-12 w-12 mb-1"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">PlayStation 5</span>
          </a>
          <a
            href="#"
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white px-4 py-4 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              src="https://cdn.tgdd.vn/content/Donghothoitrang-128x129.png"
              alt="iPhone 15 128GB"
              className="object-cover h-12 w-12 mb-2"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              iPhone 15 128GB
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Categories;
