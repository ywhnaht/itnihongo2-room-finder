import React, { useState, useRef } from 'react'; // Thêm useRef
import MapComponent from './components/MapComponent';
import Sidebar from './components/SideBar';
import Loading from './components/Loading';
import RoomList from './components/RoomList'; // 1. Import component mới

export default function App() {
  const [placesData, setPlacesData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [status, setStatus] = useState('Đang tải dữ liệu...');
  const [loading, setLoading] = useState(false);

  // 2. Tạo ref để giữ map instance
  const mapInstanceRef = useRef(null);

  const openSidebar = index => {
    setSelectedIndex(index);
  };

  const closeSidebar = () => setSelectedIndex(null);

  // 3. Hàm xử lý khi click vào item trong RoomList
  const handleRoomItemClick = (room) => {
    // Kiểm tra xem map đã tải và room có tọa độ chưa
    if (!mapInstanceRef.current || !room.lng || !room.lat) return;

    // Di chuyển (flyTo) bản đồ đến vị trí của phòng trọ
    mapInstanceRef.current.flyTo({
      center: [room.lng, room.lat],
      zoom: 17, // Zoom gần hơn một chút
      pitch: 45,
      duration: 1500 // Thời gian di chuyển
    });

    // Bonus: Tự động mở Sidebar chi tiết cho phòng đó
    // Cần tìm index của phòng này trong `placesData`
    const roomIndex = placesData.findIndex(p => p.id === room.id);
    if (roomIndex > -1) {
      openSidebar(roomIndex);
    }
  };

  return (
    <>
      <div id="mapOverlay" className={selectedIndex !== null ? 'with-sidebar map-overlay' : 'map-overlay'}>
        <h2>🏠 Tìm phòng trọ Đà Nẵng</h2>
        <p id="status">{status}</p>
      </div>

      <div className={selectedIndex !== null ? 'search-box with-sidebar' : 'search-box'} id="searchBox">
        {/* ... (input và button tìm kiếm giữ nguyên) ... */}
      </div>

      {/* 4. Thêm RoomList vào layout */}
      <RoomList
        places={placesData}
        onItemClick={handleRoomItemClick}
        className={selectedIndex !== null ? 'with-sidebar' : ''}
      />

      <MapComponent
        placesData={placesData}
        setPlacesData={setPlacesData}
        openSidebar={openSidebar}
        setStatus={setStatus}
        setLoading={setLoading}
        // 5. Truyền callback onMapLoad
        onMapLoad={(map) => { mapInstanceRef.current = map; }}
      />

      <Sidebar
        isOpen={selectedIndex !== null}
        place={selectedIndex !== null ? placesData[selectedIndex] : null}
        onClose={closeSidebar}
      />

      {loading && <Loading />}
    </>
  );
}