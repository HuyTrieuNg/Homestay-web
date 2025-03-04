const SearchBar = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <input type="text" placeholder="Where" />
      <input type="text" placeholder="Check in" />
      <input type="text" placeholder="Check out" />
      <input type="text" placeholder="Who" />
      <button>Search</button>
    </div>
  );
};

export default SearchBar;
