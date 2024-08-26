import { Rating } from "flowbite-react";

interface CommentRatingProps {
  rating: number;
}

export function CommentRating({ rating }: CommentRatingProps) {
  return (
    <td className="px-4 py-3">
      <Rating>
        {[...Array(5)].map((_, index) => (
          <Rating.Star key={index} filled={index < rating} />
        ))}
        <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{rating} trên 5</p>
      </Rating>
    </td>
  );
}
