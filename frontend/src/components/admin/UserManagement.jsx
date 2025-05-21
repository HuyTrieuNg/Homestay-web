import React, { useState, useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`/users/users/?keyword=${keyword}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [keyword]);

  const handleAction = async (userId, action) => {
    try {
      await axiosInstance.post(`/users/users/${userId}/${action}/`);
      fetchUsers();
    } catch (err) {
      console.error(`Action "${action}" failed:`, err);
    }
  };

  return (
    <div className="p-4">


      <input
        type="text"
        placeholder="Tìm kiếm theo tên, email, username..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border border-gray-300 rounded p-2 mb-4 w-full"
      />

      <table className="min-w-full border border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Vai trò</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Quyền</th>
            <th className="border p-2">Trạng thái tài khoản</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center">
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2 capitalize">{u.type}</td>
              <td className="border p-2">
                {u.status ? (
                  <span className="text-green-600 font-semibold">Hoạt động</span>
                ) : (
                  <span className="text-red-600 font-semibold">Bị khóa</span>
                )}
              </td>
              {/* Role Control */}
              <td className="border p-2 space-x-1">
                {u.type !== "host" && (
                  <button
                    onClick={() => handleAction(u.id, "promote")}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Cấp Host
                  </button>
                )}
                {u.type !== "guest" && (
                  <button
                    onClick={() => handleAction(u.id, "demote")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Hạ Guest
                  </button>
                )}
              </td>
              {/* Ban Control */}
              <td className="border p-2">
                {u.status ? (
                  <button
                    onClick={() => handleAction(u.id, "ban")}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Ban
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(u.id, "unban")}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Unban
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
