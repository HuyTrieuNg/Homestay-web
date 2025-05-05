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
    <header className="bg-white border-b shadow-md">
      <nav className="px-6 py-3">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          {/* Logo */}
          <a href="#" className="flex items-center">
            {/* <img
              src="https://logosmarcas.net/wp-content/uploads/2020/07/Airbnb-Emblema.jpg" 
              alt="Logo"
              className="h-10 mr-3 rounded-full scale-150"

            /> */}
            <img
              src="https://logodix.com/logo/6346.jpg" 
              alt="Logo"
              className="h-10 w-10 mr-3 rounded-full scale-150"
            />
            <span className="text-xl font-semibold text-red-500">Homestay App</span>
          </a>

          {/* Menu Desktop */}
          <div className="flex space-x-6">
            <button
              onClick={() => navigate("/host")}
              className="text-gray-700 hover:text-blue-600"
            >
              Homestay của tôi
            </button>
            <button
              onClick={() => navigate("/host/calendar")}
              className="text-gray-700 hover:text-blue-600"
            >
              Lịch
            </button>
            <button
              onClick={() => navigate("/host/booking")}
              className="text-gray-700 hover:text-blue-600"
            >
              Yêu cầu thuê
            </button>
            <button
              onClick={() => navigate("/host/newHomestay")}
              className="text-gray-700 hover:text-blue-600"
            >
              Homestay mới
            </button>
            
            
          </div>


          {/* User Menu */}
          <div className="relative">
            {authTokens ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <img
                    src={avatar || "https://i.pravatar.cc/40"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{user?.name || "Người dùng"}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Hồ sơ
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
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

