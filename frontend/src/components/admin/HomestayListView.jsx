import React, { useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";

const HomestayListView = () => {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypes, setPropertyTypes] = useState({});

  useEffect(() => {
    fetchHomestays();
    fetchPropertyTypes();
  }, []);

  const fetchHomestays = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/homestays/");
      setHomestays(res.data);
    } catch (err) {
      console.error("Error fetching homestays:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyTypes = async () => {
    try {
      const res = await axiosInstance.get("/homestays/property-types");
      const typesObj = {};
      res.data.forEach(type => {
        typesObj[type.id] = type.name;
      });
      setPropertyTypes(typesObj);
    } catch (err) {
      console.error("Error fetching property types:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá homestay này?")) {
      try {
        await axiosInstance.delete(`/homestays/admin/${id}/delete/`);
        setHomestays(prev => prev.filter(h => h.id !== id));
      } catch (err) {
        console.error("Error deleting homestay:", err);
        alert("Lỗi khi xoá homestay.");
      }
    }
  };

  const filteredHomestays = homestays.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Homestay</h1>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, địa chỉ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded p-2 pl-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="font-semibold">Danh sách Homestay</h2>
          <div className="text-sm text-gray-500">Tổng: {filteredHomestays.length} homestay</div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredHomestays.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Không tìm thấy homestay nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá ($USD)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHomestays.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {h.image ? (
                          <img 
                            src={h.image} 
                            alt={h.name} 
                            className="h-10 w-10 rounded-md object-cover mr-3" 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                        )}
                        <div className="font-medium text-gray-900">{h.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {h.base_price} 
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{h.address}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {propertyTypes[h.type] || 'Không xác định'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleDelete(h.id)} 
                          className="text-red-600 hover:text-red-900 font-medium text-sm"
                        >
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomestayListView;
