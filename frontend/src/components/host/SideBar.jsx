import { useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";

function Sidebar({ onSelectHomestay, selectedHomestay, refresh }) {
  const [homestays, setHomestays] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("host/homestays/")
      .then((response) => setHomestays(response.data))
      .catch((error) => console.error("Error fetching homestays:", error));
  }, [refresh]);

  useEffect(() => {
    axiosInstance
      .get("homestay-types/")
      .then((response) => setTypes(response.data))
      .catch((error) => console.error("Error fetching homestay types:", error));
  }, [refresh]);

  return (
    <div className="bg-gray-100 h-screen w-full md:w-1/4 border-r shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-5 text-gray-900">Homestays Của bạn </h2>

      <ul className="space-y-2">
        {homestays.map((homestay) => {
          const isSelected = homestay.id === selectedHomestay;
          return (
            <li
              key={homestay.id}
              onClick={() => onSelectHomestay(homestay.id)}
              className={`cursor-pointer flex items-center p-3 rounded-lg transition duration-200 
                ${isSelected ? "bg-blue-100 border-l-4 border-blue-500" : "hover:bg-gray-100 hover:scale-105"}`}
            >
              {/* Hình ảnh homestay */}
              {homestay.images[0] ? (
                <img
                  src={homestay.images[0].image}
                  alt={homestay.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Không có ảnh</span>
                </div>
              )}

              {/* Thông tin homestay */}
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-800">{homestay.name}</h3>
                <p className="text-sm text-gray-600">
                  {types.find((a) => a.value === homestay.type)?.label || "Đang tải loại..."}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
