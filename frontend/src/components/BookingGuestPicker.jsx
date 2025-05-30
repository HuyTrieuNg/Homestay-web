import { useState } from "react";
import { PropTypes } from "prop-types";
import GuestSelector from "./GuestSelector";

const BookingGuestPicker = ({
  isDropdown = false,
  noBorder = false,
  initialGuests,
  isModalGuestOpen,
  setIsModalGuestOpen,
  onGuestsChange,
  haveMaxGuests = false,
  maxGuests, 
}) => {
  const [adults, setAdults] = useState(initialGuests?.adults ?? 1);
  const [children, setChildren] = useState(initialGuests?.children ?? 0);
  const [pets, setPets] = useState(initialGuests?.pets ?? 0);
  const [isOpened, setIsOpened] = useState(false);

  const totalGuests = adults + children;
  const totalPets = pets;
  const guestLimit = typeof maxGuests === 'number' ? maxGuests : undefined;

  const canAddGuest = guestLimit ? totalGuests < guestLimit : true;

  const handleSave = () => {
    console.log("Clicked Save!");
    if (onGuestsChange) {
      onGuestsChange({ adults, children, pets });
      console.log("Guests changed:", { adults, children, pets });
    }
    setIsOpened(false);
    setIsModalGuestOpen?.(false);
  };

  const handleCancel = () => {
    console.log("Clicked Cancel!");
    setAdults(initialGuests?.adults ?? 1);
    setChildren(initialGuests?.children ?? 0);
    setPets(initialGuests?.pets ?? 0);
    setIsOpened(false);
    setIsModalGuestOpen?.(false);
  };

  return (
    <div className="relative">
      {isDropdown ? (
        // Trường hợp Dropdown
        <div>
          <p className="text-xs font-semibold text-gray-800">Khách</p>
          <div
            className={`w-full bg-transparent outline-none text-gray-800
              ${noBorder ? "" : "border rounded-lg p-2 "} 
            cursor-pointer`}
            onClick={() => setIsOpened(!isOpened)}
          >
            {totalGuests} Khách{totalPets ? `, ${totalPets} thú cưng` : ""}
          </div>
          {isOpened && (
            <div className="absolute">
              <GuestSelector
                adults={adults}
                setAdults={n => canAddGuest || n < adults ? setAdults(n) : null}
                numChildren={children}
                setChildren={n => canAddGuest || n < children ? setChildren(n) : null}
                pets={pets}
                setPets={setPets}
                onSave={handleSave}
                onCancel={handleCancel}
                haveMaxGuests={haveMaxGuests}
                maxGuests={guestLimit}
                totalGuests={totalGuests}
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-semibold">Khách</p>
              <p className="text-gray-700">
                {totalGuests} Khách
                {totalPets ? `, ${totalPets} thú cưng` : ""}
                {guestLimit && (
                  <span className="ml-2 text-xs text-gray-500">(Tối đa {guestLimit})</span>
                )}
              </p>
            </div>
            <button
              className="bg-white text-black px-4 py-2 rounded-lg border cursor-pointer"
              onClick={() => setIsModalGuestOpen(true)}
            >
              Chỉnh sửa
            </button>
          </div>
          {isModalGuestOpen && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
                <GuestSelector
                  adults={adults}
                  setAdults={n => canAddGuest || n < adults ? setAdults(n) : null}
                  numChildren={children}
                  setChildren={n => canAddGuest || n < children ? setChildren(n) : null}
                  pets={pets}
                  setPets={setPets}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  haveMaxGuests={haveMaxGuests}
                  maxGuests={guestLimit}
                  totalGuests={totalGuests}
                />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

BookingGuestPicker.propTypes = {
  isDropdown: PropTypes.bool,
  noBorder: PropTypes.bool,
  setIsDropdown: PropTypes.func,
  initialGuests: PropTypes.object,
  isModalGuestOpen: PropTypes.bool,
  setIsModalGuestOpen: PropTypes.func,
  onGuestsChange: PropTypes.func,
  haveMaxGuests: PropTypes.bool,
  maxGuests: PropTypes.number,
};

export default BookingGuestPicker;
