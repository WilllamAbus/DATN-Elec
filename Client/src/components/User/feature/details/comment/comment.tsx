import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Avatar from "../../../../../assets/images/avatar.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../../../../assets/css/user.style.css";
import { useParams } from "react-router-dom";

interface FormValues {
  comment: string;
}

const Comment = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { id } = useParams<{ id: string }>();

  const handleRatingClick = (rate: number) => {
    setRating(rate);
  };

  const submitComment: SubmitHandler<FormValues> = (data) => {
    console.log("Số sao:", rating);
    console.log("Nội dung bình luận:", data.comment);
    console.log("Id sản phẩm: ",id);
    console.log("Id user:");
    
    
    reset(); // Reset form fields after submission
  };

  return (
    <div className="flex flex-col items-center p-4 border gray-300 rounded-lg">
      <div className="container py-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded"
          role="alert"
        >
          Comment submitted successfully!
        </div>
        <div>
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={Avatar}
                alt="avatar"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <p className="font-medium text-gray-800"></p>
                <p className="text-gray-600">Sản Phẩm Tốt!!!</p>
              </div>
              <div className="text-yellow-400">
                <p className="fa fa-star"></p>
                <p className="fa fa-star"></p>
                <p className="fa fa-star"></p>
                <p className="fa fa-star"></p>
                <p className="fa fa-star"></p>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={Avatar}
                alt="avatar"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <p className="font-medium text-gray-800"></p>
                <p className="text-gray-600">Good!!!</p>
              </div>
              <div className="text-yellow-400">
                <p className="fa fa-star"></p>
                <p className="fa fa-star"></p>
                <p className="fa fa-star"></p>
                <p className="fa fa-star"></p>
                <p className="fa fa-star"></p>
              </div>
            </div>
          </div>
        </div>
        <form
          className="mt-6"
          onSubmit={handleSubmit(submitComment)}
        >
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Enter your comment..."
              className="border border-gray-300 px-4 py-2 w-full focus:outline-none focus:border-primary rounded-md"
              {...register("comment")}
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition focus:outline-none"
            >
              Submit
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
        </form>
      </div>
    </div>
  );
};

export default Comment;
