import { useState, useEffect, useRef } from "react";
import axiosInstance from "@utils/axiosInstance";

function BookingList({ bookings, onUpdateBookings }) {
    const [bookingLines, setBookingLines] = useState({});
    const [openNoteId, setOpenNoteId] = useState(null);
    const popupRef = useRef(null);

    const handleToggleNote = (id) => {
        setOpenNoteId(openNoteId === id ? null : id);
        if (!bookingLines[id]) {
            axiosInstance
                .get(`host/bookings/${id}/lines`)
                .then((response) => {
                    setBookingLines((prev) => ({ ...prev, [id]: response.data }));
                })
                .catch((err) => console.error("Error fetching booking lines:", err));
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setOpenNoteId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleconfirm = (id) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xác nhận booking ${id}?`)) {
            return;
        }
        axiosInstance
            .post(`host/bookings/${id}/`, { action: "confirmed" })
            .then(() => {
                alert(`Đã xác nhận booking ${id}`);
                onUpdateBookings(id, "confirmed");
            })
            .catch((err) => {
                console.error("Lỗi khi xác nhận:", err);
                alert("Lỗi khi xác nhận booking");
            });
    };

    const handleReject = (id) => {
        if (!window.confirm(`Bạn có chắc chắn muốn từ chối booking ${id}?`)) {
            return;
        }
        axiosInstance
            .post(`host/bookings/${id}/`, { action: "rejected" })
            .then(() => {
            alert(`Đã từ chối booking ${id}`);
            onUpdateBookings(id, "rejected");
            })
            .catch((err) => {
            console.error("Lỗi khi từ chối:", err);
            alert("Lỗi khi từ chối booking");
            });
    };

    return (
        <div className="w-[95%] mx-auto overflow-auto">
            
            <table className="w-full table-fixed border border-gray-200 rounded-lg shadow-md text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                    <tr>
                        <th className="p-2 text-center font-semibold w-[6%]">Hành động</th>
                        {["ID", "Khách hàng", "Homestay", "Check-in", "Check-out", "Số khách", "Trạng thái", "Tiền", "Tạm tính", "Phí", "Tổng tiền", "Ghi chú"].map((title) => (
                            <th key={title} className={`p-2 text-center font-semibold ${title === "Homestay" ? "w-[25%]" : "w-auto"}`}>
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-xs">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <tr key={booking.id} className="text-center hover:bg-gray-50">
                                {/* Nút Accept & Reject */}
                                <td className="p-2 w-[6%]">
                                    {booking.status === "pending" && (
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                className="text-green-500 hover:text-green-700"
                                                onClick={() => handleconfirm(booking.id)}
                                            >
                                                <i className="fa-solid fa-check-circle text-lg"></i>
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleReject(booking.id)}
                                            >
                                                <i className="fa-solid fa-times-circle text-lg"></i>
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="p-2 w-[3%] font-medium text-gray-900">{booking.id}</td>
                                <td className="p-2 w-[20%]">{booking.user.name}</td>
                                <td className="p-2 w-[38%] break-words">{booking.homestay.name}</td>
                                <td className="p-2 w-[9%]">{booking.checkin_date}</td>
                                <td className="p-2 w-[9%]">{booking.checkout_date}</td>
                                <td className="p-2 w-[5%]">{booking.guests}</td>
                                <td className={`p-2 w-[10%] font-bold ${
                                    booking.status === "pending" ? "text-yellow-500" :
                                    booking.status === "confirmed" ? "text-green-500" :
                                    booking.status === "rejected" ? "text-red-500" :
                                    booking.status === "cancelled" ? "text-gray-500" :
                                    "text-gray-500"
                                }`}>
                                    {booking.status === "pending" ? "Mới" :
                                    booking.status === "confirmed" ? "Đã xác nhận" :
                                    booking.status === "rejected" ? "Đã từ chối" :
                                    booking.status === "cancelled" ? "Đã hủy" :
                                    "NAN"}
                                </td>
                                <td className="p-2 w-[5%]">{booking.currency}</td>
                                <td className="p-2 w-[6%]">{booking.subtotal}</td>
                                <td className="p-2 w-[6%]">{booking.fee}</td>
                                <td className="p-2 w-[6%]">{booking.total_amount}</td>
                                <td className="p-2 w-[3%] relative">
                                    <button onClick={() => handleToggleNote(booking.id)}>
                                        {booking.note ? (
                                            <span className="relative flex justify-center items-center cursor-pointer hover:text-blue-500">
                                                <i className="fa-regular fa-note-sticky text-xl text-red-500">⁺</i>
                                            </span>
                                        ) : (
                                            <i className="fa-regular fa-note-sticky text-xl"></i>
                                        )}
                                    </button>

                                    {/* 🔥 Popup hiển thị khi mở */}
                                    {openNoteId === booking.id && (
                                        <div ref={popupRef} className="absolute right-0 mt-2 w-64 max-w-xs bg-white shadow-lg rounded-lg p-3 border border-gray-200 z-50 text-left break-words">
                                            <h3 className="text-sm font-semibold text-gray-700">Ghi chú</h3>
                                            <p className="text-xs text-gray-600 whitespace-pre-wrap">{booking.note || "Không có ghi chú"}</p>

                                            {/* Chi tiết Booking Line hiển thị trên một dòng */}
                                            {bookingLines[booking.id] && bookingLines[booking.id].length > 0 && (
                                                <div className="mt-2">
                                                    <h4 className="font-semibold text-gray-700 text-xs mb-1">Chi tiết Booking</h4>
                                                    <div className="text-xs text-gray-600 flex flex-wrap">
                                                        {bookingLines[booking.id].map((line, index) => (
                                                            <div key={index} className="border-b pb-1 last:border-b-0 w-full">
                                                                <span className="font-semibold">Loại: </span>
                                                                <span>{line.type}</span>,
                                                                <span className="font-semibold"> Giá: </span>
                                                                <span>{line.single_amount} {booking.currency}</span>,
                                                                <span className="font-semibold"> Số lượng: </span>
                                                                <span>{line.quantity}</span>,
                                                                <span className="font-semibold"> Tổng: </span>
                                                                <span>{line.sub_amount} {booking.currency}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12" className="p-3 text-center text-gray-500">Không có bookings nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default BookingList;
