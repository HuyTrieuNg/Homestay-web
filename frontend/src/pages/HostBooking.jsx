import { useState, useEffect } from "react";
import BookingList from "@components/host/BookingList";
import axiosInstance from "@utils/axiosInstance";
import Header from "@/components/host/Header";


function HostBooking() {
  const [bookings, setBookings] = useState();
  const [typeView, setTypeView] = useState("all");


  const updateBookingStatus = (id, status) => {
    setBookings((prevBookings) =>
        prevBookings.map((b) => (b.id === id ? { ...b, status } : b))
    );
};
  useEffect(() => {
  axiosInstance
      .get(`host/bookings/?type=${typeView}`)
      .then((response) => {
      setBookings(response.data);
      console.log("Bookings:", response.data);
      })
      .catch((err) => {
      console.error("Error fetching addresses:", err);
      });
  }, [typeView]);




  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />
      {/* Thanh chọn kiểu xem */}
      {/* <div className="flex gap-4 px-6 py-3 bg-gray-900 rounded-lg shadow-md">
        {[
            { type: "all", label: "Tất cả" },
            { type: "pending", label: "Mới" },
            { type: "confirmed", label: "Đã xác nhận" },
            { type: "cancelled", label: "Đã hủy" },
            { type: "rejected", label: "Đã từ chối" },
        ].map(({ type, label }) => (
            <button
                key={type}
                onClick={() => setTypeView(type)}
                className={`relative px-4 py-2 transition text-gray-400 hover:text-gray-200 
                    ${typeView === type ? "text-white" : "hover:text-gray-300"}
                `}
            >
              {label}
              {typeView === type && (
                  <div className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-gradient-to-r from-black via-gray-700 to-transparent"></div>
              )}
            </button>
        ))}
      </div>     */}
      {/* Thanh chọn kiểu xem */}
      <div className="flex flex-col items-center gap-4 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Danh sách booking</h1>
        <div className="flex bg-white px-4 py-2 rounded-lg shadow-md">
          {[
            { type: "all", label: "Tất cả" },
            { type: "pending", label: "Mới" },
            { type: "confirmed", label: "Đã xác nhận" },
            { type: "cancelled", label: "Đã hủy" },
            { type: "rejected", label: "Đã từ chối" },
          ].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setTypeView(type)}
              className={`relative px-4 py-2 text-gray-600 transition hover:text-gray-800 ${
                typeView === type ? "text-black font-semibold" : ""
              }`}
            >
              {label}
              {typeView === type && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>
              )}
            </button>
          ))}
        </div>
      </div>

    
    {/* Danh sách booking */}
    <div className="w-full  p-4">
      {bookings ? (
        <BookingList bookings={bookings} onUpdateBookings={updateBookingStatus} />
      ) : (
        <div className="text-center py-10 text-gray-500">
          Không có bookings nào
        </div>
      )}
    </div>
  </div>
  );
}

export default HostBooking;
