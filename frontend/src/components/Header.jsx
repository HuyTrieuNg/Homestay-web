import PropTypes from "prop-types";
import SearchBar from "./SearchBar";

const Header = ({ onSelectAddress }) => {
  return (
    <div className="flex justify-center shadow-md p-5">
      <SearchBar onSelectAddress={onSelectAddress} />
    </div>
  );
};

Header.propTypes = {
  onSelectAddress: PropTypes.func.isRequired,
};

export default Header;
