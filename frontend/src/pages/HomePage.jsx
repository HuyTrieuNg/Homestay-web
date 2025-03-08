import HomestayList from "@components/HomestayList";
import PropertyFilter from "@components/PropertyFilter";
import SearchBar from "@components/SearchBar";

function HomePage() {
  return (
    <>
      <SearchBar />
      <PropertyFilter />
      <HomestayList />
    </>
  );
}

export default HomePage;
