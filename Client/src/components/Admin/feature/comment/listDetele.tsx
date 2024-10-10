import React, { useEffect, useState } from "react";
import { getCommentDelete,restoreComment,deleteCommentAdmin} from "../../../../services/commnet/comment.service";
import { getOneProduct } from "../../../../services/product_v2/admin/getone";
import Swal, { SweetAlertResult } from "sweetalert2";

import withReactContent from "sweetalert2-react-content";
import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
const MySwal = withReactContent(Swal);
interface Comment {
  _id: string;
  id_product: string;
  content: string;
  rating: number;
  image: string[];
}

const ListComment: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [products, setProducts] = useState<{
    [key: string]: { name: string; price: number; image: string[] };
  }>({});

  // const navigatee = useNavigate();
  
  const fetchProduct = async (id_product: string) => {
    try {
      const response = await getOneProduct(id_product);
      if (response && response.product) {
        const { product_name, product_price, image } = response.product;
        setProducts((prev) => ({
          ...prev,
          [id_product]: {
            name: product_name,
            price: product_price,
            image: image || [],
          },
        }));
      } else {
        console.error("No product found for this ID.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchData = async () => {
    try {
      const commentResponse = await getCommentDelete();
      if (commentResponse && commentResponse.length > 0) {
        setComments(commentResponse);
        const productIds = commentResponse.map(
          (comment: Comment) => comment.id_product
        );
        await Promise.all(productIds.map((id: string) => fetchProduct(id)));
      } else {
        console.error("No comments found in the response.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const handleDelete = async (id_product: string, id_comment: string) => {
    MySwal.fire({
      title: "Xóa comment?",
      text: "Bạn có chắc muốn xóa comment này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          // Gọi hàm xóa bình luận
          await deleteCommentAdmin(id_product, id_comment);
  
          // Cập nhật state của comments để bỏ bình luận đã xóa
          setComments((prevComments) => 
            prevComments.filter((comment) => comment._id !== id_comment) // Giữ lại các bình luận không bị xóa
          );
  
          MySwal.fire({
            title: "Đã xóa!",
            text: "Người dùng đã xóa bình luận.",
            icon: "success",
          });
  
        } catch (error) {
          console.error("Error deleting comment:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi xóa bình luận.",
            icon: "error",
          });
        }
      }
    });
  };
  
  const handleRestore = async (id_comment: string) => {
    MySwal.fire({
      title: "Khôi phục comment?",
      text: "Bạn có chắc muốn khôi phục comment này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await restoreComment(id_comment);
  
          setComments((prevComments) => 
            prevComments.filter((comment) => comment._id !== id_comment) // Giữ lại các bình luận không bị xóa
          );
  
          MySwal.fire({
            title: "Đã khôi phục!",
            text: "Người dùng đã khôi phục.",
            icon: "success",
          });
  
        } catch (error) {
          console.error("Error restoring comment:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi khôi phục bình luận.",
            icon: "error",
          });
        }
      }
    });
  };
  
  
  
  
  useEffect(() => {
    fetchData();
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
              Nội dung bình luận
            </th>
            <th scope="col" className="p-4">
              Đánh giá
            </th>
            <th scope="col" className="p-4">
              Chức Năng
            </th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr
              key={comment?._id}
              className="border-b text-left dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">
                {products[comment?.id_product]?.name || "Loading..."}
              </td>
              <td className="px-4 py-3">
                {products[comment?.id_product]?.price || "Loading..."}
              </td>
              <td className="px-4 py-3">
                {/* Hiển thị hình ảnh nếu cần thiết */}
                <img
                  src={products[comment?.id_product]?.image[0]} // sử dụng phần tử đầu tiên của mảng hình ảnh
                  width={100}
                  height={50}
                />
              </td>
              <td className="px-4 py-3">{comment?.content}</td>
              <td className="px-4 py-3 text-sm text-yellow-400">
                {Array.from({ length: comment?.rating }, (_, i) => (
                  <span key={i}>
                    <i className="fa-solid fa-star"></i>
                  </span>
                ))}
              </td>
              <td className="px-4 py-3 ">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick = {()=>handleDelete(comment?.id_product,comment?._id)}
                  >
                    Xoá
                  </button>
                  <button className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick = {()=>handleRestore(comment?._id)}
                  >
                    Khôi phục
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListComment;
