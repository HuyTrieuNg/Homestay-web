import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const API_URL = 'http://127.0.0.1:8000/api/host/homestays/'  // Thay bằng URL backend của bạn

function HostDashboard() {
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login"); // Nếu chưa đăng nhập, chuyển về trang login
      return;
    }

    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setHomestays(response.data))
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  }, []);
  const [homestays, setHomestays] = useState([]);
  const [newHomestay, setNewHomestay] = useState({ name: "", address: "" });


  const fetchHomestays = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHomestays(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách homestays:", error);
    }
  };

  const handleAddHomestay = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(API_URL, newHomestay, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHomestays([...homestays, response.data]);
      setNewHomestay({ name: "", address: "" });
    } catch (error) {
      console.error("Lỗi khi thêm homestay:", error);
    }
  };

  const handleDeleteHomestay = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHomestays(homestays.filter((hs) => hs.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa homestay:", error);
    }
  };

  return (
    <div>
      <h1>Quản lý Homestay</h1>

      {/* Form thêm Homestay */}
      <div>
        <input
          type="text"
          placeholder="Tên homestay"
          value={newHomestay.name}
          onChange={(e) => setNewHomestay({ ...newHomestay, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={newHomestay.address}
          onChange={(e) => setNewHomestay({ ...newHomestay, address: e.target.value })}
        />
        <button onClick={handleAddHomestay}>Thêm Homestay</button>
      </div>

      {/* Danh sách Homestay */}
      <ul>
        {homestays.map((hs) => (
          <li key={hs.id}>
            {hs.name} - {hs.address}{" "}
            <button onClick={() => handleDeleteHomestay(hs.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HostDashboard;
