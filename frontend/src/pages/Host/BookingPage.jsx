import React from "react";
import { useState, useEffect } from "react";
import BookingList from "@components/host/BookingList";
import axiosInstance from "@utils/axiosInstance";
import Header from "@/components/host/Header";

function HostBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [typeView, setTypeView] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null
  });

  const updateBookingStatus = (id, status) => {
    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`host/bookings/?type=${typeView}&page=${page}`)
      .then((response) => {
        setBookings(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, [typeView, page]);

  // Tính tổng số trang dựa trên count và page_size (mặc định là 10)
  const totalPages = Math.ceil(pagination.count / 10);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full h-16 z-50">
        <Header />
      </div>
      <div className="mt-16">
        <div className="flex flex-col items-center gap-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Danh sách booking
          </h1>
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
                onClick={() => {
                  setTypeView(type);
                  setPage(1); // Reset về trang 1 khi đổi type
                }}
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
          {/* Danh sách booking */}
          <div className="w-full p-4">
            {loading ? (
              <div className="text-center py-10">Đang tải...</div>
            ) : bookings && bookings.length > 0 ? (
              <>
                <BookingList
                  bookings={bookings}
                  onUpdateBookings={updateBookingStatus}
                />
                {/* Pagination controls - Đã cải tiến */}
                {pagination.count > 0 && (
                  <div className="flex justify-center mt-6 gap-2">
                    <button
                      onClick={() => setPage((p) => p - 1)}
                      disabled={!pagination.previous}
                      className={`px-3 py-1 rounded ${
                        !pagination.previous
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
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
                          (p >= page - 1 && p <= page + 1)
                        )
                        .map((p, i, arr) => {
                          // Thêm dấu ... nếu có khoảng cách giữa các số
                          if (i > 0 && arr[i] - arr[i-1] > 1) {
                            return (
                              <React.Fragment key={`ellipsis-${p}`}>
                                <span className="px-3 py-1 text-gray-500">...</span>
                                <button
                                  key={p}
                                  onClick={() => setPage(p)}
                                  className={`px-3 py-1 rounded ${
                                    page === p
                                      ? "bg-blue-500 text-white"
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
                              onClick={() => setPage(p)}
                              className={`px-3 py-1 rounded ${
                                page === p
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                    </div>
                    
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pagination.next}
                      className={`px-3 py-1 rounded ${
                        !pagination.next
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Không có bookings nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostBookingPage;