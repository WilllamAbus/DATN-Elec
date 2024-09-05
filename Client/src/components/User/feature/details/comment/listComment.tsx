// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "../../../../../assets/css/user.style.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import axios from "axios";
// import { commentProduct } from "../../../../../services/commnet/comment.service";
// import RepComment from "../comment/repComment";

// interface Comment {
//   _id: string;
//   avatar?: string;
//   content: string;
//   rating: number;
//   id_user: string;
// }

// interface User {
//   name: string;
//   avatar: string;
// }

// const Listcomment: React.FC = () => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [userNames, setUserNames] = useState<{ [key: string]: User }>({});
//   const { id } = useParams<{ id: string }>();

//   const fetchComments = async () => {
//     if (!id) {
//       console.log("id sản phẩm ko tồn tại");
//       return;
//     }

//     try {
//       console.log("id sản phẩm:", id);

//       const productComments = await commentProduct(id);
//       console.log("ds cmt:", productComments);

//       if (Array.isArray(productComments)) {
//         setComments(productComments);

//         const userIds = Array.from(new Set(productComments.map(comment => comment.id_user.toString())));

//         const userNameResponses = await Promise.all(
//           userIds.map(userId => axios.get(`http://localhost:4000/api/product/userID/${userId}`))
//         );

//         const userNameMap = userNameResponses.reduce((map, response) => {
//           const user = response.data;
//           console.log(user);
          
//           if (user && user._id || user.avatar || typeof user.name === 'string') {
//             map[user._id] = {
//               name: user.name,
//               avatar: user.avatar,
//             };
//           } else {
//             console.warn("Invalid user data:", user);
//           }
//           return map;
//         }, {} as { [key: string]: User });

//         setUserNames(userNameMap);
//       } else {
//         setComments([]);
//       }
//     } catch (error) {
//       console.error("lỗi:", error);
//       setComments([]);
//     }
//   };

//   useEffect(() => {
//     fetchComments();
//   }, [id]);

//   return (
//     <div>
//      {comments.length > 0 ? (
//       <>
//         {comments.map((comment) => (
//           <div key={comment._id} className="flex items-start space-x-4 mb-6">
//             <div className="flex-shrink-0">
//               <img
//                 className="h-10 w-10 rounded-full"
//                 src={userNames[comment.id_user]?.avatar || "default-avatar.png"}
//                 alt="No avatar"
//               />
//             </div>
//             <div className="flex-1">
//               <div className="text-sm">
//                 <p className="font-medium text-gray-800">
//                   {userNames[comment.id_user]?.name || "Anonymous"}
//                 </p>
//                 <p className="text-gray-600">{comment.content}</p>
//               </div>
//               <div className="text-yellow-400">
//                 {[...Array(5)].map((_, index) => (
//                   <i
//                     key={index}
//                     className={`fa fa-star ${
//                       index < comment.rating ? "text-yellow-400" : "text-gray-400"
//                     }`}
//                   ></i>
//                 ))}
//               </div>
//               <br></br>
//                 {/* Truyền id_comment vào RepComment */}
//                 <RepComment id_comment={comment._id} />
//             </div>
//           </div>
//         ))}
//       </>
//     ) : (
//       <div>
//         <p>Chưa có bình luận</p>
//       </div>
//     )}
//     </div>
//   );
// };

// export default Listcomment;
