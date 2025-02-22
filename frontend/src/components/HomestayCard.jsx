import PropTypes from "prop-types";

const HomestayCard = ({ homestay }) => {
    return (
        <div className="homestay-card">
            <img src={homestay.images.split(",")[0]} alt={homestay.name} />
            <h3>{homestay.name}</h3>
            <p>📍 {homestay.address}</p>
            <p>🏠 Loại: {homestay.type}</p>
            <p>👥 Số khách tối đa: {homestay.max_guests}</p>
            <p>📖 Mô tả: {homestay.description}</p>
            <p>💰 {homestay.base_price} / night</p>
        </div>
    );
};

HomestayCard.propTypes = {
    homestay: PropTypes.shape({
        host_id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        images: PropTypes.string.isRequired,
        base_price: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        max_guests: PropTypes.number.isRequired,
        ward: PropTypes.number.isRequired,
        district: PropTypes.number.isRequired,
        city: PropTypes.number.isRequired,
        province: PropTypes.number.isRequired,
    }).isRequired,
};

export default HomestayCard;
