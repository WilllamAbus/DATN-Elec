import React, { useEffect, useState } from "react";
import { getRepComment } from "../../../../../services/commnet/comment.service";

interface RepCommentProps {
  id_comment: string;
}

const RepComment: React.FC<RepCommentProps> = ({ id_comment }) => {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentList = await getRepComment(id_comment);
        setComments(commentList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phản hồi:", error);
      }
    };

    fetchComments();
  }, [id_comment]);

  return (
    <>
      {comments.length > 0 ? (
        <div className="ml-4">
          <h1>ADMIN</h1>
          {comments.map((comment) => (
            <p key={comment._id} className="text-gray-600">
              {comment.content}
            </p>
          ))}
        </div>
      ) : (
        " "
      )}
    </>
  );
};

export default RepComment;
