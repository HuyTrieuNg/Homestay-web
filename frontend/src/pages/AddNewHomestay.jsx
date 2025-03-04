import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const HOMESTAY_API_URL = "host/homestays/";
const TYPES_API_URL = "homestay-types/";
const PROVINCES_API_URL = "provinces/";
const DISTRICTS_API_URL = "districts/";
const COMMUNES_API_URL = "communes/";
const AMENITIES_API_URL = "amenities/";

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
    max_guests: "",
    commune: "", // ID của xã được chọn
    amenities: [], // Danh sách ID amenity được chọn
  });
  // Sử dụng state để lưu danh sách file ảnh đã chọn
  const [imageFiles, setImageFiles] = useState([]);
  // Preview URLs cho các file ảnh
  const [imagePreviews, setImagePreviews] = useState([]);

  // Data cho các selection
  const [types, setTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [amenities, setAmenities] = useState([]);

  // Selected values cho địa chỉ
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Load dữ liệu selection từ server
  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } };
    axiosInstance.get(TYPES_API_URL, config)
      .then(res => setTypes(res.data))
      .catch(err => console.error("Error fetching types:", err));
    axiosInstance.get(PROVINCES_API_URL, config)
      .then(res => setProvinces(res.data))
      .catch(err => console.error("Error fetching provinces:", err));
    axiosInstance.get(AMENITIES_API_URL, config)
      .then(res => setAmenities(res.data))
      .catch(err => console.error("Error fetching amenities:", err));
  }, []);

  // Khi chọn province, load danh sách district
  useEffect(() => {
    if (!selectedProvince) return;
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } };
    axiosInstance.get(`${DISTRICTS_API_URL}?province_id=${selectedProvince}`, config)
      .then(res => setDistricts(res.data))
      .catch(err => console.error("Error fetching districts:", err));
  }, [selectedProvince]);

  // Khi chọn district, load danh sách commune
  useEffect(() => {
    if (!selectedDistrict) return;
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } };
    axiosInstance.get(`${COMMUNES_API_URL}?district_id=${selectedDistrict}`, config)
      .then(res => setCommunes(res.data))
      .catch(err => console.error("Error fetching communes:", err));
  }, [selectedDistrict]);

  // Cập nhật preview mỗi khi imageFiles thay đổi
  useEffect(() => {
    const previews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    // Clean-up: revoke object URLs khi component unmount hoặc files thay đổi
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  // Xử lý thay đổi input (cho các trường text và file)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi file input (cho phép chọn nhiều file)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Giới hạn tối đa 15 ảnh
    const totalFiles = imageFiles.length + files.length;
    if (totalFiles > 15) {
      alert("Chỉ được chọn tối đa 15 ảnh");
      return;
    }
    setImageFiles(prev => [...prev, ...files]);
  };

  // Cho phép kéo thả file ảnh
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const totalFiles = imageFiles.length + files.length;
    if (totalFiles > 15) {
      alert("Chỉ được chọn tối đa 15 ảnh");
      return;
    }
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Loại bỏ ảnh khỏi danh sách khi bấm nút xóa
  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Xử lý chọn amenity (multi-select toggle)
  const handleAmenityToggle = (amenityId) => {
    let selectedAmenities = [...formData.amenities];
    const idStr = String(amenityId);
    if (selectedAmenities.includes(idStr)) {
      selectedAmenities = selectedAmenities.filter(id => id !== idStr);
    } else {
      selectedAmenities.push(idStr);
    }
    setFormData(prev => ({ ...prev, amenities: selectedAmenities }));
  };

  // Xử lý thay đổi dropdown cho địa chỉ
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setCommunes([]);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setFormData(prev => ({ ...prev, commune: "" }));
  };

  const handleCommuneChange = (e) => {
    setFormData(prev => ({ ...prev, commune: e.target.value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let payload = new FormData();
  //     // Append các trường của formData
  //     Object.keys(formData).forEach(key => {
  //       payload.append(key, formData[key]);
  //     });
  //     // Append từng file ảnh (sử dụng key "images" nhiều lần)
  //     imageFiles.forEach(file => {
  //       payload.append("images", file);
  //     });
  //     const headers = {
  //       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //       "Content-Type": "multipart/form-data"
  //     };
  //     const response = await axiosInstance.post(HOMESTAY_API_URL, payload, { headers });
  //     console.log("Homestay created:", response.data);
  //     navigate("/host");
  //   } catch (error) {
  //     console.error("Error creating homestay:", error.response?.data || error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = new FormData();
      // Append các trường thông thường
      Object.keys(formData).forEach((key) => {
        if (key === "amenities") {
          // Lặp qua mảng amenities và append từng giá trị. 
          //Không lặp thì bị lỗi vì không nhận diện được là list
          formData[key].forEach((item) => {
            payload.append("amenities", item);
          });
        } else {
          payload.append(key, formData[key]);
        }
      });
      // Append từng file ảnh từ imageFiles
      imageFiles.forEach((file) => {
        payload.append("images", file);
      });
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "multipart/form-data",
      };
      const response = await axiosInstance.post(HOMESTAY_API_URL, payload, { headers });
      console.log("Homestay created:", response.data);
      navigate("/host");
    } catch (error) {
      console.error("Error creating homestay:", error.response?.data || error);
    }
  };

  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Thêm Homestay Mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên Homestay */}
        <div>
          <label className="block text-gray-700">Tên Homestay:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Mô tả */}
        <div>
          <label className="block text-gray-700">Mô tả:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        {/* Loại Homestay */}
        <div>
          <label className="block text-gray-700">Loại Homestay:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          >
            <option value="">Chọn loại</option>
            {types.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {/* Hình ảnh */}
        <div>
          <label className="block text-gray-700 mb-1">Hình ảnh (tối đa 15 ảnh):</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            className="w-full mt-1"
          />
          {/* Khu vực kéo thả */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-md text-center text-gray-600"
          >
            Kéo thả ảnh vào đây
          </div>
          {/* Hiển thị preview ảnh */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img src={src} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs p-1 rounded-full"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Giá cơ bản */}
        <div>
          <label className="block text-gray-700">Giá cơ bản:</label>
          <input
            type="number"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Địa chỉ */}
        <div>
          <label className="block text-gray-700">Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Tọa độ */}
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
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
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
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        {/* Số khách tối đa */}
        <div>
          <label className="block text-gray-700">Số khách tối đa:</label>
          <input
            type="number"
            name="max_guests"
            value={formData.max_guests}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Địa chỉ chọn: Province, District, Commune */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700">Tỉnh:</label>
            <select
              value={selectedProvince}
              onChange={handleProvinceChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Chọn tỉnh</option>
              {provinces.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Huyện:</label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              disabled={!selectedProvince}
            >
              <option value="">Chọn huyện</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Xã:</label>
            <select
              name="commune"
              value={formData.commune}
              onChange={handleCommuneChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              disabled={!selectedDistrict}
            >
              <option value="">Chọn xã</option>
              {communes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Amenities selection (custom multi-select bằng buttons, 5 ảnh trên 1 hàng) */}
        <div>
          <label className="block text-gray-700 mb-1">Amenities:</label>
          <div className="grid grid-cols-5 gap-2">
            {amenities.map(a => {
              const isSelected = formData.amenities.includes(String(a.id));
              return (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => handleAmenityToggle(a.id)}
                  className={`px-3 py-1 rounded-md border transition-colors 
                    ${isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
                >
                  {a.name}
                </button>
              );
            })}
          </div>
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
