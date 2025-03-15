import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import HomestayCard from "@components/HomestayCard";
import axiosInstance from "@utils/axiosInstance";

const HomestayList = ({ province, propertyTypeId }) => {
  const [homestays, setHomestays] = useState([]);

  useEffect(() => {
    let url = "homestays/";
    if (propertyTypeId) {
      url += `?property_type_id=${propertyTypeId}`;
      console.log("Fetching homestays with property type:", propertyTypeId);
    }
    if (province) {
      url += `?province=${encodeURIComponent(province)}`;
      console.log("Fetching homestays in province:", province);
    }

    axiosInstance
      .get(url)
      .then((response) => {
        setHomestays(response.data);
      })
      .catch((error) => {
        console.error("Error fetching homestays:", error);
      });
  }, [province, propertyTypeId]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5 px-10">
      {homestays.length > 0 ? (
        homestays.map((homestay) => (
          <HomestayCard key={homestay.id} homestay={homestay} />
        ))
      ) : (
        <p>Không tìm thấy kết quả</p>
      )}
    </div>
  );
};

// ✅ Prop validation
HomestayList.propTypes = {
  province: PropTypes.string,
  propertyTypeId: PropTypes.number,
};

export default HomestayList;
