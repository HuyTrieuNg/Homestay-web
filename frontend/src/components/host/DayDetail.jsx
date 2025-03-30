import { useEffect, useState, useRef } from "react";
import axiosInstance from "@utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const DayDetail = ({ Date, setShowPopup, setAvailabilities ,id }) => {
  const [selectedDate, setSelectedDate] = useState(Date);
  const [newPrice, setNewPrice] = useState(selectedDate?.price || "");
  const [bookingInfo, setBookingInfo] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (selectedDate?.status === "booked" && selectedDate?.booking) {
      axiosInstance
        .get(`host/bookings/${selectedDate.booking}/`)
        .then((response) => {
          setBookingInfo(response.data);
        })
        .catch((error) => console.error("Lỗi khi lấy thông tin đặt phòng:", error));
    }
  }, [selectedDate]);

  const handleBlockToggle = () => {
    const newStatus = selectedDate.status === "blocked" ? "available" : "blocked";
    updateAvailability({ date: selectedDate.date, status: newStatus });
  };

  const handleUpdatePrice = () => {
    updateAvailability({ date: selectedDate.date, price: newPrice });
  };

  const updateAvailability = (data) => {
    axiosInstance.patch(`host/availability/${id}/`, data)
      .then((res) => {
        setAvailabilities((prev) => {
          const exists = prev.some((item) => item.date === res.data.date);
          return exists ? prev.map((item) => (item.date === res.data.date ? res.data : item)) : [...prev, res.data];
        });
        setSelectedDate(res.data);
      })
      .catch((err) => console.error("Lỗi cập nhật:", err));
  };

  if (!selectedDate) return null;

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded shadow-lg z-50" ref={popupRef}>
      <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setShowPopup(false)}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <h3 className="text-lg font-bold mb-2">Chi tiết ngày {selectedDate.date}</h3>

      {selectedDate.status === "booked" ? (
        bookingInfo ? (
          <div className="border p-3 rounded bg-gray-100">
            <p><strong>Người đặt:</strong> {bookingInfo.user.name}</p>
            <p><strong>Homestay:</strong> {bookingInfo.homestay.name}</p>
            <p><strong>Ngày check-in:</strong> {bookingInfo.checkin_date}</p>
            <p><strong>Ngày check-out:</strong> {bookingInfo.checkout_date}</p>
            <p><strong>Trạng thái:</strong> {bookingInfo.status}</p>
            <p><strong>Số khách:</strong> {bookingInfo.guests}</p>
            <p><strong>Tạm tính:</strong> {bookingInfo.subtotal}</p>
            <p><strong>Phí:</strong> {bookingInfo.fee}</p>
            <p><strong>Tổng tiền:</strong> {bookingInfo.total_amount} {bookingInfo.currency}</p>
            <p><strong>Ghi chú:</strong> {bookingInfo.note || "Không có"}</p>
          </div>
        ) : (
          <p>Đang tải thông tin đặt phòng...</p>
        )
      ) : (
        <>
          <input
            type="text"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="border p-2 w-full"
          />
          <div className="flex space-x-2 mt-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdatePrice}>
              Cập nhật giá
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleBlockToggle}>
              {selectedDate.status === "blocked" ? "Unblock" : "Block"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DayDetail;
