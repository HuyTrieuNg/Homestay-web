const CategoryFilter = () => {
    const categories = [
        "Amazing pools",
        "Icons",
        "Countryside",
        "Tiny homes",
        "Earth homes",
        "Treehouses",
        "Rooms",
        "Amazing views",
        "Mansions",
        "Trending",
    ];
    return (
        <div>
            {categories.map((category, index) => (
                <button key={index}>{category}</button>
            ))}
        </div>
    );
};

export default CategoryFilter;
