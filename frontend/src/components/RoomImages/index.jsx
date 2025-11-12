import React, { useEffect, useMemo, useState } from 'react';
import { IoChevronBack, IoChevronForward, IoImages } from 'react-icons/io5';

function RoomImage({ images }) {
  const safeImages = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = safeImages.length;
  const clampedIndex = useMemo(() => {
    if (total === 0) return 0;
    if (currentIndex >= total) return 0;
    if (currentIndex < 0) return 0;
    return currentIndex;
  }, [currentIndex, total]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [total]);

  const goToPrevious = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goToNext = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    if (total === 0) return;
    setCurrentIndex(index);
  };

  if (total === 0) {
    return (
      <div className="w-full h-72 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-500">
        Chưa có hình ảnh
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative bg-gray-200 rounded-3xl overflow-hidden mb-4">
        <img
          src={safeImages[clampedIndex]}
          alt={`Room view ${clampedIndex + 1}`}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
          <IoImages className="text-xl" />
          <span className="text-sm">{clampedIndex + 1}/{total}</span>
        </div>

        <button
          onClick={goToPrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-100/60 hover:bg-gray-100/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Previous image"
        >
          <IoChevronBack className="text-2xl" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-100/60 hover:bg-gray-100/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Next image"
        >
          <IoChevronForward className="text-2xl" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {safeImages.map((image, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${
              index === clampedIndex ? 'ring-4 ring-purple-600 scale-95' : 'ring-2 ring-transparent hover:ring-gray-300'
            }`}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            {index === clampedIndex && <div className="absolute inset-0 bg-purple-200/20" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RoomImage;
