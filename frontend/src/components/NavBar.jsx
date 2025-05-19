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
          <svg
            className="h-8 w-8 text-rose-500"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
            focusable="false"
          >
            {/* <path
              d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.91 3.967 0 2.71-1.1 4.908-3.214 6.314-1.613 1.189-3.496 1.732-5.225 1.732-2.35 0-4.656-.984-6.669-2.345l-.664-.435-.745.435C10.956 31.546 8.692 32 6.833 32c-1.8 0-3.463-.471-4.886-1.611C.573 29.054 0 27.109 0 24.812c0-1.663.371-3.442 1.114-5.343 2.17-5.394 7.568-15.513 9.976-18.996l.436-.612C12.793 1.759 14.356 1 16 1zm0 2c-1.248 0-2.275.593-3.328 2.338L12.053 6.4c-2.324 3.355-7.687 13.36-9.834 18.7l-.142.533c-.603 1.615-.908 3.03-.908 4.372 0 1.83.439 3.329 1.73 4.342 1.089 1.01 2.252 1.315 3.634 1.315 1.377 0 3.31-.37 5.316-1.56l1.12-.726 1.12.745c1.75 1.153 3.562 1.999 5.91 1.999 1.31 0 2.762-.428 3.997-1.304 1.687-1.188 2.556-2.831 2.556-4.906 0-1.18-.151-1.844-.77-3.35l-.108-.277c-.957-2.247-5.114-10.958-7.114-14.893l-.537-1.026C18.933 3.38 17.96 3 16.002 3z"
              fill="currentColor"
            ></path> */}
          </svg>
          <span className="text-rose-500 text-2xl font-bold ml-2">
            Homestay
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
