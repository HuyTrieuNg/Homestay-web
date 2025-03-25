import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(false); // TODO: Cập nhật trạng thái đăng nhập sau
  const [userName] = useState(""); // TODO: Cập nhật tên người dùng sau

  return (
    <header className="bg-white border-b shadow-md">
      <nav className="px-6 py-3">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              alt="Logo"
              className="h-8 mr-3"
            />
            <span className="text-xl font-semibold text-gray-900">Homestay App</span>
          </a>

          {/* Menu Desktop */}
          <div className="flex space-x-6">
            <button
              onClick={() => navigate("/host/")}
              className="text-gray-700 hover:text-blue-600"
            >
              Homestay của tôi
            </button>
            <button
              onClick={() => navigate("/host/newhomestay/")}
              className="text-gray-700 hover:text-blue-600"
            >
              Thêm Homestay
            </button>
            <button
              onClick={() => navigate("/host/booking")}
              className="text-gray-700 hover:text-blue-600"
            >
              Yêu cầu thuê
            </button>
            <button
              onClick={() => navigate("/calendar")}
              className="text-gray-700 hover:text-blue-600"
            >
              Lịch
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <img
                  src="https://i.pravatar.cc/40"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>{userName || "Người dùng"}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
