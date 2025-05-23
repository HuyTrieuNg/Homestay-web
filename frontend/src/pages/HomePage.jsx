// import { useState } from "react";
// import { useEffect, useCallback } from "react";
// import axiosInstance from "@utils/axiosInstance";
// import HomestayList from "@components/HomestayList";
// import PropertyFilter from "@components/PropertyFilter";
// import Header from "../components/Header";

// function HomePage() {
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [selectedPropertyType, setSelectedPropertyType] = useState(null);
//   const [totalGuests, setTotalGuests] = useState({
//     adults: 1,
//     children: 0,
//     pets: 0,
//   });
//   const [homestays, setHomestays] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchHomestays = useCallback(() => {
//     setLoading(true);
//     setError(null);

//     let url = "homestays/";
//     const params = new URLSearchParams();

//     if (selectedPropertyType !== null)
//       params.append("property_type_id", selectedPropertyType);
//     if (selectedAddress) params.append("province", selectedAddress);
//     if (totalGuests)
//       params.append("max_guest_lte", totalGuests.adults + totalGuests.children);

//     if (params.toString()) url += `?${params.toString()}`;

//     axiosInstance
//       .get(url)
//       .then((response) => setHomestays(response.data))
//       .catch((error) => {
//         console.error("Error fetching homestays:", error);
//         setError("Không thể tải danh sách homestay");
//       })
//       .finally(() => setLoading(false));
//   }, [selectedAddress, selectedPropertyType, totalGuests]);

//   // Gọi API khi bộ lọc thay đổi
//   useEffect(() => {
//     fetchHomestays();
//   }, [fetchHomestays]);

//   return (
//     <>
//       <Header
//         onSelectAddress={setSelectedAddress}
//         onGuestsChange={setTotalGuests}
//       />
//       <PropertyFilter onSelectPropertyType={setSelectedPropertyType} />
//       <HomestayList homestays={homestays} loading={loading} error={error} />
//     </>
//   );
// }

// export default HomePage;



import { useState, useEffect, useCallback } from "react";
import React from "react";
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
  const [page, setPage] = useState(1); // Thêm state cho trang hiện tại
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null
  });

  // Tính tổng số trang dựa trên count và page_size (mặc định là 12)
  const totalPages = Math.ceil(pagination.count / 12);

  const fetchHomestays = useCallback(() => {
    setLoading(true);
    setError(null);

    let url = "homestays/";
    const params = new URLSearchParams();

    // Thêm tham số page
    params.append("page", page);
    params.append("page_size", 12); // Số lượng homestay mỗi trang

    if (selectedPropertyType !== null)
      params.append("property_type_id", selectedPropertyType);
    if (selectedAddress) params.append("province", selectedAddress);
    if (totalGuests)
      params.append("max_guest_lte", totalGuests.adults + totalGuests.children);

    if (params.toString()) url += `?${params.toString()}`;

    axiosInstance
      .get(url)
      .then((response) => {
        if (response.data.results) {
          setHomestays(response.data.results);
          setPagination({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous
          });
        } else {
          // Nếu backend chưa hỗ trợ phân trang, sử dụng dữ liệu như cũ
          setHomestays(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching homestays:", error);
        setError("Không thể tải danh sách homestay");
      })
      .finally(() => setLoading(false));
  }, [selectedAddress, selectedPropertyType, totalGuests, page]);

  // Gọi API khi bộ lọc thay đổi hoặc trang thay đổi
  useEffect(() => {
    fetchHomestays();
    // Scroll về đầu trang khi chuyển trang
    window.scrollTo(0, 0);
  }, [fetchHomestays]);

  // Reset về trang 1 khi thay đổi bộ lọc
  useEffect(() => {
    setPage(1);
  }, [selectedAddress, selectedPropertyType, totalGuests]);

  return (
    <>
      <Header
        onSelectAddress={setSelectedAddress}
        onGuestsChange={setTotalGuests}
      />
      <PropertyFilter onSelectPropertyType={setSelectedPropertyType} />
      <HomestayList homestays={homestays} loading={loading} error={error} />
      
      {/* Phân trang - Sử dụng trực tiếp không cần component riêng */}
      {!loading && !error && pagination.count > 0 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!pagination.previous}
            className={`px-3 py-1 rounded ${
              !pagination.previous
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#ff5a5f] hover:bg-[#e14c4f] text-white"
            }`}
          >
            ←
          </button>
          
          {/* Hiển thị các trang */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => 
                p === 1 || 
                p === totalPages || 
                (p >= page - 1 && p <= page + 1)
              )
              .map((p, i, arr) => {
                // Thêm dấu ... nếu có khoảng cách giữa các số
                if (i > 0 && arr[i] - arr[i-1] > 1) {
                  return (
                    <React.Fragment key={`ellipsis-${p}`}>
                      <span className="px-3 py-1 text-gray-500">...</span>
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 rounded ${
                          page === p
                            ? "bg-[#ff5a5f] text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                }
                
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded ${
                      page === p
                        ? "bg-[#ff5a5f] text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
          </div>
          
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.next}
            className={`px-3 py-1 rounded ${
              !pagination.next
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#ff5a5f] hover:bg-[#e14c4f] text-white"
            }`}
          >
            →
          </button>
        </div>
      )}
    </>
  );
}

export default HomePage;