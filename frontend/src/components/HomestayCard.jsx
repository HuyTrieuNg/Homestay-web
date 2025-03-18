import PropTypes from "prop-types";
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
            ❤️
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{homestay.name}</h3>
        <p className="text-gray-500">📍 {homestay.address}</p>
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
    images: PropTypes.string.isRequired,
    base_price: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default HomestayCard;