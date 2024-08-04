// src/components/Admin/ListCate.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesThunk,
  deleteCategoryThunk,
} from "../../../../redux/categories/categoriesThunk";
import { RootState, AppDispatch } from "../../../../redux/store";

import { getFileFirebase } from "../../../../services/firebase/getFirebse.service";
import { Category } from "../../../../types/Categories.d";
import "../../../../assets/css/admin.style.css";

import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
interface ImageUrls {
  [key: string]: string;
}

// const useAlert = (initialState: boolean) => {
//     const [showAlert, setShowAlert] = useState(initialState);
//     const triggerAlert = () => {
//       setShowAlert(true);
//       setTimeout(() => setShowAlert(false), 2000);
//     };
//     return { showAlert, triggerAlert };
//   };
const ListCate: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  ) as Category[];
  const status = useSelector((state: RootState) => state.categories.status);
  const error = useSelector((state: RootState) => state.categories.error);
  const [imageUrls, setImageUrls] = useState<ImageUrls>({});
 

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
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      fetchImageUrls(categories);
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
            await dispatch(deleteCategoryThunk(_id))
            .unwrap()
           
        
            MySwal.fire({
              title: "Đã xóa!",
              text: "Danh mục  đã  xóa.",
              icon: "success",
            });
          } catch (error) {
            console.error("Error deleting product:", error);
            MySwal.fire({
              title: "Lỗi!",
              text: "Đã xảy ra sự cố ",
              icon: "error",
            });
          }
        }
      });
    },
    [dispatch]
  );

  return (
    <>
      <main className="w-full flex-grow p-6">
     
        <div className="w-full mt-12">
          <p className="text-xl pb-3 flex items-center">
            <i className="fas fa-list mr-3"></i> DANH SÁCH DANH MỤC
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
                    <td colSpan={4} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                )}
                {status === "failed" && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-red-500">
                      {error}
                    </td>
                  </tr>
                )}
                {status === "succeeded" &&
                  categories.map((category: Category) => (
                    <tr key={category._id} className="hover:bg-grey-lighter">
                      <td className="py-4 px-6 border-b border-grey-light">
                        {category.name}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        <LazyLoad height={50} offset={100} once>
                          <img
                            src={imageUrls[category._id]}
                            loading="lazy"
                            alt={category.name}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </LazyLoad>
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="cta-btn btn text-red-500"
                        >
                          Xoá
                        </button>
                        <Link
                          to={`/admin/editCategories/${category._id}`}
                          className="cta-btn btn text-green-500 ml-4"
                        >
                          Sửa
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <button
            className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
            type="submit"
          >
            <a href="/admin/addCategories">Thêm mới</a>
          </button>
          <button
            className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
            type="submit"
          >
            <a href="/admin/dashboard">Trở lại</a>
          </button>
        </div>
      </main>
    </>
  );
};

export default ListCate;
