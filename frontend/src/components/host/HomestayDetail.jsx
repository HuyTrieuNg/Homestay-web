import { useEffect, useState } from "react";
import useAxios from "../../utils/useAxios";

function HomestayDetail({ id }) {
  const axiosInstance = useAxios();
  const [homestay, setHomestay] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axiosInstance
      .get(`host/homestays/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHomestay(res.data))
      .catch((err) => console.error("Error fetching homestay detail:", err));
  }, [axiosInstance, id]);

  if (!homestay) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4">{homestay.name}</h1>
      <p>
        <strong>Description:</strong> {homestay.description}
      </p>
      <p>
        <strong>Type:</strong> {homestay.type}
      </p>
      <p>
        <strong>Base Price:</strong> {homestay.base_price}
      </p>
      <p>
        <strong>Address:</strong> {homestay.address}
      </p>
      <p>
        <strong>Coordinates:</strong> {homestay.longitude}, {homestay.latitude}
      </p>
      <p>
        <strong>Max Guests:</strong> {homestay.max_guests}
      </p>
      <p>
        <strong>Commune:</strong> {homestay.commune}
      </p>
      <p>
        <strong>District:</strong> {homestay.district}
      </p>
      <p>
        <strong>Province:</strong> {homestay.province}
      </p>

      {homestay.images && homestay.images.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3">Images</h2>
          <div className="grid grid-cols-3 gap-4">
            {homestay.images.map((img) => (
              <img
                key={img.id}
                src={img.image}
                alt="Homestay"
                className="w-full h-40 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      )}

      {homestay.amenity_details && homestay.amenity_details.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3">Amenities</h2>
          <ul className="list-disc pl-5">
            {homestay.amenity_details.map((amenity) => (
              <li key={amenity.id}>{amenity.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HomestayDetail;
