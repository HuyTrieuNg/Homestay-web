import { Star, ShieldCheck } from "lucide-react";
import PropTypes from "prop-types";

const BookingSideBox = ({ homestay, numNights, subTotalPrice, reviews }) => {
  const serviceFee = subTotalPrice * 0.1;
  const imageUrl = homestay.images[0];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const averageRating =
    reviews.length > 0
      ? (
        reviews.reduce((sum, review) => sum + review.overall_rating, 0) /
        reviews.length
      ).toFixed(2)
      : 0;

  return (
    <div className="p-4 rounded-lg sticky top-10 h-fit bg-white text-black border border-gray-300">
      {/* Thông tin phòng */}
      <div className="flex items-center gap-4">
        <img
          src={imageUrl}
          alt={homestay.name || "Phòng"}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div>
          <p className="text-lg font-semibold">{homestay.name}</p>
          <p className="text-gray-500">Cối xay gió</p>
          <p className="text-gray-500 flex items-center gap-2">
            <Star className="w-3 h-3 text-black" />
            {averageRating} ({reviews.length} đánh giá) ·
            <ShieldCheck className="w-3 h-3 text-gray-700" />
            Chủ nhà siêu cấp
          </p>
        </div>
      </div>

      <hr className="border-t border-gray-300 my-4" />

      {/* Giá tiền */}
      <h1 className="text-2xl font-semibold mb-4">Chi tiết giá</h1>
      <div className="flex justify-between mb-4">
        <p>
          {formatCurrency(homestay.base_price)} x {numNights} đêm
        </p>
        <p>{formatCurrency(subTotalPrice)}</p>
      </div>

      <div className="flex justify-between mb-4">
        <a href="#" className="text-black underline">
          Phí dịch vụ Airbnb:
        </a>
        <p>{formatCurrency(serviceFee)}</p>
      </div>

      <hr className="border-t border-gray-300 my-4" />

      <div className="flex justify-between text-lg font-bold">
        <p>Tổng (VND):</p>
        <p>{formatCurrency(subTotalPrice + serviceFee)}</p>
      </div>
    </div>
  );
};

BookingSideBox.propTypes = {
  homestay: PropTypes.object,
  numNights: PropTypes.number,
  subTotalPrice: PropTypes.number,
  reviews: PropTypes.array,
};

export default BookingSideBox;
