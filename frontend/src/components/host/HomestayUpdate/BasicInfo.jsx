import React, { useState } from "react";
import BasicInfoForm from "../HomestayForm/BasicInfoForm";
import { useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";

const BasicInfo = ({ homestay, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(homestay || {});

    const [types, setTypes] = useState([]);
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await axiosInstance.get("homestay-types/");
                setTypes(response.data);
            } catch (error) {
                console.error("Error fetching homestay types:", error);
            }
        };

        fetchTypes();
    }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {

    const requiredFields = ["name", "description", "type", "base_price", "max_guests"];

        // Kiểm tra xem có trường nào trống không
        const emptyFields = requiredFields.filter((field) => !formData[field]);

        if (emptyFields.length > 0) {
            alert(`Vui lòng điền đầy đủ thông tin: ${emptyFields.join(", ")}`);
            return;
        }

    
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
                <BasicInfoForm formData={formData} handleChange={handleChange} types={types} />
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
                <div className="text-gray-800">
                    {/* Tiêu đề (Tên Homestay) */}
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                        {homestay.name}
                    </h2>

                    {/* Mô tả */}
                    <div className="mb-4 text-center">
                        <p className="text-lg text-gray-900 italic">{homestay.description}</p>
                    </div>

                    {/* Loại - Giá - Số khách tối đa */}
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-lg font-medium text-gray-700">Loại</p>
                            {types.find((a) => a.value === homestay.type)?.label || "Đang tải loại..."}
                            
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-700">Giá</p>
                            <p className="text-lg text-gray-900">{homestay.base_price} VND</p>
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-700">Số khách tối đa</p>
                            <p className="text-lg text-gray-900">{homestay.max_guests} người</p>
                        </div>
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
                    <i className="fas fa-edit"></i>
                </button>

            </>
        )}
    </div>
);
};

export default BasicInfo;
