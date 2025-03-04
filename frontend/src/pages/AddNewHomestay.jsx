import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig"; // Cập nhật đường dẫn nếu cần

const HOMESTAY_API_URL = "host/homestays/"; // Vì baseURL đã được cấu hình trong axiosInstance

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
    geometry: "",
    max_guests: "",
    commune: "", // Lưu id của xã được chọn
    amenities: [], // Lưu danh sách ID của amenity được chọn
  });
  const [imageFile, setImageFile] = useState(null);

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

    // Lấy danh sách types
    axiosInstance.get(TYPES_API_URL, config)
      .then(res => setTypes(res.data))
      .catch(err => console.error("Error fetching types:", err));

    // Lấy danh sách provinces
    axiosInstance.get(PROVINCES_API_URL, config)
      .then(res => setProvinces(res.data))
      .catch(err => console.error("Error fetching provinces:", err));

    // Lấy danh sách amenities
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setImageFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Xử lý chọn amenity (multi-select)
  const handleAmenitiesChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({ ...formData, amenities: selected });
  };

  // Xử lý thay đổi dropdown cho address
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setCommunes([]); // Reset communes
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setFormData({ ...formData, commune: "" });
  };

  const handleCommuneChange = (e) => {
    setFormData({ ...formData, commune: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload;
      let headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      };

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

      const response = await axiosInstance.post(HOMESTAY_API_URL, payload, { headers });
      console.log("Homestay created:", response.data);
      navigate("/host");
    } catch (error) {
      console.error("Error creating homestay:", error.response?.data || error);
    }
  };

  //Hàm bắt thao tác chọn
  const handleAmenityToggle = (amenityId) => {
    let selectedAmenities = [...formData.amenities];
    // Chuyển về string nếu cần (vì dữ liệu có thể lưu dưới dạng string từ input)
    const idStr = String(amenityId);
    if (selectedAmenities.includes(idStr)) {
      // Nếu đã chọn, bỏ đi
      selectedAmenities = selectedAmenities.filter((id) => id !== idStr);
    } else {
      // Nếu chưa chọn, thêm vào danh sách
      selectedAmenities.push(idStr);
    }
    setFormData({ ...formData, amenities: selectedAmenities });
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
            {types.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {/* Hình ảnh */}
        <div>
          <label className="block text-gray-700">Hình ảnh:</label>
          <input
            type="file"
            name="images"
            onChange={handleChange}
            className="w-full mt-1"
          />
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
        {/* Geometry */}
        <div>
          <label className="block text-gray-700">Geometry:</label>
          <input
            type="text"
            name="geometry"
            value={formData.geometry}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
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
              {provinces.map((p) => (
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
              {districts.map((d) => (
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
              {communes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Amenities selection (multi-select) */}
        
        <div>
          <label className="block text-gray-700 mb-1">Amenities:</label>
          <div className="grid grid-cols-5 gap-2">
            {amenities.map((a) => {
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


        {/* Amenities selection (custom multi-select bằng buttons) */}

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
