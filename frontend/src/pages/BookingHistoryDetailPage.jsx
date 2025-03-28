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
    const amenities = booking.homestay?.amenities || [];
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
                    className="text-black mb-4 flex items-center text-3xl font-semibold cursor-pointer"
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