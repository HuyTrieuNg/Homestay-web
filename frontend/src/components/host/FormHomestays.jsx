import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance"

const HOMESTAY_API_URL = "host/homestays/";
const TYPES_API_URL = "homestay-types/";
const PROVINCES_API_URL = "provinces/";
const DISTRICTS_API_URL = "districts/";
const COMMUNES_API_URL = "communes/";
const AMENITIES_API_URL = "amenities/";

const HomestayFormComponent = ({ initialData = {}, onSubmit }) => {
  const navigate = useNavigate();

  // Khởi tạo formData với giá trị mặc định và initialData (nếu có)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    base_price: "",
    address: "",
    longitude: "",
    latitude: "",
    max_guests: "",
    commune: "", // ID của xã
    amenities: [], // Mảng ID amenity
    ...initialData,
  });

  // State cho ảnh
  const [imageFiles, setImageFiles] = useState([]);
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

    useEffect(() => {
      axiosInstance
        .get(TYPES_API_URL)
        .then((response) => {
          setTypes(response.data);
        })
        .catch((error) => {
          console.error("Error fetching homestays:", error);
        });
      axiosInstance
        .get(PROVINCES_API_URL)
        .then((response) => {
          setProvinces(response.data);
        })
        .catch((error) => {
          console.error("Error fetching homestays:", error);
        });
      axiosInstance
        .get(AMENITIES_API_URL)
        .then((response) => {
          setAmenities(response.data);
        })
        .catch((error) => {
          console.error("Error fetching homestays:", error);
        });
    }, []);

  // Khi chọn province, load danh sách district
  // useEffect(() => {
  //   if (!selectedProvince) return;
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //     },
  //   };
  //   axiosInstance
  //     .get(`${DISTRICTS_API_URL}?province_id=${selectedProvince}`, config)
  //     .then((res) => setDistricts(res.data))
  //     .catch((err) => console.error("Error fetching districts:", err));
  // }, [selectedProvince]);

  useEffect(() => {
    axiosInstance
      .get(`${DISTRICTS_API_URL}?province_id=${selectedProvince}`)
      .then((response) => {
        setDistricts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching homestays:", error);
      });
  }, [selectedProvince]);

  // Khi chọn district, load danh sách commune
  // useEffect(() => {
  //   if (!selectedDistrict) return;
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //     },
  //   };
  //   axiosInstance
  //     .get(`${COMMUNES_API_URL}?district_id=${selectedDistrict}`, config)
  //     .then((res) => setCommunes(res.data))
  //     .catch((err) => console.error("Error  cofetchingmmunes:", err));
  // }, [selectedDistrict]);


  useEffect(() => {
    axiosInstance
      .get(`${COMMUNES_API_URL}?district_id=${selectedDistrict}`)
      .then((response) => {
        setCommunes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching homestays:", error);
      });
  }, [selectedDistrict]);

  // Cập nhật preview mỗi khi imageFiles thay đổi
  useEffect(() => {
    const previews = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [imageFiles]);

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý file input cho ảnh (cho phép chọn nhiều file)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = imageFiles.length + files.length;
    if (totalFiles > 15) {
      alert("Chỉ được chọn tối đa 15 ảnh");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
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
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Loại bỏ ảnh khỏi danh sách
  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Xử lý chọn amenity (toggle)
  const handleAmenityToggle = (amenityId) => {
    let selectedAmenities = [...formData.amenities];
    const idStr = String(amenityId);
    if (selectedAmenities.includes(idStr)) {
      selectedAmenities = selectedAmenities.filter((id) => id !== idStr);
    } else {
      selectedAmenities.push(idStr);
    }
    setFormData((prev) => ({ ...prev, amenities: selectedAmenities }));
  };

  // Xử lý thay đổi dropdown địa chỉ
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setCommunes([]);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setFormData((prev) => ({ ...prev, commune: "" }));
  };

  const handleCommuneChange = (e) => {
    setFormData((prev) => ({ ...prev, commune: e.target.value }));
  };

  // Submit form: tạo FormData và gửi đi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = new FormData();
      // Append các trường text
      Object.keys(formData).forEach((key) => {
        if (key === "amenities") {
          // Gửi từng giá trị amenities riêng biệt
          formData[key].forEach((item) => {
            payload.append("amenities[]", item);
          });
        } else {
          payload.append(key, formData[key]);
        }
      });
      // Append từng file ảnh
      imageFiles.forEach((file) => {
        payload.append("images[]", file);
      });
      
      // Gọi hàm onSubmit được truyền vào nếu có, nếu không thì tự submit qua API
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        const response = await axiosInstance.post(HOMESTAY_API_URL, payload);
        console.log("Homestay created:", response.data);
        navigate("/host");
      }
    } catch (error) {
      console.error("Error creating homestay:", error.response?.data || error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10 overflow-visible">
      <h1 className="text-2xl font-bold mb-6 text-center">Homestay Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4" 
            onDrop={handleDrop} onDragOver={handleDragOver}>
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
        {/* Upload ảnh */}
        <div>
          <label className="block text-gray-700 mb-1">
            Hình ảnh (tối đa 15 ảnh):
          </label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            className="w-full mt-1"
          />
          <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-md text-center text-gray-600">
            Kéo thả ảnh vào đây
          </div>
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
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
        {/* Amenities selection */}
        <div>
          <label className="block text-gray-700 mb-1">Amenities:</label>
          <div className="grid grid-cols-3 gap-2">
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
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default HomestayFormComponent;
