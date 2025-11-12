import React, { useState, useRef } from 'react';
import MapComponent from '../components/MapComponent';
// import Sidebar from '../components/Sidebar'; // 1. Xóa Sidebar chi tiết
import Loading from '../components/Loading';
import ResultSidebar from '../components/ResultSidebar'; // 2. Import ResultSidebar
import SearchBar from '../components/SearchBar';

export default function Map() {
  // --- State và Ref ---
  const [placesData, setPlacesData] = useState([]);
  const [isResultSidebarOpen, setIsResultSidebarOpen] = useState(false); // 3. State mới
  const [status, setStatus] = useState('Tìm kiếm phòng trọ tại Đà Nẵng...');
  const [loading, setLoading] = useState(false);
  const mapInstanceRef = useRef(null);

  // --- Các hàm xử lý giao diện ---

  // Xử lý khi click vào 1 item trong ResultSidebar (để pan bản đồ)
  const handleRoomItemClick = (room) => {
    if (!mapInstanceRef.current || !room.lng || !room.lat) return;

    mapInstanceRef.current.flyTo({
      center: [room.lng, room.lat],
      zoom: 17,
      pitch: 45,
      duration: 1500
    });
    // Không cần mở sidebar chi tiết ở đây nữa
  };

  // 4. Hàm xử lý khi click marker trên bản đồ
  const handleMarkerClick = (index) => {
    // Khi click marker, ta cũng chỉ cần pan bản đồ và đảm bảo sidebar kết quả đang mở
    setIsResultSidebarOpen(true);
    const place = placesData[index];
    if (mapInstanceRef.current && place) {
      mapInstanceRef.current.flyTo({
        center: [place.lng, place.lat],
        zoom: 17,
        pitch: 45,
        duration: 1500
      });
    }
  };

  // --- Hàm gọi API chính (từ SearchBar) ---
  const fetchRentalData = async (filters) => {
    if (!filters) return;

    setLoading(true);
    setPlacesData([]);
    setStatus('📡 Đang tìm kiếm theo bộ lọc...');

    // 5. Kiểm tra và sửa lại tham số API cho đúng
    const params = new URLSearchParams();
    if (filters.keyword) params.append('search', filters.keyword);
    if (filters.rating) params.append('minRating', filters.rating);
    if (filters.distance) params.append('maxDistance', filters.distance);
    if (filters.price) {
      if (filters.price.includes('-')) {
        const [min, max] = filters.price.split('-');
        params.append('minPrice', min);
        params.append('maxPrice', max);
      } else {
        params.append('minPrice', filters.price);
      }
    }

    const API_URL = `https://itnihongo2-room-finder-production.up.railway.app/api/v1/rentals/search?${params.toString()}`;

    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      const apiData = json?.data?.data;
      if (!apiData || !Array.isArray(apiData)) throw new Error('Không có dữ liệu hợp lệ');

      const newPlaces = apiData.map((item, i) => {
        let coords = [];
        try {
          coords = JSON.parse(item.locationGeoJson).coordinates;
        } catch { return null; }

        if (!coords || coords.length < 2) return null;
        const [lng, lat] = coords;

        return {
          id: item.id,
          name: item.name || `Phòng trọ #${i + 1}`,
          address: item.fullAddress || 'Chưa có địa chỉ',
          lat,
          lng,
          price: item.price ? item.price.toLocaleString('vi-VN') + ' đ' : 'N/A',
          distanceToSchool: item.distanceToSchool ? item.distanceToSchool.toFixed(1) : 'N/A',
          averageRating: item.averageRating ? item.averageRating.toFixed(1) : 'N/A',
          image: item.thumbNailUrl || 'https://via.placeholder.com/100x80.png?text=No+Image',
          // ... (thêm các trường khác nếu ResultSidebar cần)
        };
      }).filter(Boolean);

      setPlacesData(newPlaces);
      setStatus(`✅ Tìm thấy ${newPlaces.length} phòng trọ`);
      setIsResultSidebarOpen(true); // 6. Mở Sidebar kết quả khi tìm xong

    } catch (err) {
      console.error(err);
      setStatus('⚠️ Lỗi tải dữ liệu. Vui lòng thử lại.');
      setIsResultSidebarOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // --- Render JSX ---
  return (
    <>
      {/* Thanh tìm kiếm */}
      <SearchBar
        onSearch={fetchRentalData}
        className={isResultSidebarOpen ? 'with-sidebar' : ''}
      />

      {/* Overlay tiêu đề/trạng thái */}
      <div id="mapOverlay" className={isResultSidebarOpen ? 'with-sidebar map-overlay' : 'map-overlay'}>
        <h2>🏠 Tìm phòng trọ Đà Nẵng</h2>
        <p id="status">{status}</p>
      </div>

      {/* 7. Dùng ResultSidebar (thay vì RoomList và Sidebar cũ) */}
      <ResultSidebar
        places={placesData}
        onMapClick={handleRoomItemClick} // Click item để pan bản đồ
        isOpen={isResultSidebarOpen}
        onClose={() => setIsResultSidebarOpen(false)}
      />

      {/* Component bản đồ */}
      <MapComponent
        placesData={placesData}
        openSidebar={handleMarkerClick} // Click marker
        onMapLoad={(map) => { mapInstanceRef.current = map; }}
      />

      {/* Loading spinner */}
      {loading && <Loading />}
    </>
  );
}