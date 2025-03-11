import AddressSearch from "./AddressSearch";

const SearchBar = () => {
  return (
    <div className="flex items-center bg-white rounded-full shadow-md p-2 mt-5 w-full max-w-3xl">
      <div className="flex-1 px-4">
        <p className="text-xs font-semibold text-gray-600">Địa điểm</p>
        {/* <input
          type="text"
          placeholder="Tìm kiếm điểm đến"
          className="w-full bg-transparent outline-none text-gray-800"
        /> */}
        <AddressSearch />
      </div>
      <div className="border-l h-8" />
      <div className="flex-1 px-4">
        <p className="text-xs font-semibold text-gray-600">Nhận phòng</p>
        <input
          type="date"
          className="w-full bg-transparent outline-none text-gray-800"
        />
      </div>
      <div className="border-l h-8" />
      <div className="flex-1 px-4">
        <p className="text-xs font-semibold text-gray-600">Trả phòng</p>
        <input
          type="date"
          className="w-full bg-transparent outline-none text-gray-800"
        />
      </div>
      <div className="border-l h-8" />
      <div className="flex-1 px-4">
        <p className="text-xs font-semibold text-gray-600">Khách</p>
        <input
          type="number"
          min="1"
          placeholder="Thêm khách"
          className="w-full bg-transparent outline-none text-gray-800"
        />
      </div>
      <button className="bg-red-500 text-white rounded-full p-3 ml-2 hover:bg-red-600">
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
