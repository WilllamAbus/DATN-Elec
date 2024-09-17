// Comment.tsx
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Listcomment from "./listComment";
import { getProfileThunk } from "../../../../../redux/auth/authThunk";
import { useAppDispatch } from "../../../../../redux/store";
import { notify } from "../../../../../ultils/success";
import { addComment, getCommentProduct, Comment as CommentType } from "../../../../../services/commnet/comment.service";

interface FormValues {
  content: string;
}

interface DecodedToken {
  id: string;
  name: string;
}

const Comment = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const decodeToken = (token: string): DecodedToken => {
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.id || "",
        name: decoded.name || ""
      };
    } catch (error) {
      console.error("Failed to decode token:", error);
      return { id: "", name: "" };
    }
  };

  const getUserData = (): DecodedToken => {
    const userData = window.localStorage.getItem("persist:root");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const loginData = JSON.parse(parsedData.auth)?.login;
        if (loginData && loginData.token) {
          const token = loginData.token;
          return decodeToken(token);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    return { id: "", name: "" };
  };

  const userDataa = getUserData();

  useEffect(() => {
    if (id) {  // Chỉ chạy khi id tồn tại
      setIsLoggedIn(!!userDataa.id);
      dispatch(getProfileThunk());
      fetchComments(); // Chỉ gọi hàm fetchComments khi id đã có giá trị
    }
  }, [id]); // Thay vì phụ thuộc vào userDataa, chỉ phụ thuộc vào idn

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
    const commentData = {
      content: data.content,
      rating: rating,
      user: userDataa.id,
    };

    try {
      const response = await addComment(id, commentData);
      console.log("Comment submitted:", response);
      setComments((prevComments) => [...prevComments, response.data]);
      notify();
      reset();
      setRating(0); // Reset lại rating về 0
      setHover(0);  // Reset lại hover về 0
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setSuccessMessage(null);
      setErrorMessage("Failed to submit comment.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border gray-300 rounded-lg">
      <div className="container py-8">
        <h2 className="text-2xl font-semibold mb-4">Bình luận</h2>
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

        {/*Listcomment */}
        <Listcomment comments={comments} />

        {isLoggedIn ? (
          <form
            className="mt-6"
            onSubmit={handleSubmit(submitComment)}
          >
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Nhập bình luận của bạn..."
                className="border border-gray-300 px-4 py-2 w-full focus:outline-none focus:border-primary rounded-md"
                {...register("content", { required: true })}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition focus:outline-none"
              >
                Gửi
              </button>
            </div>
            <br />
            <div className="flex items-start space-x-4 mb-4">
              <h3>Đánh giá</h3>
            </div>
            <div className="star flex">
              {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                  <p
                    key={index}
                    className={`fa fa-star ${index <= (hover || rating)
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
          </form>
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
