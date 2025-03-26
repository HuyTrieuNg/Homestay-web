import { PropTypes } from "prop-types";

const GuestSelector = ({
  adults,
  setAdults,
  numChildren,
  setChildren,
  pets,
  setPets,
  onClose,
}) => {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg w-72">
      <h2 className="text-lg font-semibold mb-2">Khách</h2>
      <p className="text-sm text-gray-500 mb-3">
        Tối đa <span className="font-semibold">6 khách</span>, không tính thú
        cưng.
      </p>

      {/* Người lớn */}
      <div className="flex justify-between items-center mb-2">
        <p>Người lớn</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAdults(Math.max(1, adults - 1))}
            className="px-3 py-1 bg-gray-200 rounded-lg"
          >
            -
          </button>
          <span>{adults}</span>
          <button
            onClick={() => adults + numChildren < 6 && setAdults(adults + 1)}
            className="px-3 py-1 bg-gray-200 rounded-lg"
            disabled={adults + numChildren >= 6}
          >
            +
          </button>
        </div>
      </div>

      {/* Trẻ em */}
      <div className="flex justify-between items-center mb-2">
        <p>Trẻ em</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChildren(Math.max(0, numChildren - 1))}
            className="px-3 py-1 bg-gray-200 rounded-lg"
          >
            -
          </button>
          <span>{numChildren}</span>
          <button
            onClick={() =>
              adults + numChildren < 6 && setChildren(numChildren + 1)
            }
            className="px-3 py-1 bg-gray-200 rounded-lg"
            disabled={adults + numChildren >= 6}
          >
            +
          </button>
        </div>
      </div>

      {/* Thú cưng */}
      <div className="flex justify-between items-center mb-4">
        <p>Thú cưng</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPets(Math.max(0, pets - 1))}
            className="px-3 py-1 bg-gray-200 rounded-lg"
          >
            -
          </button>
          <span>{pets}</span>
          <button
            onClick={() => setPets(pets + 1)}
            className="px-3 py-1 bg-gray-200 rounded-lg"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button className="bg-gray-300 px-4 py-2 rounded-lg" onClick={onClose}>
          Hủy
        </button>
        <button
          className="bg-[#FF385C] text-white px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

GuestSelector.propTypes = {
  adults: PropTypes.number,
  setAdults: PropTypes.func,
  numChildren: PropTypes.number,
  setChildren: PropTypes.func,
  pets: PropTypes.number,
  setPets: PropTypes.func,
  onClose: PropTypes.func,
};

export default GuestSelector;
