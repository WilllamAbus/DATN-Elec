import React, { useEffect, useState } from "react";
import {
  commentAllProduct,
  deletelComment,
  postRepComment,
} from "../../../../services/commnet/comment.service";
import axios from "axios";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm, SubmitHandler } from "react-hook-form";
import { notify } from "../../../../ultils/success";
import "react-toastify/dist/ReactToastify.css";
import { CommentRating } from "./rating";
const MySwal = withReactContent(Swal);

interface Comment {
  _id: string;
  rating: number;
  id_user: string;
  id_product: string;
  content: string;
}

interface User {
  name: string;
  avatar: string;
}

interface Product {
  name: string;
  image: string;
}

interface FormValues {
  content: string;
  id_comment: string;
}

const ListComment: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userNames, setUserNames] = useState<{ [key: string]: User }>({});
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string>("");
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentList = await commentAllProduct();
        if (Array.isArray(commentList)) {
          setComments(commentList);

          const userIds = Array.from(
            new Set(commentList.map((comment) => comment.id_user.toString()))
          );
          const productIds = Array.from(
            new Set(commentList.map((comment) => comment.id_product.toString()))
          );

          try {
            const [userResponses, productResponses] = await Promise.all([
              Promise.all(
                userIds.map((userId) =>
                  axios.get(`http://localhost:4000/api/product/userID/${userId}`)
                )
              ),
              Promise.all(
                productIds.map((productId) =>
                  axios.get(`http://localhost:4000/api/product/get-one/${productId}`)
                )
              ),
            ]);

            const userNameMap = userResponses.reduce((map, response) => {
              const user = response.data;
              if (user && user._id && typeof user.name === "string") {
                map[user._id] = {
                  name: user.name,
                  avatar: user.avatar,
                };
              } else {
                console.warn("Invalid user data:", user);
              }
              return map;
            }, {} as { [key: string]: User });

            const productMap = productResponses.reduce((map, response) => {
              const product = response.data;
              if (product && product._id && product.name) {
                map[product._id] = {
                  name: product.name,
                  image: product.image,
                };
              } else {
                console.warn("Invalid product data:", product);
              }
              return map;
            }, {} as { [key: string]: Product });

            setUserNames(userNameMap);
            setProducts(productMap);
          } catch (error) {
            console.error("Error fetching user or product data:", error);
          }
        } else {
          setComments([]);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchComments();
  }, []);

  const handleSoftDeleteProduct = async (commentId: string) => {
    MySwal.fire({
      title: "Xóa bình luận?",
      text: "Bạn có chắc muốn xóa bình luận này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await deletelComment(commentId);
          setComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== commentId)
          );
          MySwal.fire({
            title: "Đã xóa!",
            text: "Bình luận của bạn đã bị xóa.",
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

  const openForm = (commentId: string) => {
    setSelectedCommentId(commentId);
    setShowForm(true);
  };

  const submitComment: SubmitHandler<FormValues> = async (data) => {
    const isLoggedIn = true;
    if (!isLoggedIn) {
      alert("You need to be logged in to submit a comment.");
      return;
    }
    const commentData = {
      content: data.content,
      id_comment: selectedCommentId,
    };
    try {
      const response = await postRepComment(selectedCommentId, commentData);
      console.log("Comment submitted:", response.data);
      reset();
      notify();
      // alert("Comment submitted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedCommentId("");
  };

  const currentComment = comments.find((comment) => comment._id === selectedCommentId);

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              Stt
            </th>
            <th scope="col" className="p-4">
              Tên
            </th>
            <th scope="col" className="p-4">
              Nội dung
            </th>
            <th scope="col" className="p-4">
              Sản phẩm
            </th>
            <th scope="col" className="p-4">
              Hình Ảnh
            </th>
            <th scope="col" className="p-4">
              Đánh giá
            </th>
            <th scope="col" className="p-4">
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr
              key={comment._id}
              className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{userNames[comment.id_user]?.name || "Anonymous"}</td>
              <td className="px-4 py-3">{comment.content}</td>
              <td className="px-4 py-3">
                {products[comment.id_product]?.name || "Unknown Product"}
              </td>
              <td className="px-4 py-3">
                <img
                  src={products[comment.id_product]?.image || "placeholder.png"}
                  alt="Product"
                  width={50}
                  height={50}
                />
              </td>
              <td className="px-4 py-3">
              <CommentRating rating={comment.rating} />

              </td>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex items-center space-x-4">
                  <button
                    className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    onClick={() => openForm(comment._id)}
                  >
                    Trả lời
                  </button>
                  <button
                    className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => handleSoftDeleteProduct(comment._id)}
                  >
                    Xoá
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && currentComment && (
        <div
          id="crud-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative w-full max-w-md p-4 max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Trả lời bình luận của {userNames[currentComment.id_user]?.name || "Người dùng"}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={closeForm}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <form className="p-4 md:p-5" onSubmit={handleSubmit(submitComment)}>
                <div className="grid gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Nội dung bình luận
                    </label>
                    <input
                      type="text"
                      value={currentComment.content}
                      className="block w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Phản hồi
                    </label>
                    <textarea
                      {...register("content", { required: true })}
                      placeholder="..."
                      className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      rows={4}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Gửi
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListComment;
