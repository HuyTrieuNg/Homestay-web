import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";
import BasicInfoForm from "./HomestayForm/BasicInfoForm";
import AddressSelector from "./HomestayForm/AddressSelector";
import ImageUploader from "./HomestayForm/ImageUploader";
import AmenitiesSelector from "./HomestayForm/AmenitiesSelector";

const HOMESTAY_API_URL = "host/homestays/";

const HomestayCreate = ({ onSubmit }) => {
  const navigate = useNavigate();

  // Form data state
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

  // Image states
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selection data states
  const [types, setTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [amenities, setAmenities] = useState([]);

  // Address selection states
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  // Fetch basic selection data from API
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [typesRes, provincesRes, amenitiesRes] = await Promise.all([
          axiosInstance.get("homestay-types/"),
          axiosInstance.get("provinces/"),
          axiosInstance.get("amenities/")
        ]);
        
        setTypes(typesRes.data);
        setProvinces(provincesRes.data);
        setAmenities(amenitiesRes.data);
      } catch (error) {
        console.error("Error loading basic data:", error);
      }
    };
    
    fetchBaseData();
  }, []);

  // Update image previews
  useEffect(() => {
    const newFilePreviews = imageFiles.map(file => ({
      file: file,
      image: URL.createObjectURL(file)
    }));
    
    setImagePreviews(newFilePreviews);
    
    // Cleanup function to prevent memory leaks
    return () => {
      newFilePreviews.forEach(preview => {
        if (preview.image && typeof preview.image === 'string') {
          URL.revokeObjectURL(preview.image);
        }
      });
    };
  }, [imageFiles]);

  // Handle province change
  useEffect(() => {
    if (!selectedProvince) return;
    
    const fetchDistricts = async () => {
      try {
        const res = await axiosInstance.get(`districts/?province_id=${selectedProvince}`);
        setDistricts(res.data);
        setSelectedDistrict("");
        setCommunes([]);
        setFormData(prev => ({ ...prev, commune: "" }));
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    
    fetchDistricts();
  }, [selectedProvince]);

  // Handle district change
  useEffect(() => {
    if (!selectedDistrict) return;
    
    const fetchCommunes = async () => {
      try {
        const res = await axiosInstance.get(`communes/?district_id=${selectedDistrict}`);
        setCommunes(res.data);
        setFormData(prev => ({ ...prev, commune: "" }));
      } catch (error) {
        console.error("Error fetching communes:", error);
      }
    };
    
    fetchCommunes();
  }, [selectedDistrict]);

  // General input field handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Amenity toggle handler
  const handleAmenityToggle = (id) => {
    let selected = [...formData.amenities];

    if (selected.includes(id)) {
      selected = selected.filter((a) => a !== id);
    } else {
      selected.push(id);
    }
    setFormData({ ...formData, amenities: selected });
  };

  // Address selection handlers
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setCommunes([]);
    setFormData(prev => ({ ...prev, commune: "" }));
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setFormData(prev => ({ ...prev, commune: "" }));
  };

  const handleCommuneChange = (e) => {
    setFormData(prev => ({ ...prev, commune: e.target.value }));
  };

  // Image handling functions
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImageCount = imagePreviews.length + files.length;
    
    if (totalImageCount > 20) {
      alert("Maximum 20 images allowed");
      return;
    }
    
    // Create unique keys to avoid duplicates
    const timestamp = Date.now();
    const newFiles = files.map((file, index) => {
      Object.defineProperty(file, 'lastModified', {
        writable: true,
        value: timestamp + index
      });
      return file;
    });
    
    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const totalImageCount = imagePreviews.length + files.length;
    
    if (totalImageCount > 20) {
      alert("Maximum 20 images allowed");
      return;
    }
    
    // Create unique keys to avoid duplicates
    const timestamp = Date.now();
    const newFiles = files.map((file, index) => {
      Object.defineProperty(file, 'lastModified', {
        writable: true,
        value: timestamp + index
      });
      return file;
    });
    
    setImageFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Image removal handler
  const handleRemoveImage = (index) => {
    const imageToRemove = imagePreviews[index];
      setImageFiles(prev => prev.filter(file => file !== imageToRemove.file));
    
    // Remove from UI immediately
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      
      // Add basic information fields
      Object.keys(formData).forEach((key) => {
        if (key === "amenities") {
          formData[key].forEach((item) =>
            payload.append("amenities", item)
          );
        } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
          payload.append(key, formData[key]);
        }
      });
      
      // Add image files
      imageFiles.forEach((file) => {
        payload.append("uploaded_images", file);
      });
      
      console.log("Form data entries:", [...payload.entries()]);
      
      // Use custom submit handler if provided, otherwise use default API call
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
      console.error("Error submitting homestay:", error.response?.data || error);
      alert("Error saving homestay. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Detect actual loading state for the entire component
  const isLoading = isAddressLoading || !provinces.length || !types.length || !amenities.length;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      {isLoading ? (
        <div className="text-center py-4">
          <p>Loading form data...</p>
        </div>
      ) : (
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
            isLoading={isAddressLoading}
            formData={formData}
            handleAddressChange = {handleChange}
          />
          <ImageUploader
            imagePreviews={imagePreviews}
            handleFileChange={handleFileChange}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleRemoveImage={handleRemoveImage}
            maxImages={20}
          />
          <AmenitiesSelector
            amenities={amenities}
            selectedAmenities={formData.amenities}
            handleAmenityToggle={handleAmenityToggle}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Processing..." : "Create Homestay"}
          </button>
        </form>
      )}
    </div>
  );
};

export default HomestayCreate;