import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import PropTypes from "prop-types";

const AddressSearch = ({ onSelectAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("homestays/provinces")
      .then((response) => {
        setAddresses(response.data);
        console.log("Addresses:", response.data);
      })
      .catch((err) => {
        console.error("Error fetching addresses:", err);
      });
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Lọc danh sách gợi ý dựa trên input
    if (value.length > 0) {
      setSuggestions(
        addresses.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (value) => {
    setQuery(value);
    setSuggestions([]);
    onSelectAddress(value);
  };

  return (
    <div className="relative border rounded-lg w-full p-2 text-gray-800">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Tìm kiếm điểm đến"
        className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 px-3"
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 shadow-md z-10">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item.name)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

AddressSearch.propTypes = {
  onSelectAddress: PropTypes.func,
};

export default AddressSearch;
