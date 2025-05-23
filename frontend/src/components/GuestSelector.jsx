import { PropTypes } from "prop-types";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";

const GuestSelector = ({
  adults,
  setAdults,
  numChildren,
  setChildren,
  pets,
  setPets,
  onSave,
  onCancel,
  haveMaxGuests = false,
  maxGuests: maxGuestsProp, // accept maxGuests prop
}) => {
  const [maxGuests, setMaxGuests] = useState(maxGuestsProp ?? 6);
  const { id } = useParams();

  useEffect(() => {
    if (typeof maxGuestsProp === "number") {
      setMaxGuests(maxGuestsProp);
    } else if (haveMaxGuests && id) {
      axiosInstance
        .get(`homestays/${id}/maxGuests`)
        .then((response) => {
          setMaxGuests(response.data.max_guests);
        })
        .catch((error) => {
          console.error("Error fetching max guests:", error);
          setMaxGuests(6);
        });
    }
  }, [haveMaxGuests, id, maxGuestsProp]);

  const totalGuests = adults + numChildren;
  const canIncrease = !haveMaxGuests || totalGuests < maxGuests;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg w-72">
      <h2 className="text-lg font-semibold mb-2">Khách</h2>
      {haveMaxGuests && maxGuests !== null ? (
        <p className="text-sm text-gray-500 mb-3">
          Tối đa{" "}
          <span className="font-semibold">
            {maxGuests} khách
          </span>
          , không tính thú cưng.
        </p>
      ) : null}

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
            onClick={() => canIncrease && setAdults(adults + 1)}
            className={`px-3 py-1 bg-gray-200 rounded-lg ${
              !canIncrease ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!canIncrease}
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
            onClick={() => canIncrease && setChildren(numChildren + 1)}
            className={`px-3 py-1 bg-gray-200 rounded-lg ${
              !canIncrease ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!canIncrease}
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
        <button className="bg-gray-300 px-4 py-2 rounded-lg" onClick={onCancel}>
          Hủy
        </button>
        <button
          className="bg-[#FF385C] text-white px-4 py-2 rounded-lg"
          onClick={onSave}
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
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  haveMaxGuests: PropTypes.bool,
};

export default GuestSelector;
