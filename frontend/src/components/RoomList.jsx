import React from 'react';

// Component cho một item trong danh sách
function RoomItem({ place, onClick }) {
    // Định dạng giá tiền (ví dụ: 1500000 -> 1.500.000 đ)
    // Lưu ý: Dữ liệu "price" từ API của bạn là số, nhưng mock data trong MapComponent là string.
    // Chúng ta sẽ xử lý price như một string đã được định dạng.
    const priceDisplay = place.price || 'N/A';

    // Sử dụng các trường dữ liệu bạn đã cung cấp
    const distance = place.distanceToSchool ? `${place.distanceToSchool} km` : 'N/A';
    const rating = place.averageRating || 'N/A';

    return (
        <li className="room-list-item" onClick={() => onClick(place)}>
            <img
                src={place.image || 'https://via.placeholder.com/100x80.png?text=No+Image'}
                alt={place.name}
                className="room-item-image"
            />
            <div className="room-item-info">
                <h4 className="room-item-name">{place.name}</h4>
                <p className="room-item-price">{priceDisplay}</p>
                <p className="room-item-address">{place.address}</p>
                <div className="room-item-stats">
                    <span>⭐ {rating}</span>
                    <span>📍 {distance}</span>
                </div>
            </div>
        </li>
    );
}

// Component chính cho danh sách
export default function RoomList({ places, onItemClick, className }) {
    if (!places || places.length === 0) {
        return null; // Không hiển thị gì nếu chưa có dữ liệu
    }

    return (
        <div className={`room-list ${className || ''}`} id="roomList">
            <div className="room-list-header">
                <h3>Phòng trọ xung quanh ({places.length})</h3>
            </div>
            <ul className="room-list-content">
                {places.map((place) => (
                    <RoomItem key={place.id} place={place} onClick={onItemClick} />
                ))}
            </ul>
        </div>
    );
}