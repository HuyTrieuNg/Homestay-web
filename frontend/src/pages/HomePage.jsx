import HomestayList from "@components/HomestayList";
import PropertyFilter from "@components/PropertyFilter";
import Header from "../components/Header";

function HomePage() {
  return (
    <>
      <Header />
      <PropertyFilter />
      <HomestayList />
    </>
  );
}

export default HomePage;
