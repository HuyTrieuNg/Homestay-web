import React, { useState } from "react";
import AmenitiesSelector from "../HomestayForm/AmenitiesSelector";
import { useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const BasicInfo = ({ homestay, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(homestay || {});

    const [amenities, setAmenities] = useState([]);
    useEffect(() => {
        
        const fetchAmenities = async () => {
            try {
                const response = await axiosInstance.get("amenities/");
                setAmenities(response.data);
            } catch (error) {
                console.error("Error fetching homestay types:", error);
            }
        };

        fetchAmenities();
    }, []);
    useEffect(() => {
        axiosInstance
            .get("amenities/")
            .then((response) => {
                setAmenities(response.data);
            })
            .catch((error) => {
                console.error("Error fetching homestay types:", error);
            });
    }, []);


    const handleAmenityToggle = (id) => {
        let selected = [...formData.amenities];
        if (selected.includes(id)) {
            selected = selected.filter((a) => a !== id);
        } else {
            selected.push(id);
        }
        setFormData({ ...formData, amenities: selected });
    };

    const handleSubmit = () => {
        
        setIsEditing(false);
        axiosInstance
            .patch(`host/homestays/${homestay.id}/`, formData)
            .then((response) => {
                console.log("Homestay updated successfully:", response.data);
                onUpdate(response.data);
            })
            .catch((error) => {
                console.error("Error updating homestay:", error);
            });
  };

return (
    <div className="p-4 rounded-md shadow-md bg-white relative">
        {isEditing ? (
            <>
                <AmenitiesSelector amenities={amenities} selectedAmenities={formData.amenities} formData={formData} handleAmenityToggle={handleAmenityToggle} />
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
                    onClick={handleSubmit}>
                        Lưu
                    </button>
                    <button
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition duration-200"
                        onClick={() => {
                            setIsEditing(false);
                        }}
                    >
                        Hủy
                    </button>
                </div>
            </>
        ) : (
            <>
                <div className="mt-8">
                    {/* Tiêu đề */}
                    <h2 className="flex flex-row flex-nowrap items-center">
                        <span className="flex-grow block border-t border-black"></span>
                        <span className="flex-none block mx-4 px-4 py-2.5 text-md rounded leading-none font-medium bg-black text-white">
                        Tiện nghi
                        </span>
                        <span className="flex-grow block border-t border-black"></span>
                    </h2>

                    {/* Danh sách amenities */}
                    
                    

                    <div className="flex justify-center flex-wrap gap-2 p-4 max-w-3xl mx-auto my-4 text-l">                        
                        {formData.amenities.length > 0 && amenities.length > 0 ? (
                            formData.amenities.map((amenity, index) => {
                                const matchedAmenity = amenities.find((a) => a.id === amenity);
                                return (
                                    <button
                                    key={index}
                                    className="px-2 py-1 rounded bg-gray-200/50 text-gray-700 hover:bg-gray-300 mx-2"
                                    >
                                        {matchedAmenity ? matchedAmenity.name : "Đang tải..."}
                                    </button>
                                    
                                );
                            })
                        ) : (
                            <p className="text-gray-500">Chưa có tiện nghi nào.</p>
                        )}
                    </div>
                </div>

                <button
                    className="absolute top-2 right-2 text-black hover:text-gray-700 p-2 rounded-full transition duration-200"
                    onClick={() => 
                        {
                        setIsEditing(true);
                        setFormData(homestay);
                        }
                    }
                >
                    <FontAwesomeIcon icon={faEdit} />
                </button>

            </>
        )}
    </div>
);
};

export default BasicInfo;
