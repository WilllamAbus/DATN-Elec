import React, { useEffect, useState } from "react";
import { getRepComment } from "../../../../../services/commnet/comment.service";
import "../../../../../assets/css/user.style.css";

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
        console.log(commentList );
        
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phản hồi:", error);
      }
    };

    fetchComments();
  }, [id_comment]);

  return (
    <>
      {comments.length > 0 ? (
        <div className={`comment-container ${comments && comments.length > 0 ? "show-arrow" : ""}`}> 
  <div className="ml-4 ">
       {comments && comments.length > 0 && <div className="horizontal-line"></div>}
          {comments?.map((comment) => (
            <p key={comment._id} className="text-gray-600">
                    <h1 className="font-medium text-gray-800">E-Com</h1>
              {comment?.content}
            </p>
          ))}
        </div>
        </div>
      
      ) : (
        " "
      )}
    </>
  );
};

export default RepComment;
