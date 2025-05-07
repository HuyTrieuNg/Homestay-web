import { useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";

function Sidebar({ onSelectHomestay, selectedHomestay, refresh }) {
  const [homestays, setHomestays] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const PRIMARY_COLOR = "#ff5a5f";

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get("host/homestays/")
      .then((response) => {
        setHomestays(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching homestays:", error);
        setIsLoading(false);
      });
  }, [refresh]);

  useEffect(() => {
    axiosInstance
      .get("homestay-types/")
      .then((response) => setTypes(response.data))
      .catch((error) => console.error("Error fetching homestay types:", error));
  }, [refresh]);

  return (
    <div className="bg-white h-screen w-full border-r shadow-lg p-6 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-5" style={{ color: PRIMARY_COLOR }}>
        Homestays Của Bạn
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: PRIMARY_COLOR }}></div>
        </div>
      ) : homestays.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-3">Bạn chưa có homestay nào</p>
          <button 
            onClick={() => window.location.href = '/host/newHomestay'} 
            className="px-4 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            Tạo homestay mới
          </button>
        </div>
      ) : (
        <ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 custom-scrollbar">
          {homestays.map((homestay) => {
            const isSelected = homestay.id === selectedHomestay;
            return (
              <li
                key={homestay.id}
                onClick={() => onSelectHomestay(homestay.id)}
                className={`cursor-pointer flex items-center p-4 rounded-lg transition-all duration-300 hover:shadow-md
                  ${
                    isSelected
                      ? "bg-pink-50 border-l-4 shadow-lg transform translate-x-2 scale-105"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                style={{ borderLeftColor: isSelected ? PRIMARY_COLOR : "transparent" }}
              >
                {/* Hình ảnh homestay */}
                <div className={`relative transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
                  {homestay.images[0] ? (
                    <div className="relative">
                      <img
                        src={homestay.images[0].image}
                        alt={homestay.name}
                        className={`w-20 h-20 object-cover rounded-lg ${
                          isSelected 
                            ? "ring-2 ring-offset-2 shadow-lg brightness-105" 
                            : "shadow"
                        }`}
                        style={isSelected ? { ringColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, boxShadow: `0 0 0 2px ${PRIMARY_COLOR}` } : {}}
                      />
                      {isSelected && (
                        <div className="absolute w-full h-full top-0 left-0 -m-1">
                          <div className="dot-animation w-2 h-2 rounded-full absolute"
                               style={{ backgroundColor: PRIMARY_COLOR }}></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <div className={`w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center ${
                        isSelected 
                          ? "ring-2 ring-offset-2 shadow-lg" 
                          : "shadow"
                      }`}
                        style={isSelected ? { ringColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, boxShadow: `0 0 0 2px ${PRIMARY_COLOR}` } : {}}
                      >
                        <span className="text-gray-500 text-xs px-2 text-center">Không có ảnh</span>
                      </div>
                      {isSelected && (
                        <div className="absolute w-full h-full top-0 left-0 -m-1">
                          <div className="dot-animation w-2 h-2 rounded-full absolute"
                               style={{ backgroundColor: PRIMARY_COLOR }}></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Thông tin homestay */}
                <div className="ml-4 flex-1">
                  <h3 className={`font-semibold transition-colors duration-300 ${
                    isSelected 
                      ? "text-red-600 text-lg" 
                      : "text-gray-800"
                  }`}>
                    {homestay.name}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isSelected 
                        ? "bg-pink-100 text-red-700" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {types.find((a) => a.value === homestay.type)?.label || "Đang tải..."}
                    </span>
                    {homestay.status === "pending" && (
                      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs ml-2">
                        Đang chờ duyệt
                      </span>
                    )}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="flex flex-col items-center ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" 
                         style={{ color: PRIMARY_COLOR }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #bbb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
        
        @keyframes move-dot {
          0% {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }
          25% {
            top: 50%;
            left: 100%;
            transform: translate(-50%, -50%);
          }
          50% {
            top: 100%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          75% {
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
          }
          100% {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        
        .dot-animation {
          animation: move-dot 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Sidebar;