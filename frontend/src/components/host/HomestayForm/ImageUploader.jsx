import React from "react";

const ImageUploader = ({
  imagePreviews,
  handleFileChange,
  handleDrop,
  handleDragOver,
  handleRemoveImage,
  maxImages,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Hình ảnh</h3>
      
      {/* Khu vực Drag & Drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => document.getElementById("file-upload").click()}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="text-lg font-medium text-gray-700">
            Kéo thả hoặc nhấn vào đây để tải ảnh lên
          </p>
          <p className="text-sm text-gray-500">
            (Tối đa {maxImages} ảnh, định dạng: PNG, JPG, JPEG, WEBP)
          </p>
        </div>
      </div>

      {/* Lưới xem trước ảnh */}
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden h-32 bg-gray-100 border"
            >
              <img
                src={preview.image || preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index, preview.id)}
                className="absolute -top-0 -right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md opacity-80 hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;



// import React from "react";

// const ImageUploader = ({
//   imagePreviews,
//   handleFileChange,
//   handleDrop,
//   handleDragOver,
//   handleRemoveImage,
// }) => {
//   return (
//     <div className="space-y-4">
//       <h3 className="text-lg font-medium">Hình ảnh</h3>
      
//       {/* Drag & Drop area */}
//       <div
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
//         onClick={() => document.getElementById("file-upload").click()}
//       >
//         <input
//           id="file-upload"
//           type="file"
//           multiple
//           accept="image/png, image/jpeg, image/jpg, image/webp"
//           onChange={handleFileChange}
//           className="hidden"
//         />
//         <div className="flex flex-col items-center justify-center space-y-2">
//           <svg
//             className="w-12 h-12 text-gray-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//             ></path>
//           </svg>
//           <p className="text-lg font-medium text-gray-700">
//             Kéo thả hoặc nhấn vào đây để tải ảnh lên
//           </p>
//           <p className="text-sm text-gray-500">
//             (Tối đa 20 ảnh, định dạng: PNG, JPG, JPEG, WEBP)
//           </p>
//         </div>
//       </div>

//       {/* Image Preview grid */}
//       {imagePreviews.length > 0 && (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//           {imagePreviews.map((preview, index) => (
//             <div
//               key={index}
//               className="relative rounded-lg overflow-hidden h-32 bg-gray-100 border"
//             >
//               <img
//                 src={preview.url || preview}
//                 alt={`Preview ${index + 1}`}
//                 className="w-full h-full object-cover"
//               />
//               <button
//                 type="button"
//                 onClick={() => handleRemoveImage(index, preview.id)}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md opacity-80 hover:opacity-100"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;