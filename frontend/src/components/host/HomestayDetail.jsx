import { useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";
import { useNavigate } from "react-router-dom";

function HomestayDetail({ id, onDelete }) {
  const [homestay, setHomestay] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    axiosInstance
      .get(`host/homestays/${id}/`)
      .then((response) => {
        setHomestay(response.data);
      })
      .catch((error) => {
        console.error("Error fetching homestays:", error);
      });
  }, [id]);


  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`host/homestays/${id}/`);
      alert("Đã xóa homestay!");
      onDelete(); // Gọi hàm từ `Dashboard` để cập nhật Sidebar và ẩn chi tiết
    } catch (error) {
      console.error("Error deleting homestay:", error);
    }
  };


  if (!homestay) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="flex justify-between items-start p-4 bg-white rounded-md shadow-md">
      <div>
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
                  src={img}
                  alt={homestay.name}
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

  

      <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow">
        Xóa Homestay
      </button>


      <button 
        onClick={() => navigate(`/host/update/${id}`)}
        className="px-4 py-2 bg-yellow-500 text-white rounded-md"
      >Cập nhật</button>
    </div>
  );
}

export default HomestayDetail;
