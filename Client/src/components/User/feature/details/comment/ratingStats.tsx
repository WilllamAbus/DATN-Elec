import { Comment as CommentType } from "../../../../../services/commnet/comment.service";

interface RatingStatsProps {
  comments: CommentType[];
}
const RatingStats = ({ comments }: RatingStatsProps) => {
  if (!comments || comments.length === 0) {
    return <p>Chưa có thống kê.</p>;
  }

  const totalRatings = comments.reduce(
    (sum, comment) => sum + comment.rating,    
    0
  );
  const averageRating =
    comments.length > 0
      ? (totalRatings / comments.length).toFixed(1)
      : " ";
  const ratingCount = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: comments?.filter((comment) => comment.rating === rating).length,
  }));

  const totalComments = comments.length;
  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Đánh giá
        </h2>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`h-4 w-4 ${
                  index < Math.round(Number(averageRating))
                    ? "text-yellow-300"
                    : "text-gray-400"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
              </svg>
            ))}
          </div>
          <p className="text-2xl font-medium leading-none text-gray-900  dark:text-white">
            {averageRating} trên 5
          </p>
        </div>
      </div>

      {/* Phần thống kê */}
      <div className="my-6 gap-8 sm:flex sm:items-start md:my-8">
        <div className="shrink-0 space-y-4">
          <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
            ({comments?.length} đánh giá)
          </p>
        </div>
        <div className="mt-6 min-w-0 flex-1 space-y-3 sm:mt-0">
          {ratingCount.map(({ rating, count }) => {
            const percentage =
              totalComments > 0
                ? `${((count / totalComments) * 100).toFixed(0)}%`
                : "0%";
            return (
              <div key={rating} className="flex items-center gap-2">
                <p className="w-2 shrink-0 text-start text-sm font-medium leading-none text-gray-900 dark:text-white">
                  {rating}
                </p>
                <svg
                  className="h-4 w-4 shrink-0 text-yellow-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                </svg>
                <div className="w-1/2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-1.5 rounded-full bg-yellow-300"
                    style={{ width: percentage }}
                  ></div>
                </div>

                <a
                  href="#"
                  className="w-8 shrink-0 text-right text-sm font-medium leading-none text-primary-700 hover:underline dark:text-primary-500 sm:w-auto sm:text-left"
                >
                  {count}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default RatingStats;
