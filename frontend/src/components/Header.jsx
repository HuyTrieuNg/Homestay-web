import PropTypes from "prop-types";
import SearchBar from "./SearchBar";
import Navbar from "./NavBar";

const Header = () => {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center border-b-2 px-5 pb-6">
        <SearchBar />
      </div>
    </div>
  );
};

Header.propTypes = {
  onSelectAddress: PropTypes.func,
  onGuestsChange: PropTypes.func,
  onSearch: PropTypes.func.isRequired,
};

export default Header;
