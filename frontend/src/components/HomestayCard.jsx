import PropTypes from "prop-types";

const HomestayCard = ({ homestay }) => {
    return (
        <div className="homestay-card">
            {/* <img src={homestay.images.split(",")[0]} alt={homestay.name} /> */}
            <h3>{homestay.name}</h3>
            <p>📍 {homestay.address}</p>
            <p>💰 {homestay.base_price} / night</p>
        </div>
    );
};

HomestayCard.propTypes = {
    homestay: PropTypes.shape({
        name: PropTypes.string.isRequired,
        images: PropTypes.string.isRequired,
        base_price: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
    }).isRequired,
};

export default HomestayCard;
