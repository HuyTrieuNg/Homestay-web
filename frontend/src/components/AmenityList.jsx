import PropTypes from "prop-types";

function AmenityList({ amenities }) {
  if (!amenities || amenities.length === 0) {
    return <p>Không có tiện nghi nào.</p>;
  }

  const groupedAmenities = amenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {});

  return (
    <div>
      <h2>Amenities</h2>
      {Object.entries(groupedAmenities).map(([category, items]) => (
        <div key={category}>
          <h3>{category}</h3>
          <ul>
            {items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

AmenityList.propTypes = {
  amenities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AmenityList;
