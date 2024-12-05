import { FaThumbsUp } from "react-icons/fa";
import { topComment } from "../../../services/statistical/statistical.service";
import { useEffect, useState } from "react";
interface ITopComment {
  content?: string;
  createdAt?: string;
  id_product?: string;
  userName?:string;
  userAvatar?:string;
  likesCount?: number;
  replies: string;
}
const TopComment = () => {
  const [comments, setComments] = useState<ITopComment[]>([]);

  const fetchTopComment = async () => {
    try {
      const response = await topComment();
      setComments(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTopComment();
  }, []);
  return (
    <>
      <div className="grid grid-cols-1 my-4 xl:grid-cols-2 xl:gap-4">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800 xl:mb-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top đánh giá được yêu thích
            </h3>
          </div>
          {/* Chat */}
          <form className="overflow-y-auto lg:max-h-[60rem] 2xl:max-h-fit">
            {comments?.map((comment) => (
              <article className="mb-5">
                <footer className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="space-x-4 mt-4 inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white ">
                     
                     <div>
                     {comment?.userAvatar ? (
                        <img
                          className="h-10 w-10 rounded-full "
                          src={comment?.userAvatar}
                        />
                      ) : (
                        <img
                          className="h-10 w-10 rounded-full"
                          src="/src/assets/images/cmt-Noavatar.png"
                          alt="No avatar"
                        />
                      )}
                      </div> 
                   
                      <p >
                      {comment?.userName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 ">
                    {comment?.createdAt?.slice(0, 10)}

                    </p>
                    </div>
                   
                  </div>
                </footer>
                <p className="mb-2 text-gray-900 dark:text-white">
                  {comment.content}
                </p>
                <div className="flex items-center space-x-4">
                <p
                  className="bg-transparent text-yellow-400"
                >
                  <FaThumbsUp />
                </p>
                <p>Hữu ích ({comment?.likesCount})</p>
                </div>
               
              </article>
            ))}
          </form>
        
        </div>
        
      </div>
    </>
  );
};
export default TopComment;
