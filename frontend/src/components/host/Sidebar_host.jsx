import { useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";

function LeftSidebar({ onSelectHomestay }) {
  const [homestays, setHomestays] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axiosInstance
        .get("host/homestays/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setHomestays(res.data))
        .catch((err) =>
          console.error("Error fetching homestays in sidebar:", err)
        );
    }
  }, []);

  return (
    <div
      className={`
        relative bg-gray-100 h-screen overflow-y-auto transition-all duration-300 
        ${collapsed ? "w-16" : "w-full md:w-1/4"} p-4
      `}
    >
      {!collapsed && (
        <>
          <h2 className="text-xl font-bold mb-4">Homestays</h2>
          <ul className="space-y-2">
            {homestays.map((homestay) => (
              <li
                key={homestay.id}
                onClick={() => onSelectHomestay(homestay.id)}
                className="cursor-pointer p-2 hover:bg-gray-300 rounded-md"
              >
                {homestay.name}
              </li>
            ))}
          </ul>
        </>
      )}
      {/* Nút toggle thu gọn/ mở rộng */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-4 left-4 bg-blue-600 text-white p-2 rounded-full focus:outline-none shadow-md"
      >
        {collapsed ? (
          // Khi sidebar thu gọn, hiển thị icon mở rộng (ví dụ: mũi tên sang phải)
          <span className="transform rotate-0">&#x276F;</span>
        ) : (
          // Khi sidebar mở rộng, hiển thị icon thu gọn (ví dụ: mũi tên sang trái)
          <span className="transform rotate-180">&#x276F;</span>
        )}
      </button>
    </div>
  );
}

export default LeftSidebar;