import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useParams } from "react-router-dom";
import StarRating from "@/components/StartRating";

function BookingHistoryDetailPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // Trạng thái ẩn/hiện danh sách đầy đủ

  const [review, setReview] = useState({
    overall_rating: 5,
    cleanliness_rating: 5,
    accuracy_rating: 5,
    checkin_rating: 5,
    communication_rating: 5,
    location_rating: 5,
    value_rating: 5,
    comment: "",
  });
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [canReview, setCanReview] = useState(false); // New state for review eligibility
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/homestays/booking/bookinghistory/${bookingId}`)
      .then((res) => {
        setBooking(res.data);
        console.log(res.data);
        setLoading(false);

        // Check review eligibility
        const checkoutDate = new Date(res.data.checkout_date);
        const currentDate = new Date();
        const reviewDeadline = new Date(checkoutDate);
        reviewDeadline.setDate(checkoutDate.getDate() + 14);

        if (res.data.status !== "confirmed") {
          setReviewMessage("Chỉ có thể đánh giá các booking đã được xác nhận.");
          setCanReview(false);
        } else if (currentDate < checkoutDate) {
          setReviewMessage("Chỉ có thể đánh giá sau khi bạn checkout.");
          setCanReview(false);
        } else if (currentDate > reviewDeadline) {
          setReviewMessage("Thời hạn đánh giá đã hết (14 ngày sau checkout).");
          setCanReview(false);
        } else {
          setCanReview(true);
        }
        axiosInstance
          .get(`/homestays/reviews/${res.data.homestay.id}/?booking=${res.data.id}`)
          .then((reviewRes) => {
            if (reviewRes.data.length > 0) {
              setHasReviewed(true);
              setReviewMessage("Bạn đã gửi đánh giá cho chuyến đi này.");
              setReview(reviewRes.data[0]); // Load review lên nếu muốn hiển thị
            }
          })
          .catch((err) => {
            console.error("Error checking reviews:", err);
          });
      })
      .catch((err) => {
        console.error("Error loading booking details:", err);
        setError("Something went wrong. Please try again.");
        setLoading(false);
      });
  }, [bookingId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);

    const reviewData = {

      booking: booking.id,
      overall_rating: parseInt(review.overall_rating),
      cleanliness_rating: parseInt(review.cleanliness_rating),
      accuracy_rating: parseInt(review.accuracy_rating),
      checkin_rating: parseInt(review.checkin_rating),
      communication_rating: parseInt(review.communication_rating),
      location_rating: parseInt(review.location_rating),
      value_rating: parseInt(review.value_rating),
      comment: review.comment,
    };

    axiosInstance
      .post(`/homestays/reviews/${booking.homestay.id}/`, reviewData)
      .then((res) => {
        setReviewSuccess("Đánh giá của bạn đã được gửi thành công!");
        setHasReviewed(true);
      })
      .catch((err) => {
        console.error("Error submitting review2:", err.response?.data);
        console.error("Error submitting review:", err);
        setReviewError(
          err.response?.data?.error || "Không thể gửi đánh giá. Vui lòng thử lại."
        );
      });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-black text-lg">Loading your trip...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  const checkinDate = new Date(booking.checkin_date);
  const checkoutDate = new Date(booking.checkout_date);
  const numberOfNights = Math.ceil(
    (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)
  );
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
          <svg
            className="w-6 h-6 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
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
            <h1 className="text-2xl font-semibold mb-4">
              Homestay {booking.homestay.name}
            </h1>
            <p className="text-black-600 mt-1">
              Địa chỉ:{" "}
              {[
                booking.homestay.address,
                booking.homestay.province.name,
                booking.homestay.district.name,
                booking.homestay.commune.name,
              ]
                .filter(Boolean) // Loại bỏ phần tử null hoặc undefined
                .join(", ")}
            </p>
            <p className="text-black mt-1">
              Mô tả: {booking.homestay.description}
            </p>
            <p className="text-black mt-1">
              Loại phòng: {booking.homestay.type.name}
            </p>
            <div className="text-black mt-1">
              Tiện nghi:
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
                      {showAll ? "Thu gọn" : "Xem thêm"}
                    </button>
                    // <button
                    //     className="mt-3 text-blue-500 hover:underline"
                    //     onClick={() => setShowAll(!showAll)}
                    // >
                    //     {showAll ? "Thu gọn" : "Xem thêm"}
                    // </button>
                  )}
                </>
              )}
            </div>
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
                  {checkinDate.toLocaleDateString()} -{" "}
                  {checkoutDate.toLocaleDateString()}
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
                <p className="text-sm text-black">
                  Số điện thoại: {booking.host_phone || "Phone unavailable"}
                </p>
              </div>
            </div>
          </section>


          {/* Review Section */}
          <section className="pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Đánh giá của bạn</h2>
            {reviewSuccess && (
              <p className="text-green-500 mb-4">{reviewSuccess}</p>
            )}
            {reviewError && (
              <p className="text-red-500 mb-4">{reviewError}</p>
            )}
            {
              hasReviewed ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-4">
                    <label className="w-40 text-sm font-medium">
                      Đánh giá tổng thể
                    </label>
                    {Array(Math.round(review.overall_rating))
                      .fill("★")
                      .join("")}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-40 text-sm font-medium">
                      Mức độ sạch sẽ
                    </label>
                    {Array(Math.round(review.cleanliness_rating))
                      .fill("★")
                      .join("")}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-40 text-sm font-medium">
                      Độ chính xác
                    </label>
                    {Array(Math.round(review.accuracy_rating))
                      .fill("★")
                      .join("")}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-40 text-sm font-medium">
                      Nhận phòng
                    </label>
                    {Array(Math.round(review.checkin_rating))
                      .fill("★")
                      .join("")}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-40 text-sm font-medium">
                      Giao tiếp
                    </label>
                    {Array(Math.round(review.communication_rating))
                      .fill("★")
                      .join("")}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-40 text-sm font-medium">
                      Vị trí
                    </label>
                    {Array(Math.round(review.location_rating))
                      .fill("★")
                      .join("")}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-40 text-sm font-medium">
                      Giá trị
                    </label>
                    {Array(Math.round(review.value_rating))
                      .fill("★")
                      .join("")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-5">Nhận xét</label>
                    <textarea
                      name="comment"
                      value={review.comment}
                      className="w-full border rounded-lg p-2"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              )
                : !canReview ? (
                  <p className="text-black">{reviewMessage}</p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-4">
                        <label className="w-40 text-sm font-medium">
                          Đánh giá tổng thể
                        </label>
                        <StarRating
                          name="overall_rating"
                          value={review.overall_rating}
                          onChange={handleReviewChange}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-40 text-sm font-medium">
                          Mức độ sạch sẽ
                        </label>
                        <StarRating
                          name="cleanliness_rating"
                          value={review.cleanliness_rating}
                          onChange={handleReviewChange}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-40 text-sm font-medium">
                          Độ chính xác
                        </label>
                        <StarRating
                          name="accuracy_rating"
                          value={review.accuracy_rating}
                          onChange={handleReviewChange}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-40 text-sm font-medium">
                          Nhận phòng
                        </label>
                        <StarRating
                          name="checkin_rating"
                          value={review.checkin_rating}
                          onChange={handleReviewChange}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-40 text-sm font-medium">
                          Giao tiếp
                        </label>
                        <StarRating
                          name="communication_rating"
                          value={review.communication_rating}
                          onChange={handleReviewChange}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-40 text-sm font-medium">
                          Vị trí
                        </label>
                        <StarRating
                          name="location_rating"
                          value={review.location_rating}
                          onChange={handleReviewChange}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-40 text-sm font-medium">
                          Giá trị
                        </label>
                        <StarRating
                          name="value_rating"
                          value={review.value_rating}
                          onChange={handleReviewChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Nhận xét</label>
                      <textarea
                        name="comment"
                        value={review.comment}
                        onChange={handleReviewChange}
                        className="w-full border rounded-lg p-2"
                        rows="4"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-[#FF385C] text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Gửi đánh giá
                    </button>
                  </form>
                )}
          </section>
        </div>

        {/* Right Column - Price Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white border border-gray-300 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Chi tiết giá</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>
                  {booking.homestay.base_price} {booking.currency} x{" "}
                  {numberOfNights} đêm
                </span>
                <span>
                  {booking.subtotal} {booking.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  {" "}
                  <a href="#" className="text-black underline">
                    Phí dịch vụ Airbnb:
                  </a>
                </span>
                <span>
                  {booking.fee || 0} {booking.currency}
                </span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-3 text-xl">
                <span>Tổng ({booking.currency}):</span>
                <span>
                  {booking.total_amount} {booking.currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Trợ giúp</h2>
        <p className="text-sm text-black">
          Cần hỗ trợ? Liên hệ với bộ phận hỗ trợ qua số{" "}
          <span className="font-medium">1-800-AIRBNB</span> hoặc liên hệ với chủ
          nhà của bạn.
        </p>
      </section>
    </div>
  );
}

export default BookingHistoryDetailPage;
