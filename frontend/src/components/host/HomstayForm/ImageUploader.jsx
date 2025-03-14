import React from "react";

const ImageUploader = ({
  imagePreviews,
  handleFileChange,
  handleDrop,
  handleDragOver,
  handleRemoveImage,
}) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">
        Hình ảnh (tối đa 15 ảnh):
      </label>
      <input
        type="file"
        name="images"
        multiple
        onChange={handleFileChange}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200"
      />
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-md text-center text-gray-600 cursor-pointer hover:border-blue-500 transition"
      >
        Kéo thả ảnh vào đây
      </div>
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-24 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
