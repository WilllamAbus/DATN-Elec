// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "react-toastify/dist/ReactToastify.css";
// import RepComment from "./repComment";
// import RatingStats from "./ratingStats";
// import { getProfileThunk } from "../../../../../redux/auth/authThunk";
// import {
//   RootState,
//   useAppDispatch,
//   useAppSelector,
// } from "../../../../../redux/store";

// import {
//   getCommentProduct,
//   Comment as CommentType,
//   getUserComment,
// } from "../../../../../services/commnet/comment.service";

// interface ListcommentProps {
//   comments: CommentType[];
//   onDelete: (commentId: string) => void;
// }

// interface User {
//   _id?: string;
//   name?: string;
//   avatar?: string;
// }

// const ListCmt: React.FC<ListcommentProps> = ({ comments, onDelete }) => {
//   const [userNames, setUserNames] = useState<{ [key: string]: User }>({});
//   const { id } = useParams<{ id: string }>();
//   const [visibleCount, setVisibleCount] = useState(2);

//   const dispatch = useAppDispatch();
//   const profile = useAppSelector(
//     (state: RootState) => state.auth.profile.profile
//   );

//   const handleShowMore = () => {
//     setVisibleCount(comments.length);
//   };
//   if (!profile?._id) {
//     console.log("User profile is not available.");
//     return;
//   }
//   const fetchComments = async () => {
//     if (!id) {
//       // console.log("ID sản phẩm không tồn tại");
//       return;
//     }

//     try {
//       const productComments: CommentType[] = await getCommentProduct(id);

//       const userIds = Array.from(
//         new Set(productComments.map((comment) => comment.id_user.toString()))
//       );

//       const userNameResponses = await Promise.all(
//         userIds.map((userId) => getUserComment(userId))
//       );

//       const userNameMap = userNameResponses.reduce((map, response) => {
//         const user = response;
//         if (user?._id) {
//           map[user?._id] = {
//             name: user?.name,
//             avatar: user?.avatar,
//           };
//         }
//         return map;
//       }, {} as { [key: string]: User });

//       setUserNames(userNameMap);

//       // console.log("User Name Map:", userNameMap);
//     } catch (error) {
//       console.error("Lỗi:", error);
//     }
//   };
//   useEffect(() => {
//     dispatch(getProfileThunk());
//   }, [dispatch]);
//   useEffect(() => {
//     fetchComments();
//   }, [id]);

//   return (
//     <>
//       {comments?.length > 0 ? (
//         <section className="bg-white py-4 dark:bg-gray-900">
//           <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
//             <div className="flex flex-col md:flex-row items-start justify-between">
//               {/* Phần đánh giá */}
//               <div className="md:w-2/3">
//                 <RatingStats comments={comments} />
//                 {/* Nội dung bình luận */}
//                 {comments.slice(0, visibleCount).map((comment) => {
//                   return (
//                     <div
//                       key={comment._id}
//                       className="mt-6 divide-y divide-gray-200 dark:divide-gray-700"
//                     >
//                       <div className="gap-3 pb-6 sm:flex sm:items-start">
//                         <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
//                           <div className="space-y-0.5">
//                             <div className="flex items-start space-x-4">
//                               {userNames[comment.id_user]?.avatar ? (
//                                 <img
//                                   className="h-10 w-10 rounded-full"
//                                   src={userNames[comment.id_user]?.avatar}
//                                 />
//                               ) : (
//                                 <img
//                                   className="h-10 w-10 rounded-full"
//                                   src="/src/assets/images/cmt-Noavatar.png"
//                                   alt="No avatar"
//                                 />
//                               )}

//                               <div>
//                                 <p className="text-base font-semibold text-gray-900 dark:text-white inline-flex items-center">
//                                   <p>
//                                     {userNames[comment.id_user]?.name ||
//                                       "Loading..."}
//                                   </p>
//                                 </p>
//                                 <div className="flex items-center gap-1 mt-1">
//                                   {[...Array(5)].map((_, index) => (
//                                     <svg
//                                       key={index}
//                                       className={`h-4 w-4 ${
//                                         index < comment.rating
//                                           ? "text-yellow-300"
//                                           : "text-gray-400"
//                                       }`}
//                                       aria-hidden="true"
//                                       xmlns="http://www.w3.org/2000/svg"
//                                       fill="currentColor"
//                                       viewBox="0 0 24 24"
//                                     >
//                                       <path d="M12 17.27l-5.18 3.01c-.53.3-1.17-.14-1.17-.76v-6.05L1.7 9.04c-.76-.75-.36-2.04.71-2.21l6.62-.49 2.96-6.01c.39-.79 1.57-.79 1.96 0l2.96 6.01 6.62.49c1.07.08 1.47 1.46.71 2.21l-4.95 4.43v6.05c0 .62-.64 1.06-1.17.76L12 17.27z" />
//                                     </svg>
//                                   ))}
//                                 </div>
//                                 <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
//                                   {comment.createdAt?.slice(0, 10)}
//                                 </p>
//                                 <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
//                                   <p className="text-base font-normal text-gray-500 dark:text-gray-400">
//                                     {comment.content}
//                                   </p>
//                                   {comment.id_user === profile._id ? (
//                                     <div className="space-x-3">
//                                       <button
//                                         onClick={() => onDelete(comment._id)}
//                                       >
//                                         Xoá
//                                       </button>
//                                     </div>
//                                   ) : (
//                                     <div className="h-4"></div>
//                                   )}

//                                   <div className="flex items-center gap-4">
//                                     {/* RepComment */}
//                                     <RepComment id_comment={comment._id} />
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//           {visibleCount < comments.length && (
//             <div className="w-full text-center">
//               <button
//                 type="button"
//                 className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
//                 onClick={handleShowMore}
//               >
//                 Xem thêm
//               </button>
//             </div>
//           )}
//         </section>
//       ) : (
//         <p>Chưa có bình luận</p>
//       )}
//     </>
//   );
// };

// export default ListCmt;
