import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import ListCmt from "./listComment";
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
  Comment as CommentType,
} from "../../../../../services/commnet/comment.service";
import { addInteraction } from "../../../../../services/interaction/interaction.service";
import { getProfileThunk } from "../../../../../redux/auth/authThunk";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
interface FormValues {
  content: string;
}

const Comment = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const profile = useAppSelector(
    (state: RootState) => state.auth.profile.profile
  );
  const isLoggedIn = !!profile?._id;

  const fetchComments = async () => {
    if (id) {
      try {
        const productComments = await getCommentProduct(id);
        setComments(productComments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    }
  };

  const handleRatingClick = (rate: number) => {
    setRating(rate);
  };
  const submitComment: SubmitHandler<FormValues> = async (data) => {
    if (!isLoggedIn) {
      setErrorMessage("You need to be logged in to submit a comment.");
      return;
    }
    if (!id) {
      setErrorMessage("Product ID is missing.");
      return;
    }
    if (!profile?._id) {
      setErrorMessage("User profile is not available.");
      return;
    }

    const interactionData = {
      user: profile._id,
      orderAuctions: null,
      item: id,
      OrderCart: null,
      productID: id,
      Watchlist: null,
      type: "comment",
      score: 3,
    };

    const commentData = {
      content: data.content,
      rating: rating,
      id_user: profile?._id,
    };

    try {
      // Sử dụng Promise.all để gọi cả hai API cùng một lúc
      const [commentResponse, interactionResponse] = await Promise.all([
        addComment(id, commentData),
        addInteraction(interactionData),
      ]);

      console.log("Comment submitted:", commentResponse);
      console.log("Interaction submitted:", interactionResponse);

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
          setComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== commentId)
          );

          MySwal.fire({
            title: "Đã Xóa!",
            text: "Bình luận đã được xóa.",
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
    } catch (error) {
      console.error("Error showing confirmation dialog:", error);
    }
  };
  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);
  useEffect(() => {
    // console.log(profile);

    if (id) {
      fetchComments();
    }
  }, [id]);
  // useEffect(() => {
  //   if (comments.length > 0) {
  //     console.log("Comments updated:", comments);
  //   }
  // }, [comments]);

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

        <ListCmt comments={comments} onDelete={deleteComment} />

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
                  {...register("content", { required: true })}
                ></textarea>
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
