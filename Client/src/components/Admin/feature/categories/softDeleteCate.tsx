import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeletedCategoriesThunk,
  deleteCategoryThunk,
  restoreCategoryThunk,
  // fetchCategoriesThunk,
} from "../../../../redux/categories/categoriesThunk";
import { RootState, AppDispatch } from "../../../../redux/store";
import { getFileFirebase } from "../../../../services/firebase/getFirebse.service";
import { Category } from "../../../../types/Categories.d";
import "../../../../assets/css/admin.style.css";

import LazyLoad from "react-lazyload";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface ImageUrls {
  [key: string]: string;
}

const ListCateDeleted: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.deletedCategories
  ) as Category[];
  const status = useSelector((state: RootState) => state.categories.status);
  const error = useSelector((state: RootState) => state.categories.error);
  const [imageUrls, setImageUrls] = useState<ImageUrls>({});
  const [, setCategories] = useState<Category[]>(categories);
  const fetchImageUrls = useCallback(async (categories: Category[]) => {
    const urls: ImageUrls = {};
    const fetchPromises = categories.map(async (category) => {
      try {
        const url = await getFileFirebase(category.imgURL);
        urls[category._id] = url;
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    });
    await Promise.all(fetchPromises);
    setImageUrls(urls);
  }, []);

  useEffect(() => {
    dispatch(fetchDeletedCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      fetchImageUrls(categories);
      setCategories(categories);
    }
  }, [status, categories, fetchImageUrls]);

  const handleDelete = useCallback(
    (_id: string) => {
      MySwal.fire({
        title: "Xóa danh mục?",
        text: "Bạn có chắc muốn xóa dòng này không!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có",
        cancelButtonText: "Hủy",
      }).then(async (result: SweetAlertResult) => {
        if (result.isConfirmed) {
          try {
            await dispatch(deleteCategoryThunk(_id)).unwrap();
            dispatch(fetchDeletedCategoriesThunk()); // Fetch updated list

            // Remove category from local state
            setCategories((prevCategories) =>
              prevCategories.filter((category) => category._id !== _id)
            );
            MySwal.fire({
              title: "Đã xoá!",
              text: "Danh mục đã xoá.",
              icon: "success",
            });
          } catch (error) {
            console.error("Error deleting category:", error);
            MySwal.fire({
              title: "Lỗi!",
              text: "Đã xảy ra sự cố.",
              icon: "error",
            });
          }
        }
      });
    },
    [dispatch]
  );

  const handleRestore = useCallback(
    (_id: string) => {
      MySwal.fire({
        title: "Khôi phục danh mục?",
        text: "Bạn có chắc muốn khôi phục dòng này không!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có",
        cancelButtonText: "Hủy",
      }).then(async (result: SweetAlertResult) => {
        if (result.isConfirmed) {
          try {
            await dispatch(restoreCategoryThunk(_id)).unwrap();
            dispatch(fetchDeletedCategoriesThunk());

            setCategories((prevCategories) =>
              prevCategories.filter((category) => category._id !== _id)
            );
            // Fetch current categories after restore
            MySwal.fire({
              title: "Đã khôi phục!",
              text: "Danh mục khôi phục thành công.",
              icon: "success",
            });
          } catch (error) {
            console.error("Error restoring category:", error);
            MySwal.fire({
              title: "Lỗi!",
              text: "Đã xảy ra sự cố.",
              icon: "error",
            });
          }
        }
      });
    },
    [dispatch]
  );

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
          <th scope="col" className="px-16 py-3">
            <span className="sr-only">Hình ảnh</span>
          </th>
          <th scope="col" className="p-4">
            Tên danh mục
          </th>
          <th scope="col" className="p-4">
            Trạng thái 
          </th>
          <th scope="col" className="p-4">
            Chức năng
          </th>
        </tr>
      </thead>
      <tbody>
        {status === "loading" && (
          <tr>
            <td colSpan={3} className="text-center py-4">
              Loading...
            </td>
          </tr>
        )}
        {status === "failed" && (
          <tr>
            <td colSpan={3} className="text-center py-4 text-red-500">
              {error}
            </td>
          </tr>
        )}
        {status === "succeeded" &&
          categories.map((category: Category) => (
            <tr
              key={category._id}
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
              <td className="py-4 px-6 border-b border-grey-light">
                <LazyLoad height={50} offset={100} once>
                  <img
                    src={imageUrls[category._id]}
                    loading="lazy"
                    alt={category.name}
                    className="w-16 md:w-32 max-w-full max-h-full"
                  />
                </LazyLoad>
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                {category.name}
              </td>
              <td className="py-4 px-6 border-b border-grey-light">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
                {category.status === "active" ? "Hiển thị" : "Đã ẩn"}
              </span>
            </td>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleDelete(category._id)}
                    type="button"
                    data-modal-target="delete-modal"
                    data-modal-toggle="delete-modal"
                    className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    Xoá
                  </button>
                  <button
                    onClick={() => handleRestore(category._id)}
                    className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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

export default ListCateDeleted;
