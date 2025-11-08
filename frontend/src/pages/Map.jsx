// src/pages/Map.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import MapComponent from "../components/MapComponent";

export default function Map() {
  const [sidebarData, setSidebarData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Khi người dùng bấm marker trên bản đồ → mở Sidebar
  const handleMarkerClick = (data) => {
    setSidebarData(data);
    setSidebarOpen(true);
  };

  // Khi bản đồ bắt đầu tìm kiếm → hiển thị loading
  const handleStartSearch = () => setLoading(true);

  // Khi bản đồ tìm xong → ẩn loading
  const handleEndSearch = () => setLoading(false);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Hiển thị bản đồ */}
      <MapComponent
        onMarkerClick={handleMarkerClick}
        onSearchStart={handleStartSearch}
        onSearchEnd={handleEndSearch}
      />

      {/* Hiển thị sidebar khi click marker */}
      {sidebarOpen && (
        <Sidebar data={sidebarData} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Hiển thị loading khi đang tìm kiếm */}
      {loading && <Loading />}
    </div>
  );
}
