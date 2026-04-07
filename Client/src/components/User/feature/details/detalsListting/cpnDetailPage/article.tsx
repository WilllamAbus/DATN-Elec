"use client";
import { Post } from "../../../../../../services/detailProduct/types/getDetailProduct"; 
interface ArticleProps {
  post: Post | null;
}

import React from "react";
import NoPostsMessage from "./noPostsMessage";
const Article: React.FC<ArticleProps> = ({ post }) => {
  if (!post) {
    return <NoPostsMessage/>; 
  }
  return (
<div>
<main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
    <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
      <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
      <div key={post._id}>
      <h2 className="text-black text-xl font-medium mb-6">{post.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
      </article>
    </div>
  </main>
</div>
  
  );
};

export default Article;
