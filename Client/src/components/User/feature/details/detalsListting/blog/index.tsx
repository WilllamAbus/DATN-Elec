// Blog.tsx
"use client";

import React, { useState } from "react";
import { Tabs, Tab, Card, Spacer } from "@nextui-org/react";
import Specification from "../cpnDetailPage/specification";
import Article from "../cpnDetailPage/article";
import { Post ,ProductVariant} from "../../../../../../services/detailProduct/types/getDetailProduct"; 

interface BlogProps {
  post: Post; 
  variants: ProductVariant[]; 
}

const Blog: React.FC<BlogProps> = ({ post,variants  }) => { 
  const [selected, setSelected] = useState<string>("specification");


  return (
    <div className="flex items-center justify-center px-2 sm:px-2 md:px-8 py-4">
      <Card className="p-2 sm:p-12 w-full max-w-6xl shadow-none">
        <Tabs
          fullWidth
          size="md"
          aria-label="Options"
          color="primary"
          variant="bordered"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
        >
          <Tab key="specification" title="Thông số kỹ thuật">
            <form method="POST" className="pt-4">
            <Specification variants={variants} />
              <Spacer y={3} />
            </form>
          </Tab>
          <Tab key="article" title="Bài viết">
            <form method="POST" className="pt-4">
              <Article post={post} /> 
              <Spacer y={3} />
            </form>
          </Tab>
        </Tabs>
        <Spacer y={2} />
      </Card>
    </div>
  );
};

export default Blog;
