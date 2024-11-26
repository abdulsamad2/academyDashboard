import { Star, StarHalf, Star as EmptyStar } from 'lucide-react'; // Example with Lucide

function RatingStars({ rating = 0 }) {
  const maxStars = 5;
  const filledStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = maxStars - filledStars - halfStar;

  return (
    <div className="flex items-center">
      {/* Filled stars */}
      {Array(filledStars)
        .fill(0)
        .map((_, index) => (
          <Star key={`filled-${index}`} className="text-yellow-500" />
        ))}
      {/* Half star */}
      {halfStar ? <StarHalf className="text-yellow-500" /> : null}
      {/* Empty stars */}
      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <EmptyStar key={`empty-${index}`} className="text-gray-400" />
        ))}
    </div>
  );
}

// Usage in JSX
export default RatingStars;
