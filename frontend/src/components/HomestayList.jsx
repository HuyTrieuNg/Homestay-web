import { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import HomestayCard from "./HomestayCard";

const HomestayList = () => {
  const axiosInstance = useAxios();
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
  }, [axiosInstance]);

  return (
    <div>
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
