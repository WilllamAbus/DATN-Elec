import React, { useEffect, useState } from "react";
import {
  getCommentProduct,
  deleteCommentAdmin,
  postRepComment,
  getRepComment,
  deleteRepComment,
} from "../../../../services/commnet/comment.service";
import { getOneUser } from "../../../../services/user/user.service";
import { useParams, useNavigate } from "react-router-dom";
import { getOneProduct } from "../../../../services/product_v2/admin/getone";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../../assets/css/admin.style.css";
// import { notify } from "../../../../../ultils/success";
import { notify } from "../../../../ultils/success";
import { useForm } from "react-hook-form";

const MySwal = withReactContent(Swal);

interface Product {
  _id?: string;
  product_name: string;
  product_price: number;
  image: string[];
}

interface Comment {
  _id: string;
  content: string;
  rating: number;
  user: string;
}

interface User {
  _id?: string;
  name: string;
}
interface FormValues {
  content: string;
}
interface Content {
  [key: string]: string; // Định nghĩa content như một đối tượng với key là comment ID và value là nội dung
}
const ListDetailComment: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { id } = useParams<{ id: string }>();
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [content, setContent] = useState<Content>({});
  const [repComments, setRepComments] = useState<{ [key: string]: Comment[] }>(
    {}
  );
  const navigatee = useNavigate();
  const { reset } = useForm<FormValues>();

  const fetchUserDetails = async (userId: string): Promise<string> => {
    try {
      const userData: User = await getOneUser(userId);
      return userData.name;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return "Unknown User";
    }
  };

  const fetchComments = async () => {
    if (!id) {
      console.log("No product ID provided");
      return;
    }
    try {
      const commentData = (await getCommentProduct(id)) || [];

      if (Array.isArray(commentData)) {
        const commentsWithUser = await Promise.all(
          commentData.map(async (comment: Comment) => {
            const userName = await fetchUserDetails(comment?.user);
            return { ...comment, user: userName };
          })
        );
        setComments(commentsWithUser);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchProducts = async () => {
    if (!id) {
      console.log("No product ID provided");
      return;
    }
    try {
      const productData = await getOneProduct(id);
      if (productData && productData.product) {
        setProduct(productData.product);
      } else {
        console.error("No product found for the given ID");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchRepComment = async (commentId: string) => {
    if (!commentId) {
      console.log("No comment ID provided");
      return;
    }
    try {
      const response = await getRepComment(commentId);
      setRepComments((prevRepComments) => ({
        ...prevRepComments,
        [commentId]: response || [],
      }));
    } catch (error) {
      console.error("Error fetching rep comment:", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!id || !commentId) {
      console.log("No product ID or comment ID provided");
      navigatee("/admin/listComments");
      return;
    }
    try {
      const result = await MySwal.fire({
        title: "Xóa bình luận?",
        text: "Bạn có chắc muốn xóa bình luận này không!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa!",
        cancelButtonText: "Hủy",
      });
      if (result.isConfirmed) {
        try {
          const productData = await deleteCommentAdmin(id, commentId);
          MySwal.fire({
            title: "Đã Xóa!",
            text: "Bình luận đã được xóa.",
            icon: "success",
          });
          fetchComments();
          if (productData && productData.product) {
            setProduct(productData.product);
          }
          if (!id && !commentId) {
            navigatee("/admin/listComments");
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi xóa bình luận.",
            icon: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error showing confirmation dialog:", error);
    }
  };
  const deleteRep = async (id_repComment: string, commentId: string) => {
    if (!id_repComment) {
      console.log("No reply comment ID provided");
      return;
    }
    try {
      const result = await MySwal.fire({
        title: "Xóa phản hồi bình luận?",
        text: "Bạn có chắc muốn xóa phản hồi bình luận này không!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa!",
        cancelButtonText: "Hủy",
      });
  
      if (result.isConfirmed) {
        try {
          const response = await deleteRepComment(id_repComment);
  
          if (response.success) {
            await MySwal.fire({
              title: "Đã Xóa!",
              text: "Phản hồi bình luận đã được xóa.",
              icon: "success",
            });
            setRepComments((prevRepComments) => {
              const updatedComments = { ...prevRepComments };
              updatedComments[commentId] = updatedComments[commentId].filter(
                (repComment) => repComment._id !== id_repComment
              );
              return updatedComments;
            });
  
            fetchComments();
          } else {
            throw new Error("Xóa bình luận phản hồi không thành công");
          }
        } catch (error) {
          console.error("Error deleting reply comment:", error);
          await MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi xóa phản hồi bình luận.",
            icon: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error showing confirmation dialog:", error);
    }
  };
  

  const openForm = (commentId: string) => {
    setOpenCommentId(commentId);
    setContent({ text: "" }); // Đặt lại nội dung của form
  };

  const closeForm = () => {
    setOpenCommentId(null);
  };

  const handleReplySubmit = async (
    event: React.FormEvent,
    idComment: string
  ) => {
    event.preventDefault();

    const replyContent = content[idComment] || "";// Lấy nội dung từ đối tượng content

    if (!idComment || !replyContent) {
      console.log("Lỗi: Thiếu thông tin id_comment hoặc nội dung bình luận");
      return;
    }

    const commentData = {
      content: replyContent,
      id_comment: idComment,
    };

    try {
      const response = await postRepComment(idComment, commentData);
      console.log("Comment submitted:", response);
      setComments((prevComments) => [...prevComments, response.data]);
      notify();
      reset();
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }

    closeForm();
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    commentId: string
  ) => {
    setContent((prev) => ({ ...prev, [commentId]: event.target.value }));
  };

  useEffect(() => {
    fetchComments();
    fetchProducts();
  }, [id]);
  useEffect(() => {
    comments.forEach((comment) => {
      fetchRepComment(comment?._id);
    });
  }, [comments]);
  
  return (
    <>
      {/* Product */}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="p-4">Tên Sản Phẩm</th>
            <th className="p-4">Giá</th>
            <th className="p-4">Hình Ảnh</th>
          </tr>
        </thead>
        <tbody>
          {product ? (
            <tr className="border-b text-left dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="px-4 py-3">{product.product_name}</td>
              <td className="px-4 py-3">{product.product_price}</td>
              <td className="px-4 py-3">
                {product.image && product.image[0] && (
                  <img
                    src={product.image[0]}
                    width={100}
                    height={50}
                    alt={product.product_name}
                  />
                )}
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={3}>Loading product...</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Comments */}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="p-4">Stt</th>
            <th className="p-4">Tên người bình luận</th>
            <th className="p-4">Đánh giá</th>
            <th className="p-4">Nội dung bình luận</th>
            <th className="p-4">Phản hồi bình luận</th>

            <th className="p-4 text-center">Chức Năng</th>
          </tr>
        </thead>
        <tbody>
          {comments?.length > 0 ? (
            comments?.map((comment, index) => (
              <React.Fragment key={comment?._id}>
                <tr className="border-b text-center dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{comment?.user}</td>
                  <td className="px-4 py-3 text-sm text-yellow-400">
                    {Array.from({ length: comment?.rating }, (_, i) => (
                      <span key={i}>
                        <i className="fa-solid fa-star"></i>
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3">{comment?.content}</td>
                  <td className="px-4 py-3">
                    {repComments[comment?._id]?.map((repComment) => (
                      <div key={repComment?._id} className="ml-4">
                        <div className="font-bold">{repComment?.user}</div>
                        <div>{repComment?.content}</div>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {!(repComments[comment?._id]?.length > 0) && (
                      <button
                        className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        onClick={() => openForm(comment?._id)}
                      >
                        Trả lời
                      </button>
                    )}
                    <button
                      className="py-2 px-3 m-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      onClick={() => deleteComment(comment?._id)}
                    >
                      Xóa
                    </button>
                    {repComments[comment?._id]?.map((repComment) => (
                      <button
                        key={repComment?._id}
                        className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        onClick={() => deleteRep(repComment?._id, comment?._id)}
                      >
                        Xóa phản hồi bình luận
                      </button>
                    ))}
                  </td>
                </tr>

                {/* Reply form */}
                {openCommentId === comment?._id && (
                  <tr>
                    <td colSpan={5}>
                      <form
                        onSubmit={(event) =>
                          handleReplySubmit(event, comment?._id)
                        }
                      >
                        <input
                          type="text"
                          placeholder="Trả lời bình luận"
                          className="w-full p-2 mb-3 border border-gray-300 rounded-md"
                          name="content"
                          value={content[comment?._id] || ""} // Dùng nội dung tương ứng hoặc chuỗi rỗng
                          onChange={(event) =>
                            handleContentChange(event, comment?._id)
                          } // Truyền comment ID
                        />

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="btn bg-blue-600 text-white py-2 px-4 rounded-lg"
                          >
                            Gửi
                          </button>
                          <button
                            type="button"
                            className="btn cancel bg-gray-600 text-white py-2 px-4 rounded-lg"
                            onClick={closeForm}
                          >
                            Đóng
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Loading comments...</td>
              
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ListDetailComment;
