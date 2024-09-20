import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cmt from "./tetx";
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

  const userData = getUserData();

  useEffect(() => {
    if (id) {
      setIsLoggedIn(!!userData.id);
      dispatch(getProfileThunk());
      fetchComments();
    }
  }, [id]);

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
        user: userData.id,
    };

    try {
        const response = await addComment(id, commentData);
        console.log("Comment submitted:", response);

        const newComment = {
            ...response.data,
            user: userData.name || "Anonymous",
        };

        setComments((prevComments) => [...prevComments, newComment]);
        
        notify();
        reset();
        setRating(0);
        setHover(0);
        fetchComments(); 
    } catch (error) {
        console.error("Error submitting comment:", error);
        setSuccessMessage(null);
        setErrorMessage("Failed to submit comment.");
    }
};


useEffect(() => {
  if (comments.length > 0) {
      console.log("Comments updated:", comments);
  }
}, [comments]);
  return (
    <div className="flex flex-col items-center p-4 border gray-300 rounded-lg">
      <div className="container">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded" role="alert">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded" role="alert">
            {errorMessage}
          </div>
        )}

        <Cmt comments={comments} />

        {isLoggedIn ? (
          <div className="mt-8 md:mt-0 w-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gửi đánh giá của bạn</h2>
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
                        className={`fa fa-star ${index <= (hover || rating) ? "text-yellow-400" : "text-gray-400"}`}
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
