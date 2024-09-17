  import React, { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import "../../../../../assets/css/user.style.css";
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import axios from "axios";
  import { getCommentProduct
    
    } from "../../../../../services/commnet/comment.service";
  import RepComment from "../comment/repComment";

  import "react-toastify/dist/ReactToastify.css";
  import { Comment as CommentType } from "../../../../../services/commnet/comment.service";

  interface ListcommentProps {
    comments: CommentType[];
  }
 
  interface User {
    _id?: string; // ID của người dùng
    name?: string;
    avatar? : string;
  }


  const Listcomment: React.FC<ListcommentProps> = ({ comments }) => {
    const [userNames, setUserNames] = useState<{ [key: string]: User }>({});
    const { id } = useParams<{ id: string }>();
    const fetchComments = async () => {
      if (!id) {
        console.log("ID sản phẩm không tồn tại");
        return;
      }
  
      try {
        const productComments: CommentType[] = await getCommentProduct(id);
        const userIds = Array.from(
          new Set(productComments.map((comment) => comment.user.toString()))
        );
  
        const userNameResponses = await Promise.all(
          userIds.map((userId) =>
            axios.get(`http://localhost:4000/api/product/userID/${userId}`)
          )
        );
  
        const userNameMap = userNameResponses.reduce((map, response) => {
          const user = response.data;
          if (user._id) {
            map[user._id] = {
              name: user.name || "Anonymous",
              avatar: user.avatar || "default-avatar.png",
            };
          }
          return map;
        }, {} as { [key: string]: User });
  
        setUserNames(userNameMap);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    

    useEffect(() => {
      fetchComments();
    }, [id]);

    
    return (
      <div>
        {comments?.length > 0 ? (
          comments?.map((comment) => (
            <div key={comment?._id} className="flex items-start space-x-4 mb-6 relative">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={userNames[comment?.user]?.avatar || "default-avatar.png"}
                  alt="No avatar"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">
                  {userNames[comment?.user]?.name || "Anonymous"}
                  </p>
                  <p className="text-gray-600">{comment?.content}</p>
                </div>
                <div className="text-yellow-400">
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`fa fa-star ${index < comment?.rating ? "text-yellow-400" : "text-gray-400"}`}
                    ></i>
                  ))}
                </div>
                <br></br>  
                <RepComment id_comment={comment?._id} />
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có bình luận</p>
        )}
      </div>
    );
  };

  export default Listcomment;
