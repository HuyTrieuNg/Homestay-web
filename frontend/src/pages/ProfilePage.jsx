import { useContext, useEffect, useState } from "react";
import AuthContext from "@context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";
import { setupAxiosInterceptors } from "../utils/axiosService";

const ProfilePage = () => {
  const { setAvatar } = useContext(AuthContext); 
  const { authTokens, setAuthTokens, setUser, logoutUser } =
    useContext(AuthContext);
  const [user, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phone: "",
    work: "",
    about: "",
    interests: "",
    avatar: "",
  });

  const navigate = useNavigate();

  // Thiết lập interceptor khi component mount
  useEffect(() => {
    setupAxiosInterceptors(authTokens, setAuthTokens, setUser, logoutUser);
  }, [authTokens, setAuthTokens, setUser, logoutUser]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/profile/");
      console.log("API Response:", response.data);
      setUserProfile(response.data);
      setFormData({
        username: response.data.username,
        name: response.data.name,
        phone: response.data.phone,
        work: response.data.work || "",
        about: response.data.about || "",
        interests: response.data.interests || "",
        avatar: response.data.avatar_url,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      updatedData.append("phone", formData.phone);
      updatedData.append("work", formData.work);
      updatedData.append("about", formData.about);
      updatedData.append("interests", formData.interests);

      if (formData.avatar instanceof File) {
        updatedData.append("avatar", formData.avatar);
      }

      await axiosInstance.put("/profile/", updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      

      alert("Profile updated successfully!");
      await fetchProfile();  // fetch lại profile mới

      // Cập nhật avatar trong context
      if (user?.avatar_url) {
        setAvatar(`${user.avatar_url}?t=${Date.now()}`); // bust cache
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response) {
        console.error("Backend response:", error.response.data);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => window.history.back()}
        className="text-black mb-4 flex items-center text-3xl font-semibold cursor-pointer"
      >
        <svg
          className="w-6 h-6 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Thông tin cá nhân</span>
      </button>
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>

        <div className="flex flex-col items-center mb-4">
          <div className="relative w-32 h-32">
            {formData.avatarPreview ? (
              <img
                src={formData.avatarPreview}
                alt="Avatar Preview"
                className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg object-cover"
              />
            ) : (
              <img
                src={formData.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg object-cover"
              />
            )}

            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-white text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-200 transition"
            >
              📷
            </label>
            <input
              id="avatar-upload"
              type="file"
              name="avatar"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-m font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              disabled
            />
          </div>
          <div>
            <label className="block text-m font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-m font-medium text-gray-600">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-m font-medium text-gray-600">
              Work
            </label>
            <input
              type="text"
              name="work"
              value={formData.work}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-m font-medium text-gray-600">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            ></textarea>
          </div>
          <div>
            <label className="block text-m font-medium text-gray-600">
              Interests
            </label>
            <textarea
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#FF385C] hover:bg-[#FF384C] text-white p-2 rounded-md cursor-pointer"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
