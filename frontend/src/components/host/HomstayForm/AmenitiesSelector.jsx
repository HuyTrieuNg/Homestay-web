import React from "react";

const AmenitiesSelector = ({ amenities, selectedAmenities, handleAmenityToggle }) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">Amenities:</label>
      <div className="grid grid-cols-3 gap-2">
        {amenities.map((a) => {
          const isSelected = selectedAmenities.includes(String(a.id));
          return (
            <button
              type="button"
              key={a.id}
              onClick={() => handleAmenityToggle(a.id)}
              className={`px-3 py-1 rounded-md border transition-colors 
                ${isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              {a.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AmenitiesSelector;
