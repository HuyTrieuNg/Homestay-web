// import { useContext, useEffect, useState } from "react";
// import AuthContext from "@context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "@utils/axiosInstance";
// import { setupAxiosInterceptors } from "../utils/axiosService";

// const BookingHistoryPage = () => {
//     const { authTokens, setAuthTokens, setUser, logoutUser } = useContext(AuthContext);
//     const [bookings, setBookings] = useState([]);
//     const [selectedBooking, setSelectedBooking] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     // Thiết lập interceptor khi component mount
//     useEffect(() => {
//         setupAxiosInterceptors(authTokens, setAuthTokens, setUser, logoutUser);
//     }, [authTokens, setAuthTokens, setUser, logoutUser]);

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 const response = await axiosInstance.get("/homestays/booking/mybookings");
//                 setBookings(response.data);
//                 console.log(response.data);
//                 // console.log(bookings[0].homestay.name);
//                 // console.log(response.)
//             } catch (error) {
//                 console.error("Lỗi khi lấy danh sách đặt phòng:", error);
//                 setError("Không thể tải danh sách đặt phòng.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookings();
//     }, []);

//     // const viewDetails = (bookingId) => {
//     //     axiosInstance.get(`/homestays/booking/bookinghistory/${bookingId}`)
//     //         .then(res => setSelectedBooking(res.data))
//     //         .catch(err => console.error(err));
//     // };

//     const viewDetails = (bookingId) => {
//         navigate(`/booking/${bookingId}`);
//     };

//     if (loading) return <p>Đang tải danh sách đặt phòng...</p>;
//     if (error) return <p className="text-red-500">{error}</p>;

//     return (
//         <div className="max-w-5xl mx-auto p-6 bg-white">
//             <h2 className="text-2xl font-bold text-center mb-4">Danh sách phòng đã đặt</h2>
//             {bookings.length === 0 ? (
//                 <p className="text-center">Bạn chưa đặt phòng nào.</p>
//             ) : (

//                 <div className="overflow-x-auto">

//                     <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="border px-4 py-2">STT</th>
//                                 <th className="border px-4 py-2">Homestay</th>
//                                 <th className="border px-4 py-2">Check-in</th>
//                                 <th className="border px-4 py-2">Check-out</th>
//                                 <th className="border px-4 py-2">Guests</th>
//                                 <th className="border px-4 py-2">Status</th>
//                                 <th className="border px-4 py-2">Currency</th>
//                                 <th className="border px-4 py-2">Subtotal</th>
//                                 <th className="border px-4 py-2">Fee</th>
//                                 <th className="border px-4 py-2">Total amount</th>
//                                 <th className="border px-4 py-2">Hành động</th>
//                                 <th className="border px-4 py-2">Hành động</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {bookings.map((booking, index) => (
//                                 <tr key={booking.id} className="text-center">
//                                     <td className="border px-4 py-2">{index + 1}</td>
//                                     <td className="border px-4 py-2">{booking.homestay.name}</td>
//                                     <td className="border px-4 py-2">{booking.checkin_date}</td>
//                                     <td className="border px-4 py-2">{booking.checkout_date}</td>
//                                     <td className="border px-4 py-2">{booking.guests}</td>
//                                     <td className="border px-4 py-2">{booking.status}</td>
//                                     <td className="border px-4 py-2">{booking.currency}</td>
//                                     <td className="border px-4 py-2">{booking.subtotal}</td>
//                                     <td className="border px-4 py-2">{booking.fee}</td>
//                                     <td className="border px-4 py-2">{booking.total_amount}</td>
//                                     <td className="border px-4 py-2">
//                                         <button
//                                             onClick={() => viewDetails(booking.id)}
//                                             className="bg-blue-500 text-white px-3 py-1 rounded"
//                                         >
//                                             Xem Chi Tiết
//                                         </button>
//                                     </td>
//                                     {booking.homestay.images && booking.homestay.images.length > 0 ? (
//                                         <>
//                                             {/* {console.log("URL Image:", booking.homestay.images[0])} */}
//                                             <img src={booking.homestay.images[0]} alt="Homestay" className="w-16 h-16 object-cover" />
//                                         </>
//                                     ) : (
//                                         <p>Không có ảnh</p>
//                                     )}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {/* {selectedBooking && (
//                             <div className="mt-6 p-4 border rounded bg-gray-100">
//                                 <h3 className="text-xl font-bold">Chi tiết đặt phòng</h3>
//                                 <p><strong>Khách hàng:</strong> {selectedBooking.user_email}</p>
//                                 <p><strong>Tên Homestay:</strong> {selectedBooking.homestay_name}</p>
//                                 <p><strong>Check-in:</strong> {selectedBooking.checkin_date}</p>
//                                 <p><strong>Check-out:</strong> {selectedBooking.checkout_date}</p>
//                                 <p><strong>Tổng tiền:</strong> {selectedBooking.total_amount} {selectedBooking.currency}</p>
//                                 <p><strong>Trạng thái:</strong> {selectedBooking.status}</p>
//                                 <h4 className="mt-3 font-bold">Dịch vụ chi tiết:</h4>
//                                 <ul>
//                                     {selectedBooking.booking_lines.map((line, index) => (
//                                         <li key={index} className="border-b py-1">
//                                             {line.type} - {line.quantity} x {line.single_amount} = {line.sub_amount} {selectedBooking.currency}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )} */}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BookingHistoryPage;


import { useContext, useEffect, useState } from "react";
import AuthContext from "@context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";
import { setupAxiosInterceptors } from "../utils/axiosService";

const BookingHistoryPage = () => {
    const { authTokens, setAuthTokens, setUser, logoutUser } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setupAxiosInterceptors(authTokens, setAuthTokens, setUser, logoutUser);
    }, [authTokens, setAuthTokens, setUser, logoutUser]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axiosInstance.get("/homestays/booking/mybookings");
                setBookings(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đặt phòng:", error);
                setError("Không thể tải danh sách đặt phòng.");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const viewDetails = (bookingId) => {
        navigate(`/booking/${bookingId}`);
    };

    if (loading) return <p className="text-center text-gray-500">Đang tải danh sách đặt phòng...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <button
                onClick={() => window.history.back()}
                className="text-black mb-4 flex items-center text-3xl font-semibold"
            >
                <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Chuyến đi của bạn</span>
            </button>

            {bookings.length === 0 ? (
                <div className="text-center">
                    <p className="text-lg text-gray-600">Bạn chưa có chuyến đi nào.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
                    >
                        Bắt đầu khám phá
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="flex items-start border border-gray-300 rounded-lg p-4 hover:border-black transition-colors"
                        >
                            {/* Hình ảnh Homestay */}
                            <div className="w-40 h-40 flex-shrink-0">
                                {booking.homestay.images && booking.homestay.images.length > 0 ? (
                                    <img
                                        src={booking.homestay.images[0]}
                                        alt="Homestay"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                                        <p className="text-gray-500">Không có ảnh</p>
                                    </div>
                                )}
                            </div>

                            {/* Thông tin chính */}
                            <div className="ml-6 flex-1">
                                <h3 className="text-xl font-semibold">{booking.homestay.name}</h3>
                                <p className="text-gray-600">
                                    {booking.checkin_date} - {booking.checkout_date}
                                </p>
                                <p className="text-gray-500">Số khách: {booking.guests}</p>
                                <p className="text-gray-500">Note: {booking.note}</p>
                                <p className="text-gray-700 font-medium">
                                    Tổng tiền: {booking.total_amount} {booking.currency}
                                </p>
                                <span
                                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${booking.status === "confirmed"
                                        ? "bg-green-100 text-green-800"
                                        : booking.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            {/* Nút hành động */}
                            <div className="ml-4">
                                <button
                                    onClick={() => viewDetails(booking.id)}
                                    className="text-black border border-black px-4 py-2 rounded-full hover:bg-gray-100"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingHistoryPage;