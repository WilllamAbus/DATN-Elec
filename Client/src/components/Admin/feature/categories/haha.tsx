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
    <main className="w-full flex-grow p-6">
      <div className="w-full mt-12">
        <p className="text-xl pb-3 flex items-center">
          <i className="fas fa-list mr-3"></i> DANH SÁCH DANH MỤC ĐÃ XOÁ
        </p>
        <div className="bg-white overflow-auto">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  TÊN DANH MỤC
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  HÌNH ẢNH
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  HÀNH ĐỘNG
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
              {status === "succeeded" && categories.length > 0 ? (
                categories.map((category: Category) => (
                  <tr key={category._id} className="hover:bg-grey-lighter">
                    <td className="py-4 px-6 border-b border-grey-light">
                      {category.name}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      <LazyLoad height={50} offset={100} once>
                        <img
                          src={
                            imageUrls[category._id] ||
                            "path/to/default/image.jpg"
                          }
                          loading="lazy"
                          alt={category.name}
                          style={{ width: "50px", height: "50px" }}
                        />
                      </LazyLoad>
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRestore(category._id)}
                          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                          Khôi phục
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default ListCateDeleted;
