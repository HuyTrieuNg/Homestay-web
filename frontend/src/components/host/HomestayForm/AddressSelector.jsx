import React from "react";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Kinh độ</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleAddressChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="Nhập kinh độ"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vĩ độ</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleAddressChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="Nhập vĩ độ"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AddressSelector;
