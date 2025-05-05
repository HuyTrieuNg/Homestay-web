import React, { useEffect, useRef } from 'react';


const AddressSelector = ({
  provinces,
  districts,
  communes,
  selectedProvince,
  selectedDistrict,
  selectedCommune,
  handleProvinceChange,
  handleDistrictChange,
  handleCommuneChange,
  isLoading,
  formData,
  handleAddressChange
}) => {


  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Dynamically load Leaflet CSS
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    // Dynamically load Leaflet JS
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
    leafletScript.async = true;

    // Hàm để khởi tạo bản đồ
    const initializeMap = (L, lat, lng) => {
      
      const map = L.map(mapRef.current).setView([lat, lng], 20);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Thêm marker tại vị trí ban đầu
      markerRef.current = L.marker([lat, lng]).addTo(map).bindPopup(`Vĩ độ ${lat}, Kinh độ ${lng}`).openPopup();

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        markerRef.current = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`Vị trí đã chọn: Vĩ độ ${lat}, Kinh độ ${lng}`)
          .openPopup();

        handleAddressChange({
          target: {
            name: 'latitude',
            value: lat.toFixed(6),
          },
        });

        handleAddressChange({
          target: {
            name: 'longitude',
            value: lng.toFixed(6),
          },
        });
      });
    };

    leafletScript.onload = () => {
      const L = window.L;

      // Xác định vị trí bắt đầu (vị trí từ formData, trình duyệt, hoặc mặc định)
      let initialLat = formData.latitude ? parseFloat(formData.latitude) : null;
      let initialLng = formData.longitude ? parseFloat(formData.longitude) : null;

      // Nếu không có vị trí từ formData, lấy từ trình duyệt
      if (!initialLat || !initialLng) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initialLat = position.coords.latitude;
            initialLng = position.coords.longitude;

            // Sau khi lấy được tọa độ, khởi tạo bản đồ
            initializeMap(L, initialLat, initialLng);
            handleAddressChange({
              target: {
                name: 'latitude',
                value: initialLat.toFixed(6),
              },
            });
    
            handleAddressChange({
              target: {
                name: 'longitude',
                value: initialLng.toFixed(6),
              },
            });
            
          },
          () => {
            // Nếu không thể lấy vị trí từ trình duyệt, dùng vị trí mặc định
            initializeMap(L, 16.0703, 108.2227);
            handleAddressChange({
              target: {
                name: 'latitude',
                value: 16.0703,
              },
            });
            handleAddressChange({
              target: {
                name: 'longitude',
                value: 108.2227,
              },
            });
          }
        );
        

      } else {
        // Nếu có tọa độ trong formData, khởi tạo bản đồ ngay lập tức
        initializeMap(L, initialLat, initialLng);
      }
    };

    document.body.appendChild(leafletScript);

    // Cleanup
    return () => {
      document.head.removeChild(leafletCSS);
      document.body.removeChild(leafletScript);
    };
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Địa chỉ</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tỉnh/Thành phố */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tỉnh/Thành phố
          </label>
          <select
            name="province"
            value={selectedProvince}
            onChange={handleProvinceChange}
            disabled={isLoading}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quận/Huyện */}
        <div>
          <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
          <select
            name="district"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={!selectedProvince || isLoading}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        {/* Phường/Xã */}
        <div>
          <label className="block text-sm font-medium mb-1">Phường/Xã</label>
          <select
            name="commune"
            value={selectedCommune}
            onChange={handleCommuneChange}
            disabled={!selectedDistrict || isLoading}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Chọn phường/xã</option>
            {communes.map((commune) => (
              <option key={commune.id} value={commune.id}>
                {commune.name}
              </option>
            ))}
          </select>
          {isLoading && (
            <p className="text-sm text-blue-600 mt-1">Đang tải dữ liệu địa chỉ...</p>
          )}
        </div>
      </div>

      {/* Địa chỉ chi tiết */}
      <div>
        <label className="block text-sm font-medium mb-1">Địa chỉ chi tiết</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleAddressChange}
          className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          placeholder="Nhập địa chỉ chi tiết"
          required
        />
      </div>

      {/* Kinh độ & Vĩ độ */}

      <div
        ref={mapRef}
        style={{
          position: 'relative',
          height: '500px',
          border: '1px solid #ccc',
          borderRadius: '10px',
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default AddressSelector;

