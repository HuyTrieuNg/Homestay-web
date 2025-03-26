import { useState } from "react";
import { PropTypes } from "prop-types";
import GuestSelector from "./GuestSelector";
const BookingGuestPicker = ({
  isDropdown = false,
  guests,
  setGuests,
  isModalGuestOpen,
  setIsModalGuestOpen,
}) => {
  const [adults, setAdults] = useState(guests.adults || 1);
  const [children, setChildren] = useState(guests.children || 0);
  const [pets, setPets] = useState(guests.pets || 0);
  const [isOpened, setIsOpened] = useState(false);

  const totalGuests = adults + children;
  const totalPets = pets;

  const handleSave = () => {
    setGuests({ adults, children, pets });
    if (isOpened) setIsOpened(false);
    if (isModalGuestOpen) setIsModalGuestOpen(false);
  };

  return (
    <div className="relative">
      {isDropdown ? (
        // Trường hợp Dropdown
        <div>
          <p className="text-sm text-gray-500">Khách</p>
          <div
            className="w-full bg-transparent outline-none text-gray-800 border rounded-lg p-2 cursor-pointer"
            onClick={() => setIsOpened(!isOpened)}
          >
            {totalGuests} Khách{totalPets ? `, ${totalPets} thú cưng` : ""}
          </div>
          {isOpened && (
            <div className="absolute">
              <GuestSelector
                adults={adults}
                setAdults={setAdults}
                numChildren={children}
                setChildren={setChildren}
                pets={pets}
                setPets={setPets}
                onClose={handleSave}
              />
            </div>
          )}
        </div>
      ) : (
        // Trường hợp Modal
        isModalGuestOpen && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
            <GuestSelector
              adults={adults}
              setAdults={setAdults}
              numChildren={children}
              setChildren={setChildren}
              pets={pets}
              setPets={setPets}
              onClose={handleSave} // Đóng khi lưu
            />
          </div>
        )
      )}
    </div>
  );
};

BookingGuestPicker.propTypes = {
  isDropdown: PropTypes.bool,
  setIsDropdown: PropTypes.func,
  guests: PropTypes.object,
  setGuests: PropTypes.func,
  isModalGuestOpen: PropTypes.bool,
  setIsModalGuestOpen: PropTypes.func,
};

export default BookingGuestPicker;
