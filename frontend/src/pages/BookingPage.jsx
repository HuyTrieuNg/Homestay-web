import { Star, ShieldCheck, Clock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import BookingGuestPicker from "@/components/BookingGuestPicker";
import BookingDatePicker from "@/components/BookingDatePicker";

function BookingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pricePerNight = 697429;
  const serviceFee = 492305;
  const [numNights, setNumNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [isModalGuestOpen, setIsModalGuestOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, pets: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const totalGuests = guests.adults + guests.children;
  const totalPets = guests.pets;

  return (
    <div className="min-h-screen bg-white-100">
      <div className="flex justify-center">
        <div className="max-w-6xl w-full grid grid-cols-2 gap-15 p-6">
          <div className="col-span-2 text-3xl font-semibold bg-white flex items-center">
            <ArrowLeft
              className="cursor-pointer text-3xl mr-2"
              onClick={() => window.history.back()}
            />
            Yêu cầu đặt phòng/đặt chỗ
          </div>
          {/* phần bên trái */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg text-black border border-gray-300">
              <p>
                <strong>Nơi này rất hiếm khi còn chỗ.</strong>
              </p>
              <p>Nhà/phòng cho thuê của Pink Barrel Bali thường kín phòng.</p>
            </div>

            {/* thông tin ngày đặt phòng và số người ở */}
            <div>
              {/* Chọn ngày */}
              <BookingDatePicker
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                basePrice={pricePerNight}
                setNumNights={setNumNights}
                setTotalPrice={setTotalPrice}
              />

              {/* Số người ở */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">Khách</p>
                  <p className="text-gray-700">
                    {totalGuests} Khách
                    {totalPets ? `, ${totalPets} thú cưng` : ""}
                  </p>
                </div>
                <button
                  className="bg-white text-black px-4 py-2 rounded-lg border cursor-pointer"
                  onClick={() => setIsModalGuestOpen(true)}
                >
                  Chỉnh sửa
                </button>
              </div>
              {/* chọn số lượng người ở (đang là không được quá 6 ng)*/}
              <BookingGuestPicker
                isDropdown={false}
                guests={guests}
                setGuests={setGuests}
                isModalGuestOpen={isModalGuestOpen}
                setIsModalGuestOpen={setIsModalGuestOpen}
              />
            </div>
            <hr className="border-t border-gray-300 my-4" />

            {/* thông tin thanh toán */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-semibold mb-4">
                    Thanh toán bằng
                  </h1>
                </div>
                <div className="flex justify-end mt-3">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                    alt="Visa"
                    className="h-2 mr-2"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                    alt="Mastercard"
                    className="h-2"
                  />
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="relative">
                <div
                  className="border p-3 rounded-lg flex items-center justify-between cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)} // Toggle dropdown khi click
                >
                  <div className="flex items-center gap-2">
                    <span>Thẻ tín dụng hoặc thẻ ghi nợ</span>
                  </div>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </div>

                {isOpen && (
                  <div className="absolute top-full left-0 w-full bg-white border rounded-lg mt-2 shadow-md">
                    <ul className="p-2">
                      <li
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        Thẻ tín dụng hoặc thẻ ghi nợ
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Số thẻ */}
              <input
                type="text"
                placeholder="Số thẻ"
                className="w-full mt-3 p-3 border rounded-lg hover:border-gray-500 focus:border-black transition-all duration-200"
              />

              {/* Ngày hết hạn + CVV */}
              <div className="flex gap-3 mt-3">
                <input
                  type="text"
                  placeholder="Ngày hết hạn"
                  className="w-1/2 p-3 border rounded-lg hover:border-gray-500 focus:border-black transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 p-3 border rounded-lg hover:border-gray-500 focus:border-black transition-all duration-200"
                />
              </div>

              {/* Mã bưu chính */}
              <input
                type="text"
                placeholder="Mã bưu chính"
                className="w-full mt-3 p-3 border rounded-lg"
              />

              {/* Quốc gia/Khu vực */}
              <div className="border p-3 mt-3 rounded-lg flex items-center justify-between cursor-pointer">
                <span>Việt Nam</span>
              </div>
            </div>
            <hr className="border-t border-gray-300 my-4" />

            {/* Bắt buộc cho chuyến đi của bạn */}
            <div className="mt-6">
              <h1 className="text-2xl font-semibold mb-4">
                Bắt buộc cho chuyến đi của bạn
              </h1>
              <div className="flex justify-between items-start gap-x-4 mb-4">
                <div>
                  <p className="text-l font-semibold">Nhắn tin cho Chủ nhà</p>
                  <p className="text-sm text-gray-600">
                    Trước khi bạn có thể tiếp tục, hãy chia sẻ đôi chút với Pink
                    Barrel Bali về chuyến đi của bạn và lý do chỗ ở của họ phù
                    hợp với bạn.
                  </p>
                </div>
                <button className="border px-4 py-1 rounded-lg">Thêm</button>
              </div>

              <div className="flex justify-between items-start gap-x-4">
                <div>
                  <p className="text-l font-semibold">Số điện thoại</p>
                  <p className="text-sm text-gray-600">
                    Thêm và xác nhận số điện thoại của bạn để nhận thông tin cập
                    nhật về chuyến đi.
                  </p>
                </div>
                <button className="border px-4 py-1 rounded-lg">Thêm</button>
              </div>
            </div>
            <hr className="border-t border-gray-300 my-4" />

            {/* Chính sách hủy */}
            <div className="mt-6">
              <h1 className="text-2xl font-semibold mb-4">Chính sách hủy</h1>
              <p>
                <strong>Hủy miễn phí trước 2 thg 4.</strong> Bạn được hoàn tiền
                một phần nếu hủy trước khi nhận phòng vào 7 thg 4.{" "}
                <a href="#" className="text-black font-semibold underline">
                  Tìm hiểu thêm
                </a>
              </p>
            </div>
            <hr className="border-t border-gray-300 my-4" />

            {/* quy chuẩn chung */}
            <div className="mt-6">
              <h1 className="text-2xl font-semibold mb-4">Quy chuẩn chung</h1>
              <p className="mb-4">
                Chúng tôi yêu cầu tất cả khách phải ghi nhớ một số quy chuẩn đơn
                giản để làm một vị khách tuyệt vời.
              </p>
              <ul className="list-disc pl-6">
                <li>Tuân thủ nội quy nhà</li>
                <li>Giữ gìn ngôi nhà như thể đó là nhà bạn</li>
              </ul>
            </div>
            <hr className="border-t border-gray-300 my-4" />

            {/* */}
            <div className="mt-6 flex items-start gap-2">
              <Clock className="w-20 h-20" />
              <div>
                <span className="text-l font-semibold">
                  Đặt phòng/đặt chỗ của bạn sẽ không được xác nhận cho đến khi
                  chủ nhà/người tổ chức chấp nhận yêu cầu của bạn (trong vòng 24
                  giờ).
                </span>
                <span> Bạn sẽ không bị trừ tiền cho đến lúc đó.</span>
              </div>
            </div>

            {/* chính sách và nút thanh toán */}
            <hr className="border-t border-gray-300 my-4" />
            <div className="mt-6">
              <p className="text-xs">
                Bằng việc chọn nút bên dưới, tôi đồng ý với{" "}
                <a href="#" className="text-black font-semibold underline">
                  {" "}
                  Nội quy nhà của Chủ nhà
                </a>
                ,{" "}
                <a href="#" className="text-black font-semibold underline">
                  Quy chuẩn chung đối với khách
                </a>
                ,{" "}
                <a href="#" className="text-black font-semibold underline">
                  Chính sách đặt lại và hoàn tiền của Airbnb
                </a>
                ,{" "}
                <a href="#" className="text-black font-semibold underline">
                  Điều khoản trả trước một phần
                </a>
                , và đồng ý rằng Airbnb có thể tính phí vào phương thức thanh
                toán của tôi nếu tôi phải chịu trách nhiệm về thiệt hại. Tôi
                đồng ý thanh toán tổng số tiền được hiển thị nếu Chủ nhà chấp
                nhận yêu cầu đặt phòng của tôi.
              </p>
            </div>
            <button className="bg-[#FF385C] text-white font-semibold px-4 py-2 rounded-lg text-xl cursor-pointer">
              Yêu cầu đặt phòng
            </button>
          </div>

          {/* phần bên phải*/}
          <div className="p-4 rounded-lg sticky top-10 h-fit bg-white text-black border border-gray-300">
            {/* thông tin phòng */}
            <div className="flex items-center gap-4">
              <img
                src="https://a0.muscache.com/im/pictures/miso/Hosting-5004250/original/ec5908f9-4361-4213-a158-09d108fec9f3.jpeg?aki_policy=large"
                alt="Phòng"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <p className="text-lg font-semibold">
                  O Remoinho - Cối xay gió
                </p>
                <p className="text-gray-500">Cối xay gió</p>
                <p className="text-gray-500 flex items-center gap-2">
                  <Star className="w-3 h-3 text-black" />
                  4,97 (147 đánh giá) ·
                  <ShieldCheck className="w-3 h-3 text-gray-700" />
                  Chủ nhà siêu cấp
                </p>
              </div>
            </div>
            <hr className="border-t border-gray-300 my-4" />

            {/* giá tiền */}
            <h1 className="text-2xl font-semibold mb-4">Chi tiết giá</h1>
            <div className="flex justify-between mb-4">
              <p>
                ₫{pricePerNight.toLocaleString()} x {numNights} đêm
              </p>
              <p>₫{(numNights * pricePerNight).toLocaleString()}</p>
            </div>

            <div className="flex justify-between mb-4">
              <a href="#" className="text-black underline">
                Phí dịch vụ Airbnb:
              </a>
              <p>₫{serviceFee.toLocaleString()}</p>
            </div>

            <hr className="border-t border-gray-300 my-4" />

            <div className="flex justify-between text-lg font-bold">
              <p>Tổng(VND):</p>
              <p>₫{totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BookingPage;
