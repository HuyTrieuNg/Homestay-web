import HomestayList from "../components/HomestayList";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";

function HomePage() {
    return (
        <>
            <SearchBar />
            <CategoryFilter />
            <HomestayList />
        </>
    );
}

export default HomePage;
