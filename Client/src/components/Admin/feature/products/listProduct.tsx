import React, { useEffect, useState } from "react";
import { listProduct, softDeleteProduct } from "../../../../services/product/crudProduct.service";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import "../../../../assets/css/admin.style.css";

const MySwal = withReactContent(Swal);
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await listProduct();
        setProducts(productList);
      } catch (error) {
        setError("Error fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const handlesoftDeleteProduct = async (productId: string) => {
    MySwal.fire({
      title: "Xóa sản phẩm?",
      text: "Bạn có chắc muốn xóa sản phẩm này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await softDeleteProduct(productId);
          setProducts(products.filter((product) => product._id !== productId));
          MySwal.fire({
            title: "Đã xóa!",
            text: "Sản phẩm của bạn đã bị xóa.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting product:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi xóa sản phẩm.",
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
            Tên sản phẩm
          </th>
          <th scope="col" className="p-4">
            Danh mục
          </th>
          <th scope="col" className="p-4">
            Giá gốc
          </th>
          <th scope="col" className="p-4">
            Trạng thái
          </th>
          <th scope="col" className="p-4">
           Màu sắc
          </th>
          <th scope="col" className="p-4">
            Chức năng
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr
            key={product._id}
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
                <img src={product.image} className="h-8 w-auto mr-3" />
                {product.name}
              </div>
            </th>
            <td className="px-4 py-3">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                {product.brand}
              </span>
            </td>
            <td className="px-4 py-3">
              {" "}
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                product.price
              )}
            </td>

            <td className="py-4 px-6 border-b border-grey-light">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
                {product.status === "active" ? "Hiển thị" : "Đã ẩn"}
              </span>
            </td>
            <td className="px-4 py-3">
                {product.color}
            </td>
            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  data-modal-target="delete-modal"
                  data-modal-toggle="delete-modal"
                  className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  onClick={() => handlesoftDeleteProduct(product._id)}
                >
                  Xoá
                </button>
                <Link
                  to={`/admin/editProducts/${product._id}`}
                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sửa
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductList;
