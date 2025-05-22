import { useContext, useEffect, useState } from "react";
import { Globe, Menu, User } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import AuthContext from "@/context/AuthContext";

const Navbar = () => {
  const [avatar, setAvatar] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const { logoutUser } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      axiosInstance
        .get("/profile/avatar")
        .then((response) => {
          console.log("API Response:", response.data);
          setAvatar(response.data.avatar_url);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [isAuthenticated]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logoutUser();
    navigate("/login");
  };

  const handleNavigateOnDropdown = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <div className="font-sans">
      {/* Main Navigation Bar */}
      <nav className="flex items-center justify-between px-10 pt-4">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/drfwzrqqj/image/upload/v1747688845/create_logo_for_stayhub_with_1_1_ratio_no_text_primary_color_FF5A5F_no_background_eiqhu7.png" 
            alt="Logo"
            className="h-10 w-10 mr-3 rounded-full scale-150"
          />
          <span className="text-2xl font-bold transition-colors duration-300 " style={{ color: "#FF5A5F" }}>
            StayHub
          </span>
        </div>

        {/* Center Navigation */}
        <div className="flex-1 flex justify-center">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-gray-200 shadow-sm">
            <button className="px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-full font-medium">
              Đặt phòng
            </button>
            <div className="h-5 border-r border-gray-300 mx-1"></div>
            <button
              className="px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-full font-medium"
              onClick={() => navigate("/host")}
            >
              Cho thuê
            </button>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Globe className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 border border-gray-300 rounded-full p-1 hover:shadow-md"
          >
            <Menu className="h-5 w-5 text-gray-700 ml-2" />
            {avatar ? (
              <>
                <img
                  src={avatar || "/default-avatar.png"} // Dùng ảnh user hoặc ảnh mặc định
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </>
            ) : (
              <div className="bg-gray-500 text-white rounded-full p-1">
                <User className="h-6 w-6" />
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-6 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {isAuthenticated ? (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => handleNavigateOnDropdown("/profile")}
                >
                  Thông tin tài khoản
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => handleNavigateOnDropdown("/bookinghistory")}
                >
                  Lịch sử đặt phòng
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => handleNavigateOnDropdown("/login")}
                >
                  Đăng nhập
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => handleNavigateOnDropdown("/register")}
                >
                  Đăng ký
                </button>
              </>
            )}
            <div className="border-t border-gray-200 my-1"></div>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => handleNavigateOnDropdown("/host")}
            >
              Cho thuê chỗ ở
            </button>
            <button className="w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              Trung tâm trợ giúp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
