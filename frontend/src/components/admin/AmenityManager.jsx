import React, { useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";

const AmenityManager = () => {
  const [amenities, setAmenities] = useState([]);
  const [form, setForm] = useState({ name: "", category: "essentials" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axiosInstance.get("/homestays/amenities").then(res => setAmenities(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axiosInstance.put(`/homestays/admin/amenities/${editingId}/`, form).then(res => {
        setAmenities(prev => prev.map(a => a.id === editingId ? res.data : a));
        resetForm();
      });
    } else {
      axiosInstance.post("/homestays/admin/amenities/", form).then(res => {
        setAmenities(prev => [...prev, res.data]);
        resetForm();
      });
    }
  };

  const resetForm = () => {
    setForm({ name: "", category: "essentials" });
    setEditingId(null);
  };

  const handleEdit = (a) => {
    setForm({ name: a.name, category: a.category });
    setEditingId(a.id);
  };

  const getCategoryLabel = (category) => {
    const categories = {
      essentials: "Cơ bản",
      features: "Tính năng",
      location: "Vị trí",
      safety: "An toàn"
    };
    return categories[category] || category;
  };

  const getCategoryBadgeClass = (category) => {
    const classes = {
      essentials: "bg-blue-100 text-blue-800",
      features: "bg-purple-100 text-purple-800",
      location: "bg-green-100 text-green-800",
      safety: "bg-red-100 text-red-800"
    };
    return `${classes[category] || "bg-gray-100 text-gray-800"} px-2 py-1 rounded-full text-xs font-medium`;
  };

  return (
    <div className="p-4">

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Cập nhật tiện ích" : "Thêm tiện ích mới"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <div className="flex-grow min-w-[200px]">
            <label htmlFor="amenityName" className="block text-sm font-medium text-gray-700 mb-1">Tên tiện ích</label>
            <input 
              id="amenityName"
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              placeholder="Nhập tên tiện ích" 
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              required
            />
          </div>
          <div className="w-32">
            <label htmlFor="amenityCategory" className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
            <select 
              id="amenityCategory"
              value={form.category} 
              onChange={e => setForm({ ...form, category: e.target.value })} 
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="essentials">Cơ bản</option>
              <option value="features">Tính năng</option>
              <option value="location">Vị trí</option>
              <option value="safety">An toàn</option>
            </select>
          </div>
          <div className="flex gap-2 items-center h-[42px]">
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
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="font-semibold">Danh sách tiện ích</h2>
          <div className="text-sm text-gray-500">Tổng: {amenities.length} tiện ích</div>
        </div>
        
        {amenities.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Không có dữ liệu</div>
        ) : (
          <div 
            className="divide-y divide-gray-200"
            style={{ maxHeight: 400, overflowY: "auto" }}
          >
            {amenities.map(a => (
              <div key={a.id} className="flex justify-between items-center p-4 hover:bg-gray-50">
                <div className="flex flex-col">
                  <span className="font-medium">{a.name}</span>
                  <span className={getCategoryBadgeClass(a.category)}>
                    {getCategoryLabel(a.category)}
                  </span>
                </div>
                <button 
                  onClick={() => handleEdit(a)} 
                  className="text-blue-600 hover:text-blue-800 font-medium"
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

export default AmenityManager;
