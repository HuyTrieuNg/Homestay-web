import { Search } from "lucide-react";
import AddressSearch from "./AddressSearch";
import DateRangePicker from "./DateRangePicker";
import PropTypes from "prop-types";
import BookingGuestPicker from "./BookingGuestPicker";
import { useState } from "react";
import axiosInstance from "@utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: null,
    startDate: null,
    endDate: null,
    guests: { adults: 1, children: 0, pets: 0 }
  });

  const handleSelectAddress = (address) => {
    setSearchParams(prev => ({
      ...prev,
      location: address
    }));
  };

  const handleDateRangeChange = ({ start, end }) => {
    setSearchParams(prev => ({
      ...prev,
      startDate: start,
      endDate: end
    }));
  };

  const handleGuestsChange = (guests) => {
    setSearchParams(prev => ({
      ...prev,
      guests
    }));
  };

  const formatDate = (date) => {
    if (!date) return null;
    // Đảm bảo ngày được format theo múi giờ local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = async () => {
    // Validate search parameters
    if (!searchParams.location) {
      alert("Vui lòng chọn địa điểm");
      return;
    }
    if (!searchParams.startDate || !searchParams.endDate) {
      alert("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }

    const totalGuests = searchParams.guests.adults + searchParams.guests.children;
    if (totalGuests < 1) {
      alert("Số khách phải lớn hơn 0");
      return;
    }

    try {
      // Format search parameters
      const params = {
        address: searchParams.location.name || searchParams.location,
        start_date: formatDate(searchParams.startDate),
        end_date: formatDate(searchParams.endDate),
        guests: totalGuests
      };

      console.log('Search params:', params); // Debug log

      // Call search API
      const response = await axiosInstance.get('/homestays/search/', { params });
      
      // Navigate to search results page with the results
      navigate('/search-results', { 
        state: { 
          results: response.data,
          searchParams: params
        }
      });
    } catch (error) {
      console.error('Search error:', error.response?.data || error);
      alert(error.response?.data?.error || 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
    }
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
        <DateRangePicker 
          onSelectRange={handleDateRangeChange}
          initialStart={searchParams.startDate}
          initialEnd={searchParams.endDate}
        />
      </div>
      <div className="border-l h-8" />

      {/* Số khách */}
      <div className="flex-1 px-4 z-10">
        <BookingGuestPicker
          isDropdown={true}
          noBorder={true}
          onGuestsChange={handleGuestsChange}
          initialGuests={searchParams.guests}
          haveMaxGuests={false}
        />
      </div>

      {/* Nút tìm kiếm */}
      <button 
        onClick={handleSearch}
        className="bg-red-500 text-white rounded-full p-3 ml-2 hover:bg-red-600 transition-colors"
      >
        <Search />
      </button>
    </div>
  );
};

export default SearchBar;
