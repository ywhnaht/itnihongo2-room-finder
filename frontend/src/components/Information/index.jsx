import React from 'react';
import { 
  IoClose, IoSchoolOutline, IoWaterOutline, IoWifiOutline,
  IoCarOutline, IoCheckmarkCircle, IoCallOutline, IoHeartOutline, IoArrowBack
} from 'react-icons/io5';
import { MdElectricBolt } from 'react-icons/md';
import { BsCurrencyDollar } from 'react-icons/bs';
import { BiArea } from 'react-icons/bi';

export default function RoomDetailCard({ data }) {
  if (!data) return null; // ✅ guard

  const handleBack = () => window.history.back();
  const handleClose = () => console.log('Đóng modal');
  const handleCall = () => window.location.href = `tel:${data.contactPhone}`;
  const handleReview = () => console.log('Xem đánh giá');
  const handleFavorite = () => console.log('Thêm vào yêu thích');

  const hasParking = Array.isArray(data.amenities)
    ? data.amenities.some(a => a.name === 'Chỗ giữ xe')
    : false;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <IoArrowBack className="w-6 h-6 text-gray-700" />
        </button>
        {/* ❌ data.data.name  →  ✅ data.name */}
        <h1 className="text-2xl font-bold flex-1 text-center">{data.name}</h1>
        <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <IoClose className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Hình ảnh: bạn có thể gắn RoomImageCarousel ở đây nếu muốn */}

      <div className="p-6">
        {/* Địa chỉ */}
        <div className="flex items-start gap-2 mb-6 text-gray-600">
          <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{data.fullAddress}</span>
        </div>

        {/* Thông tin khoảng cách */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <IoSchoolOutline className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Khoảng cách đến trường</h3>
              <p className="text-gray-600">{data.distanceToSchool} km</p>
            </div>
          </div>
        </div>

        {/* Thông tin phòng */}
        <h2 className="text-xl font-bold mb-4">Thông tin phòng trọ</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <BsCurrencyDollar className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Giá phòng</p>
              <p className="font-semibold text-gray-800">
                {Number(data.price).toLocaleString()} đ/tháng
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BiArea className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Diện tích</p>
              <p className="font-semibold text-gray-800">{data.area} m²</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MdElectricBolt className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Tiền điện</p>
              <p className="font-semibold text-gray-800">{data.electricityPrice} đ/kWh</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IoWaterOutline className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Tiền nước</p>
              <p className="font-semibold text-gray-800">{data.waterPrice} đ/m³</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IoWifiOutline className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Internet</p>
              <p className="font-semibold text-gray-800">
                {data.wifiPrice === 0 ? 'Miễn phí' : `${data.wifiPrice} đ/tháng`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IoCarOutline className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Giữ xe</p>
              <p className="font-semibold text-gray-800">{hasParking ? 'Có' : 'Không'}</p>
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Mô tả</h3>
          <p className="text-gray-600">{data.description}</p>
        </div>

        {/* Tiện ích */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Tiện ích</h3>
          <div className="flex flex-wrap gap-3">
            {(data.amenities || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-gray-700">
                <IoCheckmarkCircle className="w-5 h-5 text-green-500" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Đánh giá */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-700">
            <span className="font-semibold text-yellow-500">{data.averageRating}</span> ★ 
            ({data.ratingCount} đánh giá)
          </p>
          <button onClick={handleFavorite} className="p-2 rounded-full hover:bg-gray-100">
            <IoHeartOutline className="w-6 h-6 text-red-500" />
          </button>
        </div>

        {/* Nút hành động */}
        <div className="space-y-3">
          <button 
            onClick={handleCall}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Liên hệ: {data.contactName} ({data.contactPhone})
          </button>

          <button 
            onClick={handleReview}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Xem đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}
