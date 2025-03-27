// import AuthContext from "@/context/AuthContext";
// import axiosInstance from "@/utils/axiosInstance";
// import { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// function BookingHistoryDetailPage() {
//     const { bookingId } = useParams();
//     const { authTokens } = useContext(AuthContext);
//     const [booking, setBooking] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         axiosInstance.get(`/homestays/booking/bookinghistory/${bookingId}`)
//             .then(res => {
//                 setBooking(res.data);
//                 console.log(res.data)
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error("Lỗi khi tải chi tiết booking:", err);
//                 setError("Không thể tải thông tin đặt phòng.");
//                 setLoading(false);
//             });
//     }, [bookingId]);

//     if (loading) return <p>Đang tải...</p>;
//     if (error) return <p className="text-red-500">{error}</p>;

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//             <h2 className="text-2xl font-bold mb-4">Chi Tiết Đặt Phòng</h2>
//             <p><strong>Tên Homestay:</strong> {booking.homestay_name}</p>
//             <p><strong>Check-in:</strong> {booking.checkin_date}</p>
//             <p><strong>Check-out:</strong> {booking.checkout_date}</p>
//             <p><strong>Số khách:</strong> {booking.guests}</p>
//             <p><strong>Tổng tiền:</strong> {booking.total_amount} {booking.currency}</p>
//             <p><strong>Trạng thái:</strong> {booking.status}</p>
//             <p><strong>Trạng thái:</strong> {booking.host_name}</p>
//             <p><strong>Trạng thái:</strong> {booking.host_phone}</p>

//             <h3 className="mt-4 text-lg font-bold">Dịch Vụ:</h3>
//             <ul>
//                 {booking.booking_lines.map((line, index) => (
//                     <li key={index} className="border-b py-1">
//                         {line.type} - {line.quantity} x {line.single_amount} = {line.sub_amount} {booking.currency}
//                     </li>
//                 ))}
//             </ul>
//             {booking.homestay.images && booking.homestay.images.length > 0 && (
//                 <div className="mt-4">
//                     <h3 className="text-lg font-bold">Hình ảnh Homestay:</h3>
//                     <img src={booking.homestay.images[0]} alt="Homestay" className="w-full h-64 object-cover rounded-lg shadow-md mt-2" />
//                 </div>
//             )}
//             <button
//                 onClick={() => window.history.back()}
//                 className="mt-4 bg-black text-white px-4 py-2 rounded"
//             >
//                 Quay lại
//             </button>
//         </div>
//     );
// }
// export default BookingHistoryDetailPage;



// import { useContext, useEffect, useState } from "react";
// import AuthContext from "@/context/AuthContext";
// import axiosInstance from "@/utils/axiosInstance";
// import { useParams } from "react-router-dom";

// function BookingHistoryDetailPage() {
//     const { bookingId } = useParams();
//     const { authTokens } = useContext(AuthContext);
//     const [booking, setBooking] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         axiosInstance
//             .get(`/homestays/booking/bookinghistory/${bookingId}`)
//             .then((res) => {
//                 setBooking(res.data);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error("Lỗi khi tải chi tiết booking:", err);
//                 setError("Không thể tải thông tin đặt phòng.");
//                 setLoading(false);
//             });
//     }, [bookingId]);

//     if (loading) return <p className="text-center text-black">Đang tải...</p>;
//     if (error) return <p className="text-center text-red-500">{error}</p>;

//     return (
//         <div className="max-w-5xl mx-auto p-6">
//             {/* Tiêu đề */}
//             <h2 className="text-3xl font-bold mb-6">Chi tiết chuyến đi</h2>

//             {/* Hình ảnh Homestay */}
//             {booking.homestay.images && booking.homestay.images.length > 0 && (
//                 <div className="mb-6">
//                     <img
//                         src={booking.homestay.images[0]}
//                         alt="Homestay"
//                         className="w-full h-96 object-cover rounded-lg shadow-md"
//                     />
//                 </div>
//             )}

//             {/* Nội dung chính */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Cột thông tin chính */}
//                 <div className="md:col-span-2">
//                     <h3 className="text-2xl font-semibold mb-4">{booking.homestay_name}</h3>
//                     <div className="space-y-4">
//                         <div>
//                             <p className="text-black">Ngày nhận phòng</p>
//                             <p className="font-medium">{booking.checkin_date}</p>
//                         </div>
//                         <div>
//                             <p className="text-black">Ngày trả phòng</p>
//                             <p className="font-medium">{booking.checkout_date}</p>
//                         </div>
//                         <div>
//                             <p className="text-black">Số khách</p>
//                             <p className="font-medium">{booking.guests}</p>
//                         </div>
//                         <div>
//                             <p className="text-black">Trạng thái</p>
//                             <span
//                                 className={`inline-block px-3 py-1 rounded-full text-sm ${
//                                     booking.status === "confirmed"
//                                         ? "bg-green-100 text-green-800"
//                                         : booking.status === "pending"
//                                         ? "bg-yellow-100 text-yellow-800"
//                                         : "bg-red-100 text-red-800"
//                                 }`}
//                             >
//                                 {booking.status}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Dịch vụ */}
//                     <div className="mt-6">
//                         <h4 className="text-lg font-semibold mb-2">Chi tiết dịch vụ</h4>
//                         <ul className="space-y-2">
//                             {booking.booking_lines.map((line, index) => (
//                                 <li key={index} className="flex justify-between border-b py-2">
//                                     <span>
//                                         {line.type} (x{line.quantity})
//                                     </span>
//                                     <span>
//                                         {line.sub_amount} {booking.currency}
//                                     </span>
//                                 </li>
//                             ))}
//                         </ul>
//                         <div className="mt-4 flex justify-between font-semibold">
//                             <span>Tổng tiền</span>
//                             <span>
//                                 {booking.total_amount} {booking.currency}
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Cột thông tin bổ sung */}
//                 <div className="md:col-span-1">
//                     <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//                         <h4 className="text-lg font-semibold mb-2">Thông tin liên hệ</h4>
//                         <p className="text-black">Chủ nhà: <span className="font-medium">{booking.host_name}</span></p>
//                         <p className="text-black">Số điện thoại: <span className="font-medium">{booking.host_phone}</span></p>
//                     </div>
//                 </div>
//             </div>

//             {/* Nút quay lại */}
//             <div className="mt-6">
//                 <button
//                     onClick={() => window.history.back()}
//                     className="border border-black text-black px-6 py-2 rounded-full hover:bg-black"
//                 >
//                     Quay lại
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default BookingHistoryDetailPage;


import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import { useParams } from "react-router-dom";

function BookingHistoryDetailPage() {
    const { bookingId } = useParams();
    const { authTokens } = useContext(AuthContext);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false); // Trạng thái ẩn/hiện danh sách đầy đủ

    useEffect(() => {
        axiosInstance
            .get(`/homestays/booking/bookinghistory/${bookingId}`)
            .then((res) => {
                setBooking(res.data);
                console.log(res.data)
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading booking details:", err);
                setError("Something went wrong. Please try again.");
                setLoading(false);
            });
    }, [bookingId]);

    if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-black text-lg">Loading your trip...</p></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><p className="text-red-500 text-lg">{error}</p></div>;

    const checkinDate = new Date(booking.checkin_date);
    const checkoutDate = new Date(booking.checkout_date);
    const numberOfNights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    const amenities = booking.homestay?.amenities || []; // Đảm bảo amenities là mảng
    const visibleAmenities = showAll ? amenities : amenities.slice(0, 5); // Chỉ hiển thị 5 tiện nghi đầu tiên nếu chưa mở rộng

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                {/* <button
                    onClick={() => window.history.back()}
                    className="text-black hover:text-black mb-4 flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Trips
                </button> */}
                <button
                    onClick={() => window.history.back()}
                    className="text-black mb-4 flex items-center text-3xl font-semibold"
                >
                    <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Chi tiết chuyến đi</span>
                </button>

            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2">
                    {/* Images */}
                    {booking.homestay?.images?.length > 0 && (
                        <div className="mb-8">
                            <img
                                src={booking.homestay.images[0]}
                                alt="Homestay"
                                className="w-full h-64 sm:h-96 object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <section className="border-b pb-6 mb-6">
                        <h1 className="text-2xl font-semibold mb-4">Homestay {booking.homestay.name}</h1>
                        <p className="text-black-600 mt-1">
                            Địa chỉ: {[booking.homestay.address, booking.homestay.province.name,
                            booking.homestay.district.name,
                            booking.homestay.commune.name]
                                .filter(Boolean) // Loại bỏ phần tử null hoặc undefined
                                .join(", ")}</p>
                        <p className="text-black mt-1">Mô tả: {booking.homestay.description}</p>
                        <p className="text-black mt-1">Loại phòng: {booking.homestay.type.name}</p>
                        <p className="text-black mt-1">Tiện nghi:
                            {amenities.length === 0 ? (
                                <p className="text-black">Không có tiện nghi nào.</p>
                            ) : (
                                <>
                                    <ul className="grid grid-cols-2 gap-2 mt-3">
                                        {visibleAmenities.map((amenity) => (
                                            <li
                                                key={amenity.id}
                                                className="px-3 py-1 bg-gray-100 rounded-md text-sm"
                                            >
                                                {amenity.name}
                                            </li>
                                        ))}
                                    </ul>

                                    {amenities.length > 5 && (
                                        <button
                                        className="bg-white text-black px-4 py-2 rounded-lg border border-gray-400 cursor-pointer mt-3"
                                        onClick={() => setShowAll(!showAll)}
                                        >
                                       {showAll ? "Thu gọn" : "Xem thêm"}</button>
                                        // <button
                                        //     className="mt-3 text-blue-500 hover:underline"
                                        //     onClick={() => setShowAll(!showAll)}
                                        // >
                                        //     {showAll ? "Thu gọn" : "Xem thêm"}
                                        // </button>
                                    )}
                                </>
                            )}

                        </p>
                        {/* <p className="text-black mt-1">{booking.homestay.amenities}</p> */}
                        {/* Modal for All Amenities */}

                    </section>

                    {/* Trip Details */}
                    <section className="border-b pb-6 mb-6">
                        <h1 className="text-2xl font-semibold mb-4">Chuyến đi của bạn</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-black">Ngày</p>
                                <p className="font-medium">
                                    {checkinDate.toLocaleDateString()} - {checkoutDate.toLocaleDateString()}
                                </p>
                                <p className="text-sm text-black">{numberOfNights} đêm</p>
                            </div>
                            <div>
                                <p className="text-sm text-black">Khách</p>
                                <p className="font-medium">{booking.guests} khách</p>
                            </div>
                        </div>
                    </section>

                    {/* Host Info */}
                    <section className="border-b pb-6 mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Chủ homestay</h2>
                        <div className="flex items-center">
                            
                            <div>
                                <p className="font-medium">Tên: {booking.host_name}</p>
                                <p className="text-sm text-black">Số điện thoại: {booking.host_phone || "Phone unavailable"}</p>
                            </div>
                        </div>
                    </section>

                    
                </div>

                {/* Right Column - Price Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 bg-white border border-gray-300 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-4">Chi tiết giá</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>
                                    {booking.homestay.base_price} {booking.currency} x {numberOfNights} đêm
                                </span>
                                <span>
                                    {booking.subtotal} {booking.currency}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span> <a href="#" className="text-black underline">Phí dịch vụ Airbnb:</a></span>
                                <span>{booking.fee || 0} {booking.currency}</span>
                            </div>
                            
                            <div className="flex justify-between font-semibold border-t pt-3 text-xl">
                                <span>Tổng ({booking.currency}):</span>
                                <span>{booking.total_amount} {booking.currency}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Section */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Trợ giúp</h2>
                <p className="text-sm text-black">
                Cần hỗ trợ? Liên hệ với bộ phận hỗ trợ qua số <span className="font-medium">1-800-AIRBNB</span> hoặc liên hệ với chủ nhà của bạn.
                </p>
            </section>

        </div>

    );
}

export default BookingHistoryDetailPage;