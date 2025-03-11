import { useEffect, useState } from "react";
import HomestayCard from "@components/HomestayCard";
import axiosInstance from "@utils/axiosInstance";

const HomestayList = () => {
  const [homestays, setHomestays] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("homestays")
      .then((response) => {
        setHomestays(response.data);
      })
      .catch((error) => {
        console.error("Error fetching homestays:", error);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5 px-10">
      {homestays.length > 0 ? (
        homestays.map((homestay) => (
          <HomestayCard key={homestay.id} homestay={homestay} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HomestayList;
