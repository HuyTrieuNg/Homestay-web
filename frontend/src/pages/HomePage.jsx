import { useState } from "react";
import { useEffect, useCallback } from "react";
import axiosInstance from "@utils/axiosInstance";
import HomestayList from "@components/HomestayList";
import PropertyFilter from "@components/PropertyFilter";
import Header from "../components/Header";

function HomePage() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [totalGuests, setTotalGuests] = useState({
    adults: 1,
    children: 0,
    pets: 0,
  });
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHomestays = useCallback(() => {
    setLoading(true);
    setError(null);

    let url = "homestays/";
    const params = new URLSearchParams();

    if (selectedPropertyType !== null)
      params.append("property_type_id", selectedPropertyType);
    if (selectedAddress) params.append("province", selectedAddress);
    if (totalGuests)
      params.append("max_guest_lte", totalGuests.adults + totalGuests.children);

    if (params.toString()) url += `?${params.toString()}`;

    axiosInstance
      .get(url)
      .then((response) => setHomestays(response.data))
      .catch((error) => {
        console.error("Error fetching homestays:", error);
        setError("Không thể tải danh sách homestay");
      })
      .finally(() => setLoading(false));
  }, [selectedAddress, selectedPropertyType, totalGuests]);

  // Gọi API khi bộ lọc thay đổi
  useEffect(() => {
    fetchHomestays();
  }, [fetchHomestays]);

  return (
    <>
      <Header
        onSelectAddress={setSelectedAddress}
        onGuestsChange={setTotalGuests}
      />
      <PropertyFilter onSelectPropertyType={setSelectedPropertyType} />
      <HomestayList homestays={homestays} loading={loading} error={error} />
    </>
  );
}

export default HomePage;
