import React, { useEffect, useState } from "react";
import { getRepComment } from "../../../../../services/commnet/comment.service";


interface RepCommentProps {
  id_comment: string;
}

const RepComment: React.FC<RepCommentProps> = ({ id_comment }) => {
  const [repComments, setRepComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentList = await getRepComment(id_comment);
        setRepComments(commentList);
      } catch (error) {
        return error;
      }
    };

    fetchComments();
  }, [id_comment]);

  return (
    <>
      <div
        className={`comment-container ${repComments && repComments?.length > 0 ? "show-arrow" : ""
          }`}
      >
        <div className="ml-4 ">
          {repComments && repComments?.length > 0 && (
            <div className="horizontal-line"></div>
          )}
          {repComments?.map((comment) => (
            <p key={comment?._id} className="text-gray-600">
              <h1 className="font-medium text-gray-800">
                Phản hồi từ người bán
              </h1>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                {comment?.content}
              </p>
            </p>
          ))}
        </div>
      </div>

    </>
  );
};

export default RepComment;
