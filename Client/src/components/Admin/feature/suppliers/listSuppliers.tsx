import React, { useEffect, useState } from "react";
import { listSuppliers, softDeleteSupplier } from "../../../../services/supplier/crudSuppliers.service";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import "../../../../assets/css/admin.style.css";

const MySwal = withReactContent(Swal);
const supplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supplierList = await listSuppliers();
        setSuppliers(supplierList);
      } catch (error) {
        setError("Error fetching suppliers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);
  const handlesoftDeleteSupplier = async (supplierId: string) => {
    MySwal.fire({
      title: "Xóa nhà cung cấp?",
      text: "Bạn có chắc muốn xóa nhà cung cấp này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await softDeleteSupplier(supplierId);
          setSuppliers(suppliers.filter((supplier) => supplier._id !== supplierId));
          MySwal.fire({
            title: "Đã xóa!",
            text: "Nhà cung cấp đã bị xóa.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting suppliers:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi xóa nhà cung cấp.",
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
          <i className="fas fa-list mr-3"></i> DANH SÁCH NHÀ CUNG CẤP
        </p>
        <div className="bg-white overflow-auto">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Tên nhà cung cấp
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Địa chỉ
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Số điện thoại
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Hình ảnh
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Trạng thái
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Chức năng
                </th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier._id} className="hover:bg-grey-lighter">
                  {/* <td className="py-4 px-6 border-b border-grey-light">{brand.brand}</td> */}
                  <td className="py-4 px-6 border-b border-grey-light">{supplier.name}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{supplier.address}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{supplier.phone}</td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <img
                      className="w-10 h-10 rounded-sm"
                      src={supplier.image}
                      alt="No Image"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
                      {supplier.status === "active" ? "Hiển thị" : "Đã ẩn"}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <button
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      onClick={() => handlesoftDeleteSupplier(supplier._id)}
                   >
                      Xoá
                    </button>
                    <Link
                      to={`/admin/editSuppliers/${supplier._id}`}
                      className="focus:outline-none
                       text-white
                        bg-green-700
                         hover:bg-green-800 
                         focus:ring-4
                          focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2
                           dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
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
          type="button"
        >
          <a href="/admin/addSuppliers">Thêm mới</a>
        </button>
        <button
          className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
          type="button"
        >
          <a href="/admin/dashboard">Trở lại</a>
        </button>
      </div>
    </main>
  );
};

export default supplierList;
