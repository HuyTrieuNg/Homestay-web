import PropTypes from "prop-types";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomestayCard = ({ homestay }) => {
  const navigate = useNavigate();
  const imageUrl = homestay.images.length > 0 ? homestay.images[0] : "";

  const handleClick = () => {
    navigate(`/homestays/${homestay.id}`);
  };

  return (
    <div
      className="cursor-pointer rounded-xl shadow-lg overflow-hidden bg-white"
      onClick={handleClick}
    >
      {imageUrl && (
        <div className="relative">
          <img
            src={imageUrl}
            alt={homestay.name}
            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
          />
          {/* Icon yêu thích */}
          <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md">
            <Heart className="text-red-500" />
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{homestay.name}</h3>
        <p className="text-gray-500">📍 {[
          homestay.address,
          homestay.province?.name,
          homestay.district?.name,
          homestay.commune?.name,
        ].filter(Boolean).join(", ")}
        </p>
        <div className="flex items-center mt-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="ml-1 text-gray-700 font-medium">{homestay.rating?.toFixed(1) || 0}</span>
          <span className="mx-1 text-gray-500">·</span>
          <span className="text-gray-500">{homestay.review_count || 0} đánh giá</span>
        </div>
        <p className="text-gray-700 mt-1">
          <span className="font-semibold">💰 {homestay.base_price}</span> / đêm
        </p>
      </div>
    </div>
  );
};

HomestayCard.propTypes = {
  homestay: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    base_price: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    rating: PropTypes.number,
    review_count: PropTypes.number,
  }).isRequired,
};

export default HomestayCard;
