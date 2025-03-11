import PropTypes from "prop-types";

function AmenityList({ amenities }) {
  if (!amenities || amenities.length === 0) {
    return <p>Không có tiện nghi nào.</p>;
  }

  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.category || "Khác";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(groupedAmenities).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <ul className="space-y-1 text-gray-700">
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
