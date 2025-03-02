import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/host/homestays/";

function HomestayForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    base_price: "",
    address: "",
    longitude: "",
    latitude: "",
    geometry: "",
    max_guests: "",
    amenities: [],
  });

  // Quản lý file hình ảnh nếu có upload
  const [imageFile, setImageFile] = useState(null);

  // Kiểm tra đăng nhập: nếu không có token, chuyển hướng về trang login
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setImageFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Chuyển chuỗi nhập vào thành mảng các ID (ví dụ: "1,2,3")
  const handleAmenitiesChange = (e) => {
    const ids = e.target.value
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");
    setFormData({ ...formData, amenities: ids });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      let payload;
      let headers = {
        Authorization: `Bearer ${token}`,
      };

      // Nếu có hình ảnh, sử dụng FormData để gửi dữ liệu dạng multipart
      if (imageFile) {
        payload = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === "amenities") {
            payload.append(key, JSON.stringify(formData[key]));
          } else {
            payload.append(key, formData[key]);
          }
        });
        payload.append("images", imageFile);
        headers["Content-Type"] = "multipart/form-data";
      } else {
        payload = formData;
        headers["Content-Type"] = "application/json";
      }

      const response = await axios.post(API_URL, payload, { headers });
      console.log("Homestay created:", response.data);
      navigate("/host");
    } catch (error) {
      console.error("Error creating homestay:", error.response?.data || error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Thêm Homestay Mới
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Tên Homestay:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Mô tả:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Loại:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Hình ảnh:</label>
          <input
            type="file"
            name="images"
            onChange={handleChange}
            className="w-full mt-1"
          />
        </div>
        <div>
          <label className="block text-gray-700">Giá cơ bản:</label>
          <input
            type="number"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Kinh độ:</label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Vĩ độ:</label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Geometry:</label>
          <input
            type="text"
            name="geometry"
            value={formData.geometry}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Số khách tối đa:</label>
          <input
            type="number"
            name="max_guests"
            value={formData.max_guests}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">
            Amenities (IDs, cách nhau bởi dấu phẩy):
          </label>
          <input
            type="text"
            name="amenities"
            placeholder="Ví dụ: 1,2,3"
            onChange={handleAmenitiesChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Thêm Homestay
        </button>
      </form>
    </div>
  );
}

export default HomestayForm;
