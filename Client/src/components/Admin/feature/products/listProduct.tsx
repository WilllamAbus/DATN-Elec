import React, { useEffect, useState } from "react";
import { listProduct, hardDeleteProduct } from "../../../../services/product/crudProduct.service";
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
  const handleDelete = async (productId: string) => {
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
          await hardDeleteProduct(productId);
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
    <main className="w-full flex-grow p-6">
      <div className="w-full mt-12">
        <p className="text-xl pb-3 flex items-center">
          <i className="fas fa-list mr-3"></i> DANH SÁCH SẢN PHẨM
        </p>
        <div className="bg-white overflow-auto">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Thương hiệu
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Tên sản phẩm
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  HIinh ảnh
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Giá
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Chức năng
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-grey-lighter">
                  <td className="py-4 px-6 border-b border-grey-light">{product.brand}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{product.name}</td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <img
                      className="w-10 h-10 rounded-sm"
                      src={product.image}
                      alt="Student avatar"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">{product.price}</td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <a
                      href="#"
                      className="delete-link text-decoration:none color:green;"
                      onClick={() => handleDelete(product._id)}
                    >
                      Xoá
                    </a>
                    <Link
                      to={`/admin/editProducts/${product._id}`}
                      className="delete-link p-4 text-decoration:none color:green;"
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
        <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="button">
          <a href="/admin/addProducts">Thêm mới</a>
        </button>
        <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="button">
          <a href="/admin/dashboard">Trở lại</a>
        </button>
      </div>
    </main>
  );
};

export default ProductList;
