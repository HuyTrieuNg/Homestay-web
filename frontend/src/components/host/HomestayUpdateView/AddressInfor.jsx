import React, { useState, useEffect } from "react";
import AddressSelector from "../HomestayForm/AddressSelector";
import axiosInstance from "@utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const AddressInfo = ({ homestay, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(homestay || {});
    

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");

    const [selectedProvinceName, setSelectedProvinceName] = useState("Đang tải...");
    const [selectedDistrictName, setSelectedDistrictName] = useState("Đang tải...");
    const [selectedCommuneName, setSelectedCommuneName] = useState("Đang tải...");

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await axiosInstance.get(`communes/?id=${homestay.commune}`);
                const data = response.data;

                setSelectedCommuneName(data.commune_name);
                setSelectedDistrict(data.district_id);
                setSelectedDistrictName(data.district_name);
                setSelectedProvince(data.province_id);
                setSelectedProvinceName(data.province_name);

                const provinceResponse = await axiosInstance.get("provinces/");
                setProvinces(provinceResponse.data);
            } catch (error) {
                console.error("Error fetching commune info:", error);
            }
        };

        if (homestay?.commune) {
            fetchLocationData();
        }
    }, [homestay?.commune, isEditing]);


    useEffect(() => {
        if (!selectedProvince) return;

        const fetchDistricts = async () => {
            try {
                const districtResponse = await axiosInstance.get(`districts/?province_id=${selectedProvince}`);
                setDistricts(districtResponse.data);
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        };

        fetchDistricts();
    }, [selectedProvince]);

    useEffect(() => {
        if (!selectedDistrict) return;

        const fetchCommunes = async () => {
            try {
                const communeResponse = await axiosInstance.get(`communes/?district_id=${selectedDistrict}`);
                setCommunes(communeResponse.data);
            } catch (error) {
                console.error("Error fetching communes:", error);
            }
        };

        fetchCommunes();
    }, [selectedDistrict]);


    const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };


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



    const handleSubmit = () => {
        const requiredFields = ["address", "commune", "longitude", "latitude"];

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
                <AddressSelector provinces={provinces} districts={districts} communes={communes} 
                                selectedProvince={selectedProvince} selectedDistrict={selectedDistrict} selectedCommune={formData.commune}
                                handleCommuneChange={handleFormDataChange} 
                                handleDistrictChange={handleDistrictChange} 
                                handleProvinceChange={handleProvinceChange}
                                handleAddressChange={handleFormDataChange}
                                isLoading={false}
                                formData={formData}/>
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

                <h2 className="flex flex-row flex-nowrap items-center mt-8">
                    <span className="flex-grow block border-t border-black"></span>
                    <span className="flex-none block mx-4 px-4 py-2.5 text-md rounded leading-none font-medium bg-black text-white">
                    Địa chỉ
                    </span>
                    <span className="flex-grow block border-t border-black"></span>
                </h2>

                <div className="space-y-2">
                    <p className="text-gray-700 text-center">
                        <span className="font-semibold">Địa chỉ chi tiết:</span> {homestay?.address || "Đang tải..."}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-gray-700">
                        <p className="text-center"><span className="font-semibold">Kinh độ:</span> {homestay?.longitude || "N/A"}</p>
                        <p className="text-center"><span className="font-semibold">Vĩ độ:</span> {homestay?.latitude || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-gray-700">
                        <p className="text-center"><span className="font-semibold">Tỉnh/Thành phố::</span> {selectedProvinceName}</p>
                        <p className="text-center"><span className="font-semibold">Quận/Huyện:</span> {selectedDistrictName}</p>
                        <p className="text-center"><span className="font-semibold">Phường/Xã:</span> {selectedCommuneName}</p>
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

export default AddressInfo;
