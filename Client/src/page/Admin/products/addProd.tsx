import React, { useState } from "react";
import AdminFooter from "../../../components/Admin/footer";
import AdminHeader from "../../../components/Admin/header";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminStyleSheet from "../../../components/Admin/stySheet";

import AdminScript from "../../../components/Admin/script";
import "../../../assets/css/admin.style.css";
import { addProduct } from "../../../services/product/crudProduct.service";
// import FirebaseService from "../../../firebase/firebase.service";
const addProd: React.FC = () => {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
    categoryid: "",
    createdAt: "",
    weight: "",
    brand: "",
    color: "",
    description: "",
    discount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    let newValue;
    if (type === "number") {
      newValue = parseFloat(value) || 0;
    } else {
      newValue = value;
    }

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productWithDate = {
        ...product,
        createdAt: new Date(product.createdAt).toISOString(), // Chuyển đổi Date thành chuỗi ISO
      };
      const response = await addProduct(productWithDate);
      console.log("Product added successfully:", response);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <>
      <AdminStyleSheet />

      <div className="bg-gray-100 font-family-karla flex">
        <AdminSidebar />
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminHeader />
          <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
            <main className="w-full flex-grow p-6">
              <div className="flex flex-wrap">
                <div className="w-full mt-6 pl-0 lg:pl-2">
                  <p className="text-lg text-gray-800 font-medium pb-4">THÔNG TIN SẢN PHẨM</p>
                  <div className="leading-loose">
                    <form className="" onSubmit={handleSubmit}>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Tên sản phẩm
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            name="name"
                            id="product-name"
                            type="text"
                            placeholder="Tên sản phẩm"
                            value={product.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Giá gốc
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            name="price"
                            id="product-price"
                            type="number"
                            placeholder="Giá gốc"
                            value={product.price}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Số lượng
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            name="quantity"
                            id="product-quantity"
                            type="number"
                            placeholder="Số lượng"
                            value={product.quantity}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Danh mục
                          </label>
                          <div className="relative">
                            <select
                              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              name="categoryid"
                              id="product-category"
                              value={product.categoryid}
                              onChange={handleChange}
                            >
                              <option value="66993463bb7a5087b8af0e06">Danh mục A</option>
                              <option value="66993463bb7a5087b8af0e06">Danh mục B</option>
                              <option value="66993463bb7a5087b8af0e06">Danh mục C</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Ngày nhập
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            name="createdAt"
                            id="product-date"
                            type="date"
                            value={product.createdAt}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Khối lượng
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            name="weight"
                            id="product-weight"
                            type="number"
                            placeholder="Khối lượng"
                            value={product.weight}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Thương hiệu
                          </label>
                          <div className="relative">
                            <select
                              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              name="brand"
                              id="product-brand"
                              value={product.brand}
                              onChange={handleChange}
                            >
                              <option value="A">Thương hiệu A</option>
                              <option value="B">Thương hiệu B</option>
                              <option value="C">Thương hiệu C</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Màu sắc
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            name="color"
                            id="product-color"
                            type="text"
                            placeholder="Màu sắc"
                            value={product.color}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Mô tả
                          </label>
                          <textarea
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            name="description"
                            id="product-description"
                            placeholder="Mô tả"
                            value={product.description}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Chương trình giảm giá
                          </label>
                          <select
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            name="discount"
                            id="product-discount"
                            value={product.discount}
                            onChange={handleChange}
                            required
                          >
                            <option value="" disabled>
                              Chọn chương trình giảm giá
                            </option>
                            <option value="0">Không giảm giá</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-2">
                        <button
                          id="addNewButton"
                          type="submit"
                          className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                        >
                          Thêm mới
                        </button>
                        <button className="p-5 py-1 text-white font-light tracking-wider bg-gray-900 rounded">
                          <a href="/admin/listProducts">Danh sách</a>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </main>
            <AdminFooter />
          </div>
        </div>
      </div>

      <AdminScript />
    </>
  );
};

export default addProd;
