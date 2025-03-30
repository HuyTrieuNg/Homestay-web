import { Search } from "lucide-react";
import AddressSearch from "./AddressSearch";
import DateRangePicker from "./DateRangePicker";
import PropTypes from "prop-types";
import BookingGuestPicker from "./BookingGuestPicker";

const SearchBar = ({ onSelectAddress, onGuestsChange }) => {
  const handleSelectAddress = (address) => {
    console.log("Selected address:", address);
    onSelectAddress(address);
  };

  const handleDateRangeChange = ({ start, end }) => {
    console.log("Date Range:", { start, end });
  };

  return (
    <div className="flex items-center bg-white border-2 rounded-full shadow-md p-2 mt-5 w-full max-w-3xl">
      {/* Địa điểm */}
      <div className="flex-1 px-4">
        <p className="text-xs font-semibold text-gray-800">Địa điểm</p>
        <AddressSearch onSelectAddress={handleSelectAddress} />
      </div>
      <div className="border-l h-8" />

      {/* Ngày nhận & trả phòng */}
      <div className="flex-1 px-4">
        <DateRangePicker onSelectRange={handleDateRangeChange} />
      </div>
      <div className="border-l h-8" />

      {/* Số khách */}
      <div className="flex-1 px-4 z-10">
        {/* <p className="text-xs font-semibold text-gray-600">Khách</p>
        <input
          type="number"
          min="1"
          placeholder="Thêm khách"
          className="w-full bg-transparent outline-none text-gray-800"
        /> */}
        <BookingGuestPicker
          isDropdown={true}
          noBorder={true}
          onGuestsChange={onGuestsChange}
        />
      </div>

      {/* Nút tìm kiếm */}
      <button className="bg-red-500 text-white rounded-full p-3 ml-2 hover:bg-red-600">
        <Search></Search>
      </button>
    </div>
  );
};

SearchBar.propTypes = {
  onSelectAddress: PropTypes.func,
  onGuestsChange: PropTypes.func,
};

export default SearchBar;
