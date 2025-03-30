import PropTypes from "prop-types";
import SearchBar from "./SearchBar";

const Header = ({ onSelectAddress, onGuestsChange }) => {
  return (
    <div className="flex justify-center shadow-md p-5">
      <SearchBar
        onSelectAddress={onSelectAddress}
        onGuestsChange={onGuestsChange}
      />
    </div>
  );
};

Header.propTypes = {
  onSelectAddress: PropTypes.func,
  onGuestsChange: PropTypes.func,
};

export default Header;
