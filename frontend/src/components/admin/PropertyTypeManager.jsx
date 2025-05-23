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
      {/* Form section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Cập nhật loại homestay" : "Thêm loại homestay mới"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <div className="flex-grow">
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-600 mb-1">
              Tên loại
            </label>
            <input 
              id="propertyType"
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Nhập tên loại homestay" 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              required
            />
          </div>
          <div className="flex gap-2 items-center">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {editingId ? "Cập nhật" : "Thêm"}
            </button>
            {editingId && (
              <button 
                type="button"
                onClick={resetForm} 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">Danh sách loại homestay</h2>
          <div className="text-sm text-gray-500">Tổng: {propertyTypes.length} loại</div>
        </div>
          {propertyTypes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Không có dữ liệu</div>
        ) : (
          <div className="divide-y divide-gray-200" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {propertyTypes.map(pt => (
              <div key={pt.id} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50">
                <span className="font-medium text-gray-900">{pt.name}</span>
                <button 
                  onClick={() => handleEdit(pt)} 
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sửa
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyTypeManager;
