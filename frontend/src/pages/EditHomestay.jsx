import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/homestays/";

function EditHomestay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [homestay, setHomestay] = useState({ name: "", address: "" });

  useEffect(() => {
    fetchHomestay();
  }, [fetchHomestay]);

  const fetchHomestay = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHomestay(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy homestay:", error);
    }
  }, [id]);

  const handleUpdateHomestay = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(`${API_URL}${id}/`, homestay, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/host");
    } catch (error) {
      console.error("Lỗi khi cập nhật homestay:", error);
    }
  };

  return (
    <div>
      <h1>Chỉnh sửa Homestay</h1>
      <input
        type="text"
        value={homestay.name}
        onChange={(e) => setHomestay({ ...homestay, name: e.target.value })}
      />
      <input
        type="text"
        value={homestay.address}
        onChange={(e) => setHomestay({ ...homestay, address: e.target.value })}
      />
      <button onClick={handleUpdateHomestay}>Lưu thay đổi</button>
    </div>
  );
}

export default EditHomestay;
