import React from "react";

const AddressSelector = ({
  provinces,
  districts,
  communes,
  selectedProvince,
  selectedDistrict,
  handleProvinceChange,
  handleDistrictChange,
  handleCommuneChange,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-gray-700 font-medium">Tỉnh:</label>
        <select
          value={selectedProvince}
          onChange={handleProvinceChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        >
          <option value="">Chọn tỉnh</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Huyện:</label>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          disabled={!selectedProvince}
        >
          <option value="">Chọn huyện</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Xã:</label>
        <select
          name="commune"
          value={""}
          onChange={handleCommuneChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          disabled={!selectedDistrict}
        >
          <option value="">Chọn xã</option>
          {communes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddressSelector;
