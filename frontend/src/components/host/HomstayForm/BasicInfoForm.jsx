import React from "react";

const BasicInfoForm = ({ formData, handleChange, types }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium">Tên Homestay:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Mô tả:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        ></textarea>
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Loại Homestay:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Chọn loại</option>
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium">Kinh độ:</label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Vĩ độ:</label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium">Giá cơ bản:</label>
          <input
            type="number"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Số khách tối đa:</label>
          <input
            type="number"
            name="max_guests"
            value={formData.max_guests}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Địa chỉ:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
