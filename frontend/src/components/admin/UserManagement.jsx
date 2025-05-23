import React, { useState, useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all, host, guest
  
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null
  });

  // Tính tổng số trang dựa trên count và page_size (mặc định là 10)
  const totalPages = Math.ceil(pagination.count / 10);

  // Fetch users khi có thay đổi về keyword, roleFilter hoặc trang
  useEffect(() => {
    // Xử lý debounce cho keyword search
    const timeoutId = setTimeout(() => {
      fetchUsers(currentPage);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [keyword, roleFilter, currentPage]);

  // Scroll về đầu trang khi chuyển trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      // Thêm roleFilter vào query params
      let url = `/users/users/?keyword=${keyword}&page=${page}`;
      if (roleFilter !== "all") {
        url += `&role=${roleFilter}`;
      }
      
      const res = await axiosInstance.get(url);
      
      // Xử lý phân trang
      if (res.data && res.data.results) {
        setUsers(res.data.results);
        setPagination({
          count: res.data.count || 0,
          next: res.data.next,
          previous: res.data.previous
        });
      } else {
        // Fallback cho API không phân trang
        setUsers(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      await axiosInstance.post(`/users/users/${userId}/${action}/`);
      fetchUsers(currentPage);  // Reload trang hiện tại
    } catch (err) {
      console.error(`Action "${action}" failed:`, err);
    }
  };

  // Tính toán thông tin hiển thị phân trang
  const startItem = pagination.count ? ((currentPage - 1) * 10) + 1 : 0;
  const endItem = Math.min(startItem + (users.length || 0) - 1, pagination.count || 0);

  // Reset về trang 1 khi thay đổi bộ lọc vai trò
  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
    setCurrentPage(1); // Quay về trang 1
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, username..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="border border-gray-300 rounded p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Bộ lọc vai trò */}
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">Vai trò:</label>
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilterChange(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="host">Host</option>
              <option value="guest">Guest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="font-semibold">Danh sách người dùng</h2>
          <div className="text-sm text-gray-500">
            {pagination.count > 0 && 
              `Hiển thị ${startItem}-${endItem} trong tổng số ${pagination.count} người dùng`}
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Không tìm thấy người dùng nào</div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quyền</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{u.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{u.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{u.username}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      u.type === 'host' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.type === 'host' ? 'Host' : 'Guest'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {u.status ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Hoạt động</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Bị khóa</span>
                    )}
                  </td>
                  {/* Role Control */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      {u.type !== "host" && (
                        <button
                          onClick={() => handleAction(u.id, "promote")}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                        >
                          Cấp Host
                        </button>
                      )}
                      {u.type !== "guest" && (
                        <button
                          onClick={() => handleAction(u.id, "demote")}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-xs"
                        >
                          Hạ Guest
                        </button>
                      )}
                    </div>
                  </td>
                  {/* Ban Control */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {u.status ? (
                      <button
                        onClick={() => handleAction(u.id, "ban")}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                      >
                        Ban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(u.id, "unban")}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs"
                      >
                        Unban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Phân trang */}
      {!loading && pagination.count > 0 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={!pagination.previous}
            className={`px-3 py-1 rounded ${
              !pagination.previous
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#ff5a5f] hover:bg-[#e14c4f] text-white"
            }`}
          >
            ←
          </button>
          
          {/* Hiển thị các trang */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => 
                p === 1 || 
                p === totalPages || 
                (p >= currentPage - 1 && p <= currentPage + 1)
              )
              .map((p, i, arr) => {
                // Thêm dấu ... nếu có khoảng cách giữa các số
                if (i > 0 && arr[i] - arr[i-1] > 1) {
                  return (
                    <React.Fragment key={`ellipsis-${p}`}>
                      <span className="px-3 py-1 text-gray-500">...</span>
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 rounded ${
                          currentPage === p
                            ? "bg-[#ff5a5f] text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                }
                
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 rounded ${
                      currentPage === p
                        ? "bg-[#ff5a5f] text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
          </div>
          
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={!pagination.next}
            className={`px-3 py-1 rounded ${
              !pagination.next
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#ff5a5f] hover:bg-[#e14c4f] text-white"
            }`}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;