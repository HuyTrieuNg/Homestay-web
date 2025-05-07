import React, { useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";

const PropertyTypeManager = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axiosInstance.get("/homestays/property-types").then(res => setPropertyTypes(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name };
    if (editingId) {
      axiosInstance.put(`/homestays/admin/property-types/${editingId}/`, data).then(res => {
        setPropertyTypes(prev => prev.map(pt => pt.id === editingId ? res.data : pt));
        resetForm();
      });
    } else {
      axiosInstance.post("/homestays/admin/property-types/", data).then(res => {
        setPropertyTypes(prev => [...prev, res.data]);
        resetForm();
      });
    }
  };

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const handleEdit = (pt) => {
    setName(pt.name);
    setEditingId(pt.id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Loại Homestay</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Cập nhật loại homestay" : "Thêm loại homestay mới"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div className="flex-grow">
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Tên loại</label>
            <input 
              id="propertyType"
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Nhập tên loại homestay" 
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              required
            />
          </div>
          <div className="flex gap-2">
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {editingId ? "Cập nhật" : "Thêm"}
            </button>
            {editingId && (
              <button 
                type="button"
                onClick={resetForm} 
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold">Danh sách loại homestay</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {propertyTypes.length === 0 ? (
            <li className="p-4 text-center text-gray-500">Không có dữ liệu</li>
          ) : (
            propertyTypes.map(pt => (
              <li key={pt.id} className="flex justify-between items-center p-4 hover:bg-gray-50">
                <span className="font-medium">{pt.name}</span>
                <button 
                  onClick={() => handleEdit(pt)} 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sửa
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default PropertyTypeManager;
