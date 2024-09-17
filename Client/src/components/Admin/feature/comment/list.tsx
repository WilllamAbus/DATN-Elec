import React, { useEffect, useState } from "react";
import { getCommentAdmin } from "../../../../services/commnet/comment.service";
import "react-toastify/dist/ReactToastify.css";
import {  useNavigate } from "react-router-dom";

const ListComment: React.FC = () => { 
  const [products, setProducts] = useState<any[]>([]);
  const navigatee = useNavigate();
  const fetchProducts = async () => {
    try {
      const response = await getCommentAdmin();
      if (response && response.products) {
        setProducts(response.products);
        console.log(response.products);
      } else {
        console.error("No products found in the response");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  // const listComment = () =>{
  //   navigatee('/listDetailComment/${}')
  // }
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              Stt
            </th>
            <th scope="col" className="p-4">
              Tên Sản Phẩm
            </th>
            <th scope="col" className="p-4">
              Giá
            </th>
            <th scope="col" className="p-4">
              Hình Ảnh
            </th>
            <th scope="col" className="p-4">
              Số lượng bình luận
            </th>
            <th scope="col" className="p-4">
              Chức Năng
            </th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product, index) => (
            <tr
              key={product?._id}
              className="border-b text-left dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{product?.product_name}</td>
              <td className="px-4 py-3">{product?.product_price}</td>
              <td className="px-4 py-3">
                <img 
                  src={product?.image[0]}
                  width={100}
                  height={50}
                  alt={product?.product_name}
                />
              </td>
              <td className="px-4 py-3">
                {product?.comments ? product?.comments.length : 0}
              </td>
              <td className="px-4 py-3 ">
                <button className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick = {()=>navigatee(`/admin/listDetailComments/${product?._id}`)}
                >
                  Xem bình luận
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListComment;
