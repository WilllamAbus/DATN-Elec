import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../../redux/store";
import { notify } from "../../../../../ultils/success";
import {
  addComment,
  getCommentProduct,
  softDeleteComment,
  getUserComment,
  Comment as CommentType,
} from "../../../../../services/commnet/comment.service";
import { getProfileThunk } from "../../../../../redux/auth/authThunk";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import RepComment from "./repComment";
import RatingStats from "./ratingStats";
import Select from "react-select";
const MySwal = withReactContent(Swal);
interface FormValues {
  content: string;
  rating: number;
}
interface User {
  _id?: string;
  name?: string;
  avatar?: string;
}
const Comment = ({ onUpdateAverageRating }: { onUpdateAverageRating: (average: string) => void }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const { register, handleSubmit, reset, formState, setValue } =
    useForm<FormValues>();
  const { slug } = useParams<{ slug: string }>();
  const [visibleCount, setVisibleCount] = useState(2);
  const [userNames, setUserNames] = useState<{ [key: string]: User }>({});
  const dispatch = useAppDispatch();
  const profile = useAppSelector(
    (state: RootState) => state.auth.profile.profile
  );
  const isLoggedIn = !!profile?._id;
  const [numberOfProducts, setNumberOfProducts] = useState("all");
  const [filteredComments, setFilteredComments] = useState<any[]>([]);
  const handleShowMore = () => {
    setVisibleCount(comments.length);
  };

  const options = [
    { value: "all", label: "Tất cả" },
    ...[...Array(5)].map((_, index) => ({
      value: 5 - index ,
      label: (
        <span className="flex items-center ">
          {5 - index }
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
  const calculateAverageRating = (comments: CommentType[]) => {
    const totalRatings = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return comments.length > 0 ? (totalRatings / comments.length).toFixed(1) : " ";
  };
  const fetchComments = async () => {
    if (!slug) {
      // console.log("ID sản phẩm không tồn tại");
      return;
    }

    try {
      const productComments: CommentType[] = await getCommentProduct(slug);
      setComments(productComments);
      setFilteredComments(productComments);
           // Tính lại average rating và gửi lên component cha
           const avgRating = calculateAverageRating(productComments);
           onUpdateAverageRating(avgRating); // Truyền average rating lên component cha
      const userIds = Array.from(
        new Set(productComments.map((comment) => comment.id_user.toString()))
      );

      const userNameResponses = await Promise.all(
        userIds.map((userId) => getUserComment(userId))
      );

      const userNameMap = userNameResponses.reduce((map, response) => {
        const user = response;
        if (user?._id) {
          map[user?._id] = {
            name: user?.name,
            avatar: user?.avatar,
          };
        }
        return map;
      }, {} as { [key: string]: User });

      setUserNames(userNameMap);

      // console.log("User Name Map:", userNameMap);
    } catch (error) {
      console.error("Lỗi:", error);
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

    // const interactionData = {
    //   user: profile._id,
    //   orderAuctions: null,
    //   item: slug,
    //   OrderCart: null,
    //   productID: slug,
    //   Watchlist: null,
    //   type: "comment",
    //   score: 3,
    // };

    const commentData = {
      content: data.content,
      rating: rating,
      id_user: profile?._id,
    };

    try {
      // Sử dụng Promise.all để gọi cả hai API cùng một lúc
      const [commentResponse] = await Promise.all([
        addComment(slug, commentData),
        // addInteraction(interactionData),
      ]);

      console.log("Comment submitted:", commentResponse);
      // console.log("Interaction submitted:", interactionResponse);

      const newComment = {
        ...commentResponse.data, // Đảm bảo sử dụng commentResponse
        id_user: profile.name,
      };

      // Cập nhật danh sách comments
      setComments((prevComments) =>
        Array.isArray(prevComments)
          ? [...prevComments, newComment]
          : [newComment]
      );
      notify();
      reset();
      setRating(0);
      setHover(0);
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setErrorMessage("Failed to submit comment.");
      setSuccessMessage(null);
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

          // Cập nhật state để xoá comment ngay mà không cần reload
          

          MySwal.fire({
            title: "Đã Xóa!",
            text: "Bình luận đã được xóa.",
            icon: "success",
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

  return (
    <div className="flex flex-col items-center p-4 border gray-300 rounded-lg">
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
              <div className="flex flex-col md:flex-row items-start justify-between">
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
                  {/* Nội dung bình luận */}
                  {filteredComments?.slice(0, visibleCount).map((comment) => {
                    return (
                      <div
                        key={comment?._id}
                        className="mt-6 divide-y divide-gray-200 dark:divide-gray-700"
                      >
                        <div className="gap-3 pb-6 sm:flex sm:items-start">
                          <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
                            <div className="space-y-0.5">
                              <div className="flex items-start space-x-4">
                                {userNames[comment?.id_user]?.avatar ? (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={userNames[comment?.id_user]?.avatar}
                                  />
                                ) : (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src="/src/assets/images/cmt-Noavatar.png"
                                    alt="No avatar"
                                  />
                                )}

                                <div>
                                  <p className="text-base font-semibold text-gray-900 dark:text-white inline-flex items-center">
                                    <p>
                                      {userNames[comment?.id_user]?.name ||
                                        "Loading..."}
                                    </p>
                                  </p>
                                  <div className="flex items-center gap-1 mt-1">
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
                                  <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    {comment?.createdAt?.slice(0, 10)}
                                  </p>
                                  <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                                      {comment?.content}
                                    </p>
                                    {comment?.id_user === profile?._id ? (
                                      <div className="space-x-3">
                                        <button
                                          onClick={() =>
                                            deleteComment(comment?._id)
                                          }
                                        >
                                          Xoá
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="h-4"></div>
                                    )}

                                    <div className="flex items-center gap-4">
                                      {/* RepComment */}
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
                  })}
                </div>
              </div>
            </div>
            {visibleCount < comments?.length && (
              <div className="w-full text-center">
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                  onClick={handleShowMore}
                >
                  Xem thêm
                </button>
              </div>
            )}
          </section>
        ) : (
          <p>Chưa có bình luận</p>
        )}

        {isLoggedIn ? (
          <div className="mt-8 md:mt-0 w-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Gửi đánh giá của bạn
            </h2>
            <form onSubmit={handleSubmit(submitComment)}>
              <div className="space-y-4 max-w-full">
                <textarea
                  className="block w-full h-32 p-3 text-sm border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
                Đăng nhập để bình luận
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
