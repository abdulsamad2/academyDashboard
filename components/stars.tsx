import { Star, StarHalf } from 'lucide-react';

function RatingStars({ rating = 0 }) {
  const maxStars = 5;
  const filledStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = maxStars - filledStars - halfStar;

  return (
    <div className="flex items-center">
      {Array(filledStars)
        .fill(1)
        .map((_, index) => (
          <Star
            key={`filled-${index}`}
            color="#FFD700"
            fill="#FFD700"
            className="h-4 w-4"
          />
        ))}

      {halfStar > 0 && (
        <StarHalf color="#FFD700" fill="#FFD700" className="h-4 w-4" />
      )}

      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <Star
            key={`empty-${index}`}
            color="#E0E0E0"
            fill="none"
            className="h-4 w-4"
          />
        ))}
    </div>
  );
}

export default RatingStars;
