import { useState, useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";
import { IoFilterSharp } from "react-icons/io5";

const PropertyFilter = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="flex items-center space-x-6 overflow-x-auto p-4 shadow-md w-full h-auto">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        propertyTypes.map((property) => (
          <button
            key={property.id}
            className="px-2.5 text-gray-500 hover:text-black transition-all cursor-pointer border-b-2 border-transparent hover:border-black flex items-center justify-center h-full py-2"
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
  );
};

export default PropertyFilter;
