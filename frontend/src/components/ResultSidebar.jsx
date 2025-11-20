import React from 'react';
import { useNavigate } from 'react-router-dom';

function RoomItem({ place, onMapClick }) {
    const navigate = useNavigate();
    const priceDisplay = place.price || 'N/A';
    const distance = place.distanceToSchool ? `${place.distanceToSchool}` : 'N/A';
    const rating = place.averageRating || 'N/A';

    const handleDetailClick = (e) => {
        e.stopPropagation();
        navigate(`/RoomDetail/${place.id}`);
    };

    const handleItemClick = () => {
        onMapClick(place);
    };

    return (
        <li className="room-list-item" onClick={handleItemClick}>
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
                    <span>📍 {distance} km</span>
                </div>
                <button className="view-detail-btn" onClick={handleDetailClick}>
                    Xem chi tiết
                </button>
            </div>
        </li>
    );
}

function PaginationControls({ pagination, onPageChange }) {
    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }
    const currentPage = pagination.currentPage || 1;
    const totalPages = pagination.totalPages;

    return (
        <div className="pagination-controls">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &larr; Trang trước
            </button>

            <span className="pagination-info">
                Trang {currentPage} / {totalPages}
            </span>

            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                Trang sau &rarr;
            </button>
        </div>
    );
}

export default function ResultSidebar({ places, onMapClick, isOpen, onClose, pagination, onPageChange }) {

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`} id="resultSidebar">
            <div className="sidebar-header">
                <h2>Kết quả ({pagination?.totalElements || places.length})</h2>
                <button className="close-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <ul className="room-list-content">
                {places.length > 0 ? (
                    places.map((place) => (
                        <RoomItem key={place.id} place={place} onMapClick={onMapClick} />
                    ))
                ) : (
                    <p className="no-results-text">Không tìm thấy phòng trọ nào.</p>
                )}
            </ul>
            <PaginationControls pagination={pagination} onPageChange={onPageChange} />
        </div>
    );
}