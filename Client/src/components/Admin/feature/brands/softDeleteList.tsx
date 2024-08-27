import { useEffect, useState } from "react";
import {
  getSoftDeletedBrands,
  hardDeleteBrand,
  restoreBrand,
} from "../../../../services/brand/crudBrands.service";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const softDeleteList: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandList = await getSoftDeletedBrands();
        setBrands(brandList);
      } catch (error) {
        setError("Error fetching brands.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);
  const handleDelete = async (brandId: string) => {
    MySwal.fire({
      title: "Xóa thương hiệu?",
      text: "Bạn có chắc muốn xóa thương hiệu này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await hardDeleteBrand(brandId);
          setBrands(brands.filter((brand) => brand._id !== brandId));
          MySwal.fire({
            title: "Đã xóa!",
            text: "Thương hiệu của bạn đã bị xóa.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting brands:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi xóa thương hiệu.",
            icon: "error",
          });
        }
      }
    });
  };
  const handleRestore = async (brandId: string) => {
    MySwal.fire({
      title: "Khôi phục thương hiệu?",
      text: "Bạn có chắc muốn khôi phục thương hiệu này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await restoreBrand(brandId);
          setBrands(brands.filter((brand) => brand._id !== brandId));
          MySwal.fire({
            title: "Đã khôi phục!",
            text: "Thương hiệu của bạn đã được khôi phục.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error restoring brands:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi khôi phục thương hiệu.",
            icon: "error",
          });
        }
      }
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="p-4">
            <div className="flex items-center">
              <input
                id="checkbox-all"
                type="checkbox"
                className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="checkbox-all" className="sr-only">
                checkbox
              </label>
            </div>
          </th>
          <th scope="col" className="p-4">
            Tên thương hiệu
          </th>
          <th scope="col" className="p-4">
            Danh mục
          </th>
          <th scope="col" className="p-4">
            Nhà cung cấp
          </th>
          <th scope="col" className="p-4">
            Trạng thái
          </th>
          <th scope="col" className="p-4">
            Chức năng
          </th>
        </tr>
      </thead>
      <tbody>
        {brands.map((brand) => (
          <tr
            key={brand._id}
            className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <td className="p-4 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <div className="flex items-center mr-3">
                <img src={brand.image} className="h-8 w-auto mr-3" />
                {brand.name}
              </div>
            </th>
            <td className="px-4 py-3">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
              {brand.category_id ? brand.category_id.name : 'No Category'}
              </span>
            </td>
            <td className="px-4 py-3">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
              {brand.supplier_id ? brand.supplier_id.name : 'No Supplier'}
              </span>
            </td>
            <td className="py-4 px-6">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
                {brand.status === "active" ? "Hiển thị" : "Đã ẩn"}
              </span>
            </td>
            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  data-modal-target="delete-modal"
                  data-modal-toggle="delete-modal"
                  className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  onClick={() => handleDelete(brand._id)}
                >
                  Xoá
                </button>
                <button
                  type="button"
                  className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  onClick={() => handleRestore(brand._id)}
                >
                  Khôi phục
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default softDeleteList;
