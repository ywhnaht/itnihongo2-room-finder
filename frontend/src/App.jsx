import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import Loading from './components/Loading';

export default function App() {
  const [placesData, setPlacesData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [status, setStatus] = useState('Đang tải dữ liệu...');
  const [loading, setLoading] = useState(false);

  const openSidebar = index => {
    setSelectedIndex(index);
  };

  const closeSidebar = () => setSelectedIndex(null);

  return (
    <>
      <div id="mapOverlay" className={selectedIndex !== null ? 'with-sidebar map-overlay' : 'map-overlay'}>
        <h2>🏠 Tìm phòng trọ Đà Nẵng</h2>
        <p id="status">{status}</p>
      </div>

      <div className={selectedIndex !== null ? 'search-box with-sidebar' : 'search-box'} id="searchBox">
        <input id="searchInput" defaultValue="Phòng Trọ" />
        <button className="search-btn" onClick={() => {
          const q = document.getElementById('searchInput').value.trim() || 'Phòng Trọ';
          if (window.__SEARCH_NEARBY__) window.__SEARCH_NEARBY__(q);
        }}>🔍 Tìm kiếm</button>

      </div>

      <MapComponent
        placesData={placesData}
        setPlacesData={setPlacesData}
        openSidebar={openSidebar}
        setStatus={setStatus}
        setLoading={setLoading}
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
