import React from 'react';
import { useNavigate } from 'react-router-dom';

function RoomCard({ room }) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/RoomDetail/${room.id}`);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', ' VNĐ');
    };

    const renderRating = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="text-yellow-400">★</span>
                ))}
                {hasHalfStar && <span className="text-yellow-400">½</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="text-gray-300">★</span>
                ))}
            </div>
        );
    };

    return (
        <div
            className="flex flex-col md:flex-row border border-gray-200 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white"
        >
            <div className="relative md:w-2/5 w-full flex-shrink-0" style={{ height: '250px' }}>
                <img
                    src={room.thumbnail_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                    alt={room.name}
                    className="w-full h-full object-cover"
                />

                {room.isHot && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        🔥 HOT
                    </div>
                )}
            </div>

            <div className="md:w-3/5 p-5 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {room.name}
                    </h2>

                    <div className="flex items-baseline mb-3">
                        <p className="text-3xl font-bold text-green-600">
                            {formatPrice(room.price)}
                        </p>
                        <span className="text-sm text-gray-500 ml-2">/tháng</span>
                    </div>

                    <div className="flex items-center gap-2 pb-3 border-b border-gray-200 mb-3">
                        {renderRating(room.average_rating)}
                        <span className="text-sm font-semibold text-gray-700 ml-1">
                            {room.average_rating.toFixed(1)}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                            {room.rating_count} đánh giá
                        </span>
                    </div>

                    <div className="flex items-start mb-3">
                        <span className="text-red-500 mr-2">📍</span>
                        <span className="text-sm text-gray-600 flex-1">
                            {room.full_address}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {room.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {room.amenities.slice(0, 4).map((amenity) => (
                            <span
                                key={amenity.id}
                                className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100"
                            >
                                {amenity.icon_class} {amenity.name}
                            </span>
                        ))}
                        {room.amenities.length > 4 && (
                            <span className="text-xs text-gray-500 px-3 py-1">
                                +{room.amenities.length - 4} khác
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        handleNavigate();
                    }}
                    className="cursor-pointer self-start bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
                >Xem Chi Tiết →
                </button>
            </div>
        </div>
    );
}

export default RoomCard;