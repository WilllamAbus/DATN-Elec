import React, { useEffect, useState } from "react";
import {
  getCommentProducAdmin,
  softDeleteComment,
  postRepComment,
  getRepComment,
  deleteRepComment,
  Comment as CommentType,
} from "../../../../services/commnet/comment.service";
// import { getOneUser } from "../../../../services/user/user.service";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../../assets/css/admin.style.css";
import { notify } from "../../../../ultils/success";
import { useForm } from "react-hook-form";
import { Pagination } from "@nextui-org/react";

const MySwal = withReactContent(Swal);
interface FormValues {
  content: string;
}
interface Content {
  [key: string]: string; // Định nghĩa content như một đối tượng với key là comment ID và value là nội dung
}
const ListDetailComment: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const { id } = useParams<{ id: string }>();
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [content, setContent] = useState<Content>({});
  const [repComments, setRepComments] = useState<{
    [key: string]: CommentType[];
  }>({});

  const navigatee = useNavigate();
  const { reset } = useForm<FormValues>();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageFromUrl = queryParams.get("page");
    if (!pageFromUrl) {
      navigatee(`?page=1`, { replace: true });
    } else {
      setCurrentPage(parseInt(pageFromUrl, 10));
    }
  }, [location.search, navigatee]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigatee(`?page=${page}`);
  };
  const fetchData = async (page: number) => {
    if (!id) {
      console.log("No product ID provided");
      return;
    }

    try {
      const productComments = await getCommentProducAdmin(id, page, 5);
      // console.log("Product Comments:", productComments);
      const commentsData =
        productComments?.data && Array.isArray(productComments.data)
          ? productComments.data
          : [];
      setTotalPages(productComments.totalPages);
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      return;
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
          await softDeleteComment(commentId);

          setComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== commentId)
          );
          fetchData(currentPage);

          MySwal.fire({
            title: "Đã Xóa!",
            text: "Bình luận đã được xóa.",
            icon: "success",
            confirmButtonText: "OK",
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
          });

          // Gọi lại fetchData để làm mới danh sách bình luận
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

          setRepComments((prevRepComments) => {
            const updatedComments = { ...prevRepComments };
            updatedComments[commentId] = updatedComments[commentId].filter(
              (repComment) => repComment._id !== id_repComment
            );
            return updatedComments;
          });
          if (response.success) {
            await MySwal.fire({
              title: "Đã Xóa!",
              text: "Phản hồi bình luận đã được xóa.",
              icon: "success",
              confirmButtonText: "OK",
              showConfirmButton: true,
              confirmButtonColor: "#3085d6",
            });
            fetchData(currentPage);
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
    event: React.FormEvent<HTMLFormElement>,
    idComment: string
  ) => {
    event.preventDefault();

    const replyContent = content[idComment];
    if (!replyContent || !idComment) {
      console.log("Lỗi: Thiếu thông tin id_comment hoặc nội dung bình luận");
      return;
    }

    try {
      const response = await postRepComment(idComment, {
        content: replyContent,
      });
      notify();
      fetchRepComment(idComment);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === idComment
            ? { ...comment, replies: [...(comment.replies || []), response] }
            : comment
        )
      );
      reset();

      setContent((prevContent) => ({ ...prevContent, [idComment]: "" }));
    } catch (error) {
      console.error("Error submitting reply comment:", error);
    } finally {
      closeForm(); // Close form after submission
    }
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    idComment: string
  ) => {
    const { value } = event.target;
    setContent((prevContent) => ({
      ...prevContent,
      [idComment]: value,
    }));
  };
  useEffect(() => {
    fetchData(currentPage);
  }, [id, currentPage]);

  useEffect(() => {
    // Đảm bảo rằng bạn chỉ gọi fetchRepComment sau khi `comments` được lấy
    if (comments.length > 0) {
      comments.forEach((comment) => {
        fetchRepComment(comment?._id);
      });
    }
  }, [comments]);

  return (
    <>
      {/* Comments */}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="p-4">Stt</th>
            <th className="p-4">Tên người đánh giá</th>
            <th className="p-4">Đánh giá</th>
            <th className="p-4">Nội dung </th>
            <th className="p-4">Phản hồi </th>

            <th className="p-4 text-center">Chức Năng</th>
          </tr>
        </thead>
        <tbody>
          {comments?.length > 0 ? (
            comments?.map((comment, index) => (
              <React.Fragment key={index}>
                <tr className="border-b text-center dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    {comment?.id_user?.name || "Loading..."}
                  </td>

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
                        <div>{repComment?.content}</div>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {!(repComments[comment?._id]?.length > 0) && (
                      <button
                        className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        onClick={() => openForm(comment?._id)}
                      >
                        Trả lời
                      </button>
                    )}
                    <button
                      className="flex items-center border font-medium rounded-lg text-sm px-3 py-2 text-center text-red-700 bg-red-200 hover:text-white border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 mt-4"
                      onClick={() => deleteComment(comment?._id)}
                    >
                      Xóa bình luận
                    </button>
                    {repComments[comment?._id]?.map((repComment) => (
                      <button
                        key={repComment?._id}
                        className="flex items-center border font-medium rounded-lg text-sm px-3 py-2 text-center text-red-700 bg-red-200 hover:text-white border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 mt-4"
                        onClick={() => deleteRep(repComment?._id, comment?._id)}
                      >
                        Xóa phản hồi
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
                          handleReplySubmit(event, comment._id)
                        }
                      >
                        <input
                          type="text"
                          placeholder="Trả lời bình luận"
                          className="w-full p-2 mb-3 border border-gray-300 rounded-md"
                          name="content"
                          value={content[comment?._id] || ""} // Dùng nội dung tương ứng hoặc chuỗi rỗng
                          onChange={
                            (event) => handleContentChange(event, comment._id) // Truyền comment ID
                          }
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
              <td colSpan={5}>Không có đánh giá....</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center my-4">
        {comments.length > 0 && (
          <Pagination
            isCompact
            loop
            showControls
            color="primary"
            total={totalPages}
            page={currentPage}
            initialPage={1}
            onChange={(page) => handlePageChange(page)}
          />
        )}
      </div>
    </>
  );
};

export default ListDetailComment;
