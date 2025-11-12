// import React from 'react';
// import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

// // --- Sub-component: RoomItem ---
// function RoomItem({ place, onMapClick }) {
//     const navigate = useNavigate(); // 2. Khởi tạo hook navigate

//     const priceDisplay = place.price || 'N/A';
//     const distance = place.distanceToSchool ? `${place.distanceToSchool}` : 'N/A';
//     const rating = place.averageRating || 'N/A';

//     // 3. Hàm xử lý khi click vào "Xem chi tiết"
//     const handleDetailClick = (e) => {
//         e.stopPropagation(); // Ngăn item cha (li) bị click
//         navigate(`/RoomDetail/${place.id}`); // 4. Chuyển trang
//     };

//     // 5. Hàm xử lý khi click vào item (để pan bản đồ)
//     const handleItemClick = () => {
//         onMapClick(place); // Gọi hàm pan-to-map
//     };

//     return (
//         <li className="room-list-item" onClick={handleItemClick}>
//             <img
//                 src={place.image || 'https://via.placeholder.com/100x80.png?text=No+Image'}
//                 alt={place.name}
//                 className="room-item-image"
//             />
//             <div className="room-item-info">
//                 <h4 className="room-item-name">{place.name}</h4>
//                 <p className="room-item-price">{priceDisplay}</p>
//                 <p className="room-item-address">{place.address}</p>
//                 <div className="room-item-stats">
//                     <span>⭐ {rating}</span>
//                     <span>📍 {distance} km</span>
//                 </div>
//                 {/* 6. Nút "Xem chi tiết" mới */}
//                 <button className="view-detail-btn" onClick={handleDetailClick}>
//                     Xem chi tiết
//                 </button>
//             </div>
//         </li>
//     );
// }

// // --- Component chính: ResultSidebar ---
// export default function ResultSidebar({ places, onMapClick, isOpen, onClose, className }) {

//     // 7. Dùng class 'sidebar' và 'open' để điều khiển
//     return (
//         <div className={`sidebar ${isOpen ? 'open' : ''} ${className || ''}`} id="resultSidebar">
//             {/* 8. Header của Sidebar */}
//             <div className="sidebar-header">
//                 <h2>Kết quả ({places.length})</h2>
//                 <button className="close-btn" onClick={onClose}>
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <line x1="18" y1="6" x2="6" y2="18"></line>
//                         <line x1="6" y1="6" x2="18" y2="18"></line>
//                     </svg>
//                 </button>
//             </div>

//             {/* 9. Content (danh sách) */}
//             <ul className="room-list-content">
//                 {places.length > 0 ? (
//                     places.map((place) => (
//                         <RoomItem key={place.id} place={place} onMapClick={onMapClick} />
//                     ))
//                 ) : (
//                     <p className="no-results-text">Không tìm thấy phòng trọ nào.</p>
//                 )}
//             </ul>
//         </div>
//     );
// }

import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- Sub-component: RoomItem ---
function RoomItem({ place, onMapClick }) {
    // (Code của RoomItem giữ nguyên)
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

// --- Component MỚI: PaginationControls ---
function PaginationControls({ pagination, onPageChange }) {
    // Chỉ hiển thị khi có pagination và nhiều hơn 1 trang
    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    // API Spring Pageable dùng 'page' (0-indexed) và 'totalPages'
    const currentPage = pagination.page; // 0-indexed
    const totalPages = pagination.totalPages;

    return (
        <div className="pagination-controls">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0} // Vô hiệu hóa nếu là trang đầu
            >
                &larr; Trang trước
            </button>

            <span className="pagination-info">
                Trang {currentPage + 1} / {totalPages}
            </span>

            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage + 1 >= totalPages} // Vô hiệu hóa nếu là trang cuối
            >
                Trang sau &rarr;
            </button>
        </div>
    );
}

// --- Component chính: ResultSidebar (CẬP NHẬT) ---
export default function ResultSidebar({ places, onMapClick, isOpen, onClose, pagination, onPageChange }) {

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`} id="resultSidebar">
            <div className="sidebar-header">
                {/* Lấy totalElements từ API nếu có */}
                <h2>Kết quả ({pagination?.totalElements || places.length})</h2>
                <button className="close-btn" onClick={onClose}>
                    {/* (Icon SVG giữ nguyên) */}
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

            {/* Thêm thanh phân trang ở dưới cùng */}
            <PaginationControls pagination={pagination} onPageChange={onPageChange} />
        </div>
    );
}