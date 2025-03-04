import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const HomestayCard = ({ homestay }) => {
  const navigate = useNavigate();
  const imageUrl = homestay.images.length > 0 ? homestay.images[0] : "";

  const handleClick = () => {
    navigate(`/homestays/${homestay.id}`);
  };

  return (
    <div className="homestay-card" onClick={handleClick}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={homestay.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
          }}
        />
      )}
      <h3>{homestay.name}</h3>
      <p>📍 {homestay.address}</p>
      <p>💰 {homestay.base_price} / night</p>
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
