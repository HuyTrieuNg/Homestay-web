import React, { useState, useEffect } from "react";
import ImageUploader from "../HomestayForm/ImageUploader";
import axiosInstance from "@utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Images = ({ homestay, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        images: homestay.images || [],
        uploaded_images: [],
        deleted_images: [],
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [mainImage, setMainImage] = useState(homestay.images?.[0]?.image || "");
    const maxThumbnails = 5; // Số ảnh nhỏ hiển thị cố định

    // Lưu trữ danh sách previews cho update
    const [imagePreviews, setImagePreviews] = useState([]);



    // Cập nhật danh sách previews khi có thay đổi
    useEffect(() => {
        const newFilePreviews = [
            ...(formData.images?.map(img => ({
                id: img.id, 
                image: img.image 
            })) || []), // Tránh lỗi nếu images undefined
        
            ...formData.uploaded_images.map(file => ({
                file: file,
                image: URL.createObjectURL(file)
            }))
        ];
        setImagePreviews(newFilePreviews);


        return () => {
            newFilePreviews.forEach(preview => {
              if (preview.image && typeof preview.image === 'string') {
                URL.revokeObjectURL(preview.image);
              }
            });
          };
    }, [formData.uploaded_images, formData.deleted_images, formData.images, homestay.images]);

    // Xử lý thêm ảnh mới
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const totalImageCount = formData.images.length + (formData.uploaded_images?.length || 0) + files.length;
        if (totalImageCount > 20) {
            alert("Maximum 20 images allowed");
            return;
        }

        const timestamp = Date.now();
        const newFiles = files.map((file, index) => {
          Object.defineProperty(file, 'lastModified', {
            writable: true,
            value: timestamp + index
          });
          return file;
        });

        setFormData((prev) => ({
            ...prev,
            uploaded_images: [...prev.uploaded_images, ...newFiles],
        }));

        e.target.value = '';
    };

    // Xóa ảnh (phân biệt ảnh cũ & ảnh mới)
    const handleRemoveImage = (index, id) => {
        if (id) {
            // Xóa ảnh cũ
            setFormData((prev) => {
                let updatedImages = prev.images ? [...prev.images] : [];
                return {
                    ...prev,
                    images: updatedImages.filter((img) => img.id !== id), // Xóa khỏi danh sách previews
                    deleted_images: [...prev.deleted_images, id], // Thêm vào danh sách ảnh cần xóa
                };
            });

        } else {
            // Xóa ảnh mới
            const imageToRemove = imagePreviews[index];
            setFormData((prev) => ({
                ...prev,
                uploaded_images: prev.uploaded_images.filter(
                    (file) => file !== imageToRemove.file
                ), // Xóa ảnh khỏi danh sách uploaded
            }));

            setImagePreviews(prev => prev.filter((_, i) => i !== index));
            // Xóa ảnh khỏi hiển thị 
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const totalImageCount = formData.images.length + (formData.uploaded_images?.length || 0) + files.length;
        if (totalImageCount > 20) {
            alert("Maximum 20 images allowed");
            return;
        }

        const timestamp = Date.now();
        const newFiles = files.map((file, index) => {
          Object.defineProperty(file, 'lastModified', {
            writable: true,
            value: timestamp + index
          });
          return file;
        });

        setFormData((prev) => ({
            ...prev,
            uploaded_images: [...prev.uploaded_images, ...newFiles],
        }));
        };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Gửi cập nhật lên backend
    const handleSubmit = () => {
        if (formData.uploaded_images.length === 0 && formData.deleted_images.length === 0) {
            alert("Không có thay đổi nào");
            return;
        }

        setIsEditing(false);


        const formDataToSend = new FormData();
        formData.uploaded_images.forEach((file) => formDataToSend.append("uploaded_images", file));

        formData.deleted_images.forEach((id) => {
            formDataToSend.append("deleted_images", id); 
        });

        axiosInstance
        .patch(`host/homestays/${homestay.id}/`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
            console.log("Homestay updated:", response.data);
            // Cập nhật lại state với dữ liệu mới từ response
            onUpdate(response.data);
        })
        .catch((error) => {
            console.error("Error updating homestay:", error);
            alert("Không thể cập nhật ảnh. Vui lòng thử lại.");
        })
        .finally(() => {
            // Reset form data và previews
            setImagePreviews([]);
            setFormData({
                images: [response.data.images],
                uploaded_images: [],
                deleted_images: [],
            });
            
        });
    };

// Xử lý ảnh khi ở chế độ xem
    // Xử lý vòng tròn khi thay đổi ảnh chính
    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % homestay.images.length);
        setMainImage(homestay.images[(currentIndex + 1) % homestay.images.length]?.image || "");
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + homestay.images.length) % homestay.images.length);
        setMainImage(homestay.images[(currentIndex - 1 + homestay.images.length) % homestay.images.length]?.image || "");
    };

    // Xử lý danh sách ảnh nhỏ dạng vòng tròn
    const getCircularThumbnails = () => {
        const totalImages = homestay.images.length;
        if (totalImages <= maxThumbnails) return homestay.images;

        let start = currentIndex;
        let thumbnails = [];

        for (let i = 0; i < maxThumbnails; i++) {
            thumbnails.push(homestay.images[(start + i) % totalImages]);
        }

        return thumbnails;
    };


    
    return (
        <div className="p-4 rounded-md shadow-md bg-white relative">
            {isEditing ? (
                <>
                    {/* ImageUploader */}
                    <ImageUploader
                        imagePreviews={imagePreviews}
                        handleFileChange={handleFileChange}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleRemoveImage={handleRemoveImage}
                        maxImages={20}
                    />

                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={handleSubmit}
                        >
                            Lưu
                        </button>
                        <button
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                                setIsEditing(false);
                            }}
                        >
                            Hủy
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {/* Hiển thị ảnh chính */}
                    <h2 className="flex flex-row flex-nowrap items-center mb-3 mt-8">
                        <span className="flex-grow block border-t border-black"></span>
                        <span className="flex-none block mx-4 px-4 py-2.5 text-md rounded leading-none font-medium bg-black text-white">
                        Hình ảnh
                        </span>
                        <span className="flex-grow block border-t border-black"></span>
                    </h2>
                    <div className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden flex items-center justify-center">
                        <img className="w-full h-full object-contain" src={mainImage} alt="Main preview" />
                    </div>

                    {/* Danh sách ảnh nhỏ dạng vòng tròn */}
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button onClick={prevImage} className="bg-gray-300 p-2 rounded-full">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>

                        <div className="flex gap-2">
                            {getCircularThumbnails().map((img, index) => (
                                <div
                                    key={index}
                                    className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                                        img.image === mainImage ? "border-blue-500" : "border-transparent"
                                    }`}
                                    onClick={() => setMainImage(img.image)}
                                >
                                    <img src={img.image} className="w-full h-full object-cover" alt="gallery-image" />
                                </div>
                            ))}
                        </div>

                        <button onClick={nextImage} className="bg-gray-300 p-2 rounded-full">
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>

                    {/* Nút chỉnh sửa */}
                    <button
                        className="absolute top-2 right-2 text-black hover:text-gray-700 p-2 rounded-full"
                        onClick={() => {
                            setIsEditing(true);
                            setFormData({ images: homestay.images, uploaded_images: [], deleted_images: [] });
                            }
                        }
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </>
            )}
        </div>
    );
};

export default Images;
