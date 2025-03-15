import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axiosInstance from "@utils/axiosInstance";
import { IoFilterSharp } from "react-icons/io5";

const PropertyFilter = ({ onSelectPropertyType }) => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("homestays/property-types")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPropertyTypes(response.data);
        } else {
          console.error("Invalid data format:", response.data);
          setPropertyTypes([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching property types:", error);
        setError("Failed to load property types");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectProperty = (id) => {
    console.log("Selected property type:", id);
    setSelectedProperty(id);
    onSelectPropertyType(id); // 🔥 Gọi hàm callback để cập nhật `property_type_id`
  };

  return (
    <div>
      <div className="flex items-center space-x-6 overflow-x-auto p-4 shadow-md w-full h-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          propertyTypes.map((property) => (
            <button
              key={property.id}
              className={`px-3 py-2 text-gray-500 hover:text-black transition-all cursor-pointer underline-offset-4
                ${
                  selectedProperty === property.id
                    ? "underline text-black"
                    : "no-underline"
                } 
                hover:underline flex items-center justify-center`}
              onClick={() => handleSelectProperty(property.id)}
            >
              {property.name}
            </button>
          ))
        )}
        <button className="ml-auto flex items-center space-x-2 border p-2 rounded-full hover:bg-gray-100">
          <span className="text-gray-600">Bộ lọc</span>
          <IoFilterSharp className="text-xl" />
        </button>
      </div>
    </div>
  );
};

// ✅ Prop validation
PropertyFilter.propTypes = {
  onSelectPropertyType: PropTypes.func.isRequired,
};

export default PropertyFilter;
