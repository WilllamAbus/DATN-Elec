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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
                  axios.get(
                    `http://localhost:4000/api/product/get-one/${productId}`
                  )
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
      const response = await postRepComment(selectedCommentId,commentData);
      console.log("Comment submitted:", response.data);
      reset();
      notify()
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

  const currentComment = comments.find(
    (comment) => comment._id === selectedCommentId
  );

  return (
    <>
      <main className="w-full flex-grow p-6">
        <div className="w-full mt-12">
          <p className="text-xl pb-3 flex items-center">
            <i className="fas fa-list mr-3"></i> DANH SÁCH BÌNH LUẬN
          </p>
          <ToastContainer/>
          <div className="bg-white">
            <table className="text-left w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    STT
                  </th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Tên người bình luận
                  </th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Nội dung
                  </th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Tên sản phẩm
                  </th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Hình Ảnh
                  </th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Đánh giá
                  </th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => (
                  <tr key={comment._id} className="hover:bg-grey-lighter">
                    <td className="py-4 px-6 border-b border-grey-light">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {userNames[comment.id_user]?.name || "Anonymous"}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {comment.content}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {products[comment.id_product]?.name || "Unknown Product"}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      <img
                        src={
                          products[comment.id_product]?.image ||
                          "placeholder.png"
                        }
                        alt="Product"
                        width={50}
                        height={50}
                      />
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {[...Array(5)].map((_, starIndex) => (
                        <i
                          key={starIndex}
                          className={`fa fa-star ${
                            starIndex < comment.rating ? "text-yellow-400" : "text-gray-400"
                          }`}
                        ></i>
                      ))}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      <button
                        className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
                        onClick={() => openForm(comment._id)}
                      >
                        Trả lời
                      </button>
                      <button
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        onClick={() => handleSoftDeleteProduct(comment._id)}
                      >
                        Xoá
                      </button>
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
            <a href="/admin/dashboard">Trở lại</a>
          </button>
        </div>
      </main>
      {showForm && currentComment && (
        <div className="form-popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            className="form-container bg-white p-6 rounded shadow-lg"
            onSubmit={handleSubmit(submitComment)}
          >
            <h1 className="text-xl font-bold mb-4">
              Trả lời bình luận của{" "}
              {userNames[currentComment.id_user]?.name || "Người dùng"}
            </h1>
            <label>
              <b>Nội dung bình luận</b>
            </label>
            <input
              type="text"
              value={currentComment.content}
              className="block w-full mb-4 p-2 border rounded"
              disabled
            />
            <label>
              <b>Phản hồi</b>
            </label>
            <textarea
              {...register("content", { required: true })}
              placeholder="..."
              className="block w-full mb-4 p-2 border rounded"
              rows={4}
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="btn bg-blue-500 text-white px-4 py-2 rounded"
              >
                Gửi
              </button>
            </div>
            <button
              type="button"
              className="cancel px-4 py-2 mb-40 rounded"
              onClick={closeForm}
            >
              <i style={{ fontSize: "18px" }} className="fa">
                &#xf00d;
              </i>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ListComment;
