import { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../../redux/store";
import { notify,notifyUpdate } from "../../../../../ultils/success";
import {
  addComment,
  getCommentProduct,
  softDeleteComment,
  addLike,
  editComment,
  Comment as CommentType,
} from "../../../../../services/commnet/comment.service";
import { getProfileThunk } from "../../../../../redux/auth/authThunk";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import RepComment from "./repComment";
import RatingStats from "./ratingStats";
import Select from "react-select";
import { FaThumbsUp, FaTrash, FaEllipsisV, FaEdit } from "react-icons/fa";
import { differenceInHours } from "date-fns";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
const MySwal = withReactContent(Swal);
interface FormValues {
  content: string;
  rating: number;
}

interface EditComment {
  _id: string;
  content: string;
  rating: number;
}

const Comment = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const { register, handleSubmit, reset, formState, setValue } =
    useForm<FormValues>();
  const { register: registerEdit, handleSubmit: handleSubmitEditForm } =
    useForm<FormValues>();
  const { slug } = useParams<{ slug: string }>();
  const [visibleCount, setVisibleCount] = useState(5);
  const dispatch = useAppDispatch();
  const profile = useAppSelector(
    (state: RootState) => state.auth.profile.profile
  );
  const isLoggedIn = !!profile?._id;
  const [numberOfProducts, setNumberOfProducts] = useState("all");
  const [filteredComments, setFilteredComments] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [editingComment, setEditingComment] = useState<EditComment | null>(
    null
  );
  const [commentContent, setCommentContent] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const handleShowMore = () => {
    setVisibleCount(comments.length);
    setIsExpanded(true);
  };
  const isMounted = useRef(true);

useEffect(() => {
  isMounted.current = true;
  return () => {
    isMounted.current = false;
  };
}, []);

  const handleShowLess = () => {
    setVisibleCount(5); 
    setIsExpanded(false); 
  };
  
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const options = [
    { value: "all", label: "Tất cả" },
    ...[...Array(5)].map((_, index) => ({
      value: 5 - index,
      label: (
        <span className="flex items-center ">
          {5 - index}
          <svg
            className="h-4 w-4 text-yellow-300 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27l-5.18 3.01c-.53.3-1.17-.14-1.17-.76v-6.05L1.7 9.04c-.76-.75-.36-2.04.71-2.21l6.62-.49 2.96-6.01c.39-.79 1.57-.79 1.96 0l2.96 6.01 6.62.49c1.07.08 1.47 1.46.71 2.21l-4.95 4.43v6.05c0 .62-.64 1.06-1.17.76L12 17.27z" />
          </svg>
        </span>
      ),
    })),
  ];
  const handleChange = (selectedOption: any) => {
    const selectedRating = selectedOption.value;
    setNumberOfProducts(selectedRating);

    if (selectedRating === "all") {
      setFilteredComments(comments); // Hiển thị tất cả bình luận
    } else {
      const filtered = comments.filter(
        (comment) => comment.rating === selectedRating
      );
      setFilteredComments(filtered); // Lọc bình luận theo rating
    }
  };
 
  
  const fetchComments = async () => {
    if (!slug) return; 
  
    try {
      const productComments = await getCommentProduct(slug);
  
      setComments(productComments);
      setFilteredComments(productComments);
  
      
    
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
    }
  };
  
  
  const handleRatingClick = (rate: number) => {
    setRating(rate);
    setValue("rating", rate);
  };
  
  const submitComment: SubmitHandler<FormValues> = async (data) => {
    if (!isLoggedIn) {
       setErrorMessage("You need to be logged in to submit a comment.");
       return;
    }
    if (!slug) {
       setErrorMessage("Product ID is missing.");
       return;
    }
    if (!profile?._id) {
       setErrorMessage("User profile is not available.");
       return;
    }
 
    const commentData = {
       content: data.content,
       rating: rating,
       id_user: profile?._id,
       likes: 0,
       replies: null,
    };
 
    try {
       const commentResponse = await addComment(slug, commentData);
       notify();
       fetchComments (); 
       reset();
       setRating(0);
       setHover(0);
       return commentResponse;
    } catch (error) {
       console.error("Error submitting comment:", error);
       setErrorMessage("Failed to submit comment.");
       setSuccessMessage(null);
    }
 };
 
  const handleSubmitEdit: SubmitHandler<FormValues> = async (commentData) => {
    if (!isLoggedIn) {
      setErrorMessage("You need to be logged in to submit a comment.");
      return;
    }
    if (!slug) {
      setErrorMessage("Product ID is missing.");
      return;
    }
    if (!profile?._id) {
      setErrorMessage("User profile is not available.");
      return;
    }

    const idComment = editingComment?._id;

    if (!idComment) {
      setErrorMessage("Comment ID is missing.");
      return;
    }

    const updatedCommentData = {
      commentId: idComment,
      content: commentData.content,
      rating: commentRating,
      id_user: profile?._id,
    };

    try {
      const commentResponse = await editComment(slug, updatedCommentData);
      notifyUpdate();
      reset();
      setCommentContent("");
      setCommentRating(0);
      setHover(0);
      fetchComments();

      setEditingComment(null);
      setIsModalOpen(false);
      return commentResponse;
    } catch (error) {
      console.error("Error submitting comment:", error);
      setErrorMessage("Failed to submit comment.");
    }
  };
  const deleteComment = async (commentId: string) => {
    if (!commentId) {
      return console.log("No comment ID provided");
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
          MySwal.fire({
            title: "Đã Xóa!",
            text: "Bình luận đã được xóa.",
            icon: "success",
            confirmButtonText: "OK",
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
          });
          setComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== commentId)
          );
          fetchComments();
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      }
    } catch (error) {
      console.error("Error showing confirmation dialog:", error);
    }
  };

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);
  useEffect(() => {
    fetchComments();
  }, [slug]);

  const handleLikeCmt = async (commentId: string) => {
    if (!slug) {
      setErrorMessage("Product ID is missing.");
      return;
    }
    if (!profile?._id) {
      setErrorMessage("User profile is not available.");
      return;
    }
    const commentData = {
      commentId: commentId,
      userId: profile?._id,
    };
    try {
      setIsLiked(!isLiked);
      await addLike(slug, commentData);
      fetchComments();
    } catch (error) {
      console.log("Error while liking comment:", error);
    }
  };
  const toggleDeleteButton = (commentId: string) => {
    setSelectedCommentId(selectedCommentId === commentId ? null : commentId);
  };
  const handleEditComment = (comment: any) => {
    setEditingComment(comment);
    setCommentContent(comment.content);
    setCommentRating(comment.rating);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setRating(0);
    setHover(0);
  };
  return (
    <div className="flex flex-col items-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="container">
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded"
            role="alert"
          >
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

{comments?.length > 0 ? (
  <section className="bg-white py-4 dark:bg-gray-900">
    <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
      <div className="flex flex-col md:flex-row items-start">
        {/* Phần đánh giá */}
        <div className="md:w-2/3">
          <RatingStats comments={comments} />

          <div className="mt-4 flex items-center space-x-2">
            <h1>Lọc đánh giá</h1>
            <Select
              value={options.find(
                (option) => option.value === numberOfProducts
              )}
              options={options}
              onChange={handleChange}
              className="border border-black rounded md:w-1/6"
              classNamePrefix="react-select"
              defaultValue={options[0]}
              isSearchable={false}
            />
          </div>

          {filteredComments?.length === 0 ? (
            <p className="text-left text-gray-500 dark:text-gray-400 mt-6">
              Không có đánh giá nào.
            </p>
          ) : (
            filteredComments?.slice(0, visibleCount).map((comment) => {
              const createdAtDate = new Date(comment?.createdAt || "");
              const hoursDifference = differenceInHours(new Date(), createdAtDate);

              return (
                <div
                  key={comment?._id || Math.random()}
                  className="mt-6 divide-y divide-gray-200 dark:divide-gray-700 flex"
                >
                  <div className="gap-3 pb-6 sm:flex sm:items-start">
                    <div className="shrink-0 space-y-2 sm:w-48 md:w-72 w-full">
                      <div className="space-y-0.5">
                        <div className="flex items-start space-x-4">
                          {/* Avatar */}
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              comment?.id_user?.avatar ||
                              "/src/assets/images/cmt-Noavatar.png"
                            }
                            alt="Avatar"
                          />

                          <div>
                            <div className="flex">
                              <p className="text-base font-semibold text-gray-900 dark:text-white inline-flex items-center">
                                {comment?.id_user?.name || "Ẩn danh"}
                              </p>

                              {comment?.id_user?._id === profile?._id &&
                                hoursDifference <= 24 && (
                                  <div className="flex items-center ml-6">
                                    <Dropdown>
                                      <DropdownTrigger>
                                        <button
                                          className="flex items-center justify-center h-8 w-8"
                                          onClick={() =>
                                            toggleDeleteButton(comment?._id)
                                          }
                                        >
                                          <FaEllipsisV />
                                        </button>
                                      </DropdownTrigger>
                                      <DropdownMenu>
                                        <DropdownItem
                                          key="new"
                                          className="flex justify-center"
                                        >
                                          <button
                                            onClick={() =>
                                              deleteComment(comment?._id)
                                            }
                                            className="flex items-center justify-center h-4 w-full text-red-700 bg-transparent"
                                          >
                                            <FaTrash />
                                            <p className="ml-2">Xóa</p>
                                          </button>
                                        </DropdownItem>
                                        <DropdownItem
                                          key="copy"
                                          className="flex justify-center"
                                        >
                                          <button
                                            onClick={() =>
                                              handleEditComment(comment)
                                            }
                                            className="flex items-center justify-center h-4  w-full bg-transparent"
                                          >
                                            <FaEdit />
                                            <p className="ml-2">Chỉnh sửa</p>
                                          </button>
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </Dropdown>
                                  </div>
                                )}
                            </div>

                            <div className="flex items-center gap-1 mt-2">
                              {[...Array(5)].map((_, index) => (
                                <svg
                                  key={index}
                                  className={`h-4 w-4 ${
                                    index < comment?.rating
                                      ? "text-yellow-300"
                                      : "text-gray-400"
                                  }`}
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27l-5.18 3.01c-.53.3-1.17-.14-1.17-.76v-6.05L1.7 9.04c-.76-.75-.36-2.04.71-2.21l6.62-.49 2.96-6.01c.39-.79 1.57-.79 1.96 0l2.96 6.01 6.62.49c1.07.08 1.47 1.46.71 2.21l-4.95 4.43v6.05c0 .62-.64 1.06-1.17.76L12 17.27z" />
                                </svg>
                              ))}
                            </div>

                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-2">
                              {comment?.createdAt?.slice(0, 10)}
                            </p>
                            <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                              <p className="text-base font-normal text-gray-500 dark:text-gray-400 mt-2">
                                {comment?.content || "Không có nội dung."}
                              </p>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <button
                                    className={`bg-transparent ${
                                      comment?.likes?.includes(profile?._id)
                                        ? "text-yellow-400"
                                        : "text-gray-400"
                                    }`}
                                    onClick={() =>
                                      handleLikeCmt(comment?._id)
                                    }
                                  >
                                    <FaThumbsUp />
                                  </button>
                                  <p>
                                    Hữu ích ({comment?.likes?.length || 0})
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <RepComment id_comment={comment?._id} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>

    {visibleCount < filteredComments?.length && filteredComments.length > 5 ? (
      <div className="w-full text-center">
        <button
          onClick={handleShowMore}
          className="rounded-lg bg-blue-500 text-white px-5 py-2"
        >
          Xem thêm
        </button>
      </div>
    ) : (
      isExpanded && (
        <div className="w-full text-center">
          <button
            onClick={handleShowLess}
            className="rounded-lg bg-blue-500 text-white px-5 py-2"
          >
            Thu gọn
          </button>
        </div>
      )
    )}
  </section>
) : (
  <p>Chưa có bình luận</p>
)}


        {/* chỉnh sửa */}
        {isModalOpen && (
          <div className="fixed inset-0 backdrop-filter backdrop-blur-md flex items-center justify-center z-50 min-h-screen">
            <div className="bg-white p-6 rounded-lg w-96 max-w-full sm:w-11/12 md:w-96 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Chỉnh sửa đánh giá</h3>
              <form onSubmit={handleSubmitEditForm(handleSubmitEdit)}>
                <textarea
                  value={commentContent}
                  className="block w-full h-32 p-3 text-sm border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 resize-none"
                  placeholder={commentContent}
                  {...registerEdit("content", {
                    required: "Nội dung chỉnh sửa không được bỏ trống",
                    onChange: (e) => setCommentContent(e.target.value),
                  })}
                />

                <div className="flex items-center gap-1 mt-1">
                  <div className="flex gap-2 mb-4">
                    {[...Array(5)].map((_, index) => {
                      index += 1;
                      return (
                        <p
                          key={index}
                          className={`fa fa-star cursor-pointer ${
                            index <= (hover || commentRating)
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                          onClick={() => setCommentRating(index)}
                          onMouseEnter={() => setHover(index)}
                          onMouseLeave={() => setHover(commentRating)}
                        ></p>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Cập nhật
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModalClose()}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    Bỏ qua
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLoggedIn ? (
          <div className="mt-8 md:mt-0 w-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Gửi đánh giá của bạn
            </h2>
            <form onSubmit={handleSubmit(submitComment)}>
              <div className="space-y-4 max-w-full">
                <textarea
                  className="block w-full h-32 p-3 text-sm border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 resize-none"
                  placeholder="Viết bình luận của bạn..."
                  {...register("content", {
                    required: "Đánh giá chưa nó nội dung",
                  })}
                ></textarea>
                {formState.errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.content.message}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, index) => {
                    index += 1;
                    return (
                      <p
                        key={index}
                        className={`fa fa-star ${
                          index <= (hover || rating)
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                        onClick={() => handleRatingClick(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                      ></p>
                    );
                  })}
                </div>
                <input
                  type="hidden"
                  {...register("rating", {
                    required: "Vui lòng chọn đánh giá của bạn",
                    validate: (value) =>
                      value > 0 || "Vui lòng chọn đánh giá của bạn",
                  })}
                  value={rating}
                />
                {formState.errors.rating && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.rating.message}
                  </p>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <Link to="/login">
              <button className="bg-blue-600 border border-blue-600 text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-transparent hover:text-blue-600 transition">
                Đăng nhập để đánh giá
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
