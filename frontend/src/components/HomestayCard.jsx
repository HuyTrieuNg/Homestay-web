import PropTypes from "prop-types";

const HomestayCard = ({ homestay }) => {
    const imageUrl = homestay.images.length > 0 ? homestay.images[0] : "";

    return (
        <div className="homestay-card">
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
        name: PropTypes.string.isRequired,
        images: PropTypes.string.isRequired,
        base_price: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
    }).isRequired,
};

export default HomestayCard;
