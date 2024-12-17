import { useState, useEffect } from "react";
import { Comment as CommentType, getCommentProduct } from "../../../../../services/commnet/comment.service";

interface AvgRatingProps {
  slug: string; // Nhận slug qua props
  onAverageRating: (averageRating: string) => void; // Callback để truyền giá trị ra ngoài
}

const AvgRating = ({ slug, onAverageRating }: AvgRatingProps) => {
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!slug) return;

      try {
        const productComments = await getCommentProduct(slug);
        setComments(productComments);
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };

    fetchComments();
  }, [slug]);

  
  const totalRatings = comments.reduce((sum, comment) => sum + comment.rating, 0);
  const averageRating = (comments.length > 0 ? (totalRatings / comments.length).toFixed(1) : "0");

  // Truyền giá trị rating trung bình ra ngoài
  onAverageRating(averageRating);

  return null;
};

export default AvgRating;
