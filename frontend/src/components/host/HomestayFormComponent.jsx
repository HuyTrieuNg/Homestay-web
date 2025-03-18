import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";
import BasicInfoForm from "./HomstayForm/BasicInfoForm";
import AddressSelector from "./HomstayForm/AddressSelector";
import ImageUploader from "./HomstayForm/ImageUploader";
import AmenitiesSelector from "./HomstayForm/AmenitiesSelector";

const HOMESTAY_API_URL = "host/homestays/";

const HomestayFormComponent = ({ initialData = {}, onSubmit }) => {
  const navigate = useNavigate();

  // Khởi tạo formData
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    base_price: "",
    address: "",
    longitude: "",
    latitude: "",
    max_guests: "",
    commune: "",
    amenities: [],
  });


  // Cập nhật dữ liệu từ `initialData`
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        amenities: initialData.amenities?.map(String) || [],
        commune: initialData.commune || "",
      });

      // Load địa chỉ
      if (initialData.commune) {
        axiosInstance.get(`commune/${initialData.commune}/`).then((res) => {
          setSelectedDistrict(res.data.district_id);
          setSelectedProvince(res.data.province_id);
        });
      }

      // Load ảnh
      if (initialData.images) {
        setImagePreviews(initialData.images);
      }
    }
  }, [initialData]);


  // State cho ảnh
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Data cho các selection
  const [types, setTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [amenities, setAmenities] = useState([]);

  // Giá trị lựa chọn cho địa chỉ
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Fetch dữ liệu selection từ API
  useEffect(() => {
    axiosInstance.get("homestay-types/").then((res) => setTypes(res.data));
    axiosInstance.get("provinces/").then((res) => setProvinces(res.data));
    axiosInstance.get("amenities/").then((res) => setAmenities(res.data));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axiosInstance.get(`districts/?province_id=${selectedProvince}`)
        .then((res) => setDistricts(res.data))
        .catch((err) => console.error("Error fetching districts:", err));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axiosInstance.get(`communes/?district_id=${selectedDistrict}`)
        .then((res) => setCommunes(res.data))
        .catch((err) => console.error("Error fetching communes:", err));
    }
  }, [selectedDistrict]);

  // Cập nhật preview ảnh
  // useEffect(() => {
  //   const previews = imageFiles.map((file) => URL.createObjectURL(file));
  //   setImagePreviews(previews);
  //   return () => previews.forEach((url) => URL.revokeObjectURL(url));
  // }, [imageFiles]);

// Cập nhật thêm preview ảnh trong form cập nhật
 useEffect(() => {
  const newPreviews = [
    ...(initialData.images || []),
    ...imageFiles.map((file) => URL.createObjectURL(file)),
  ];
  setImagePreviews(newPreviews);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [imageFiles, initialData.images]);


  // Hàm xử lý chung cho các trường input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (id) => {
    let selected = [...formData.amenities];
    const idStr = String(id);
    if (selected.includes(idStr)) {
      selected = selected.filter((a) => a !== idStr);
    } else {
      selected.push(idStr);
    }
    setFormData({ ...formData, amenities: selected });
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setCommunes([]);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setFormData({ ...formData, commune: "" });
  };

  const handleCommuneChange = (e) => {
    setFormData({ ...formData, commune: e.target.value });
  };

  // Hàm xử lý ảnh (file input, drag & drop, xóa ảnh)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 20) {
      alert("Chỉ được chọn tối đa 20 ảnh");
      return;
    }
    setImageFiles([...imageFiles, ...files]);
    
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (imageFiles.length + files.length > 20) {
      alert("Chỉ được chọn tối đa 20 ảnh");
      return;
    }
    setImageFiles([...imageFiles, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  // Submit form: tạo FormData và gửi đi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "amenities") {
          formData[key].forEach((item) =>
            payload.append("amenities", item)
          );
        } else {
          payload.append(key, formData[key]);
        }
      });
      imageFiles.forEach((file) =>
        payload.append("uploaded_images", file)
      );
      
      // Debug: in ra tất cả entries
      console.log([...payload.entries()]);
      
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        const response = await axiosInstance.post(HOMESTAY_API_URL, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Homestay created:", response.data);
        navigate("/host");
      }
    } catch (error) {
      console.error("Error creating homestay:", error.response?.data || error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <BasicInfoForm formData={formData} handleChange={handleChange} types={types} />
        <AddressSelector
          provinces={provinces}
          districts={districts}
          communes={communes}
          selectedProvince={selectedProvince}
          selectedDistrict={selectedDistrict}
          handleProvinceChange={handleProvinceChange}
          handleDistrictChange={handleDistrictChange}
          handleCommuneChange={handleCommuneChange}
        />
        <ImageUploader
          imagePreviews={imagePreviews}
          handleFileChange={handleFileChange}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleRemoveImage={handleRemoveImage}
        />
        <AmenitiesSelector
          amenities={amenities}
          selectedAmenities={formData.amenities}
          handleAmenityToggle={handleAmenityToggle}
        />
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
