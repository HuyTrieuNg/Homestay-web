import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "@context/AuthContext";
import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/utils/axiosInstance";

const Header = () => {
  const navigate = useNavigate();
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const isAuthenticated = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const PRIMARY_COLOR = "#ff5a5f";

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
  
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 transition-shadow duration-300 hover:shadow-lg">
      <nav className="container mx-auto p-4">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="https://res.cloudinary.com/drfwzrqqj/image/upload/v1747688845/create_logo_for_stayhub_with_1_1_ratio_no_text_primary_color_FF5A5F_no_background_eiqhu7.png" 
              alt="Logo"
              className="h-10 w-10 mr-3 rounded-full scale-150"
            />
            <span className="text-2xl font-bold transition-colors duration-300" style={{ color: PRIMARY_COLOR }}>StayHub Host</span>
          </a>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("/host")}
              className="text-gray-700 hover:text-pink-600 transition-colors duration-300 relative group"
              style={{ hover: { color: PRIMARY_COLOR } }}
            >
              <span>Homestay của tôi</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                  style={{ backgroundColor: PRIMARY_COLOR }}></span>
            </button>
            <button
              onClick={() => navigate("/host/calendar")}
              className="text-gray-700 hover:text-pink-600 transition-colors duration-300 relative group"
              style={{ hover: { color: PRIMARY_COLOR } }}
            >
              <span>Lịch</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                  style={{ backgroundColor: PRIMARY_COLOR }}></span>
            </button>
            <button
              onClick={() => navigate("/host/booking")}
              className="text-gray-700 hover:text-pink-600 transition-colors duration-300 relative group"
              style={{ hover: { color: PRIMARY_COLOR } }}
            >
              <span>Yêu cầu thuê</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                  style={{ backgroundColor: PRIMARY_COLOR }}></span>
            </button>
            <button
              onClick={() => navigate("/host/newHomestay")}
              className="text-gray-700 hover:text-pink-600 transition-colors duration-300 relative group"
              style={{ hover: { color: PRIMARY_COLOR } }}
            >
              <span>Homestay mới</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                  style={{ backgroundColor: PRIMARY_COLOR }}></span>
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            {authTokens ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-700 hover:text-pink-600 transition-colors duration-300 focus:outline-none"
                >
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{user?.name || "Người dùng"}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md transition-opacity duration-200">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Hồ sơ
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-pink-600 transition-colors duration-300 font-medium"
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

