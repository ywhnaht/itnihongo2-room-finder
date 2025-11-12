import React, { useEffect, useRef } from 'react';

// 1. Xóa props: setPlacesData, setStatus, setLoading
export default function MapComponent({ placesData, openSidebar, onMapLoad }) {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const center = [108.15009, 16.07446];
    const accessToken = import.meta.env.VITE_GOONG_ACCESS_TOKEN;

    // 2. useEffect chính (chạy 1 lần) chỉ để khởi tạo bản đồ
    useEffect(() => {
        if (!window.goongjs) {
            console.error('goongjs not found');
            return;
        }
        const goongjs = window.goongjs;
        goongjs.accessToken = accessToken;

        mapRef.current = new goongjs.Map({
            container: 'map',
            style: 'https://tiles.goong.io/assets/goong_map_web.json',
            center,
            zoom: 14,
            pitch: 45,
            bearing: 0
        });

        mapRef.current.addControl(new goongjs.NavigationControl(), 'top-right');
        mapRef.current.addControl(new goongjs.FullscreenControl(), 'top-right');

        new goongjs.Marker({ color: '#FF4444', scale: 1.2 })
            .setLngLat(center)
            .addTo(mapRef.current);

        mapRef.current.on('load', () => {
            if (onMapLoad) {
                onMapLoad(mapRef.current); // Gửi map instance về App.jsx
            }
            mapRef.current.flyTo({ center, zoom: 14.5, pitch: 50, duration: 2000 });
            // 3. Xóa logic fetch data ở đây
        });

        return () => {
            markersRef.current.forEach(m => m.remove && m.remove());
            markersRef.current = [];
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [onMapLoad]); // Chỉ phụ thuộc vào onMapLoad

    // 4. Thêm useEffect mới để VẼ LẠI MARKER khi 'placesData' thay đổi
    useEffect(() => {
        if (!mapRef.current || !window.goongjs) return;

        // Xóa tất cả marker cũ
        markersRef.current.forEach(m => m.remove && m.remove());
        markersRef.current = [];

        if (!placesData || placesData.length === 0) {
            return; // Không làm gì nếu không có data
        }

        // Vẽ marker mới
        placesData.forEach((place, i) => {
            const marker = new window.goongjs.Marker({ color: '#007BFF' })
                .setLngLat([place.lng, place.lat])
                .addTo(mapRef.current);

            marker.getElement().addEventListener('click', () => openSidebar(i));
            markersRef.current.push(marker);
        });

        // Tự động zoom
        const bounds = new window.goongjs.LngLatBounds();
        bounds.extend(center); // Luôn bao gồm trường học
        placesData.forEach(p => bounds.extend([p.lng, p.lat]));

        if (mapRef.current.isStyleLoaded()) {
            mapRef.current.fitBounds(bounds, { padding: 100, duration: 1000, maxZoom: 16 });
        } else {
            mapRef.current.once('load', () => {
                mapRef.current.fitBounds(bounds, { padding: 100, duration: 1000, maxZoom: 16 });
            });
        }

    }, [placesData, openSidebar]); // 5. Chạy lại khi placesData thay đổi

    // 6. Xóa hàm fetchRentalData và useEffect(__FETCH_RENTALS__) khỏi component này

    return (
        <>
            <div id="map" style={{ width: '100%', height: '100%' }} />
            <div className="controls">
                {/* ... (các nút control giữ nguyên) ... */}
            </div>
        </>
    );
}