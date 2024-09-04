const Top = () => {
  return (
    
    <div className="mx-auto max-w-screen-xl px-10">
      <h1 className="text-xs font-semibold text-gray-900 sm:text-2xl dark:text-white px-2">
        Chọn theo tiêu chí
      </h1>
      <div className="mx-0">
        <div className="flex overflow-x-auto space-x-4 mx-auto items-center py-2 px-2">
          <div className="px-0">
            <select
              id="ram"
              className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="">RAM</option>
            </select>
          </div>

          <div className="px-0">
            <select
              id="storage"
              className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="">Storage</option>
            </select>
          </div>
          {/* Thêm nhiều filter khác tại đây */}
          <div className="px-2">
            <select
              id="brand"
              className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="">Brand</option>
            </select>
          </div>
          <div className="px-2">
            <select
              id="price"
              className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="">Price</option>
            </select>
          </div>
          {/* Tiếp tục thêm filter nếu cần */}
        </div>
      </div>
    </div>
  );
};

export default Top;
