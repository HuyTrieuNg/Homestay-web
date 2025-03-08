import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";
// import AmenityList from "../components/AmenityList";

function HomestayPage() {
  const { id } = useParams();
  const [homestay, setHomestay] = useState();

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`homestays/${id}`)
        .then((response) => {
          console.log("Homestay data:", response.data);
          setHomestay(response.data);
        })
        .catch((error) => {
          console.error("Error fetching homestay details:", error);
        });
    }
  }, [id]);

  if (!homestay) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{homestay.name}</h1>
      {homestay.images && homestay.images.length > 0 && (
        <img
          src={homestay.images[0]}
          alt={homestay.name}
          style={{ width: "50%", height: "200px", objectFit: "cover" }}
        />
      )}
      <p>{homestay.address}</p>
      {/* Số lượng khác, phòng ngủ, gường, phòng tắm */}
      {/* Host */}
      <p>{homestay.description}</p>
      {/* Hình phòng ngủ */}
      {/* <AmenityList amenities={homestay.amenities} /> */}
      {/* Lịch */}
      {/* Đánh giá */}
      {/* Bản đồ */}
      {/* Host */}
    </div>
  );
}

export default HomestayPage;
