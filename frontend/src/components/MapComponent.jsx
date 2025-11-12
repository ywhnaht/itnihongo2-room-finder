import React, { useEffect, useRef } from 'react';

export default function MapComponent({ placesData, openSidebar, onMapLoad }) {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const center = [108.15009, 16.07446];
    const accessToken = import.meta.env.VITE_GOONG_ACCESS_TOKEN;

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
                onMapLoad(mapRef.current);
            }
            mapRef.current.flyTo({ center, zoom: 14.5, pitch: 50, duration: 2000 });
        });

        return () => {
            markersRef.current.forEach(m => m.remove && m.remove());
            markersRef.current = [];
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [onMapLoad]);

    useEffect(() => {
        if (!mapRef.current || !window.goongjs) return;

        markersRef.current.forEach(m => m.remove && m.remove());
        markersRef.current = [];

        if (!placesData || placesData.length === 0) {
            return;
        }

        placesData.forEach((place, i) => {
            const marker = new window.goongjs.Marker({ color: '#007BFF' })
                .setLngLat([place.lng, place.lat])
                .addTo(mapRef.current);

            marker.getElement().addEventListener('click', () => openSidebar(i));
            markersRef.current.push(marker);
        });

        const bounds = new window.goongjs.LngLatBounds();
        bounds.extend(center);
        placesData.forEach(p => bounds.extend([p.lng, p.lat]));

        if (mapRef.current.isStyleLoaded()) {
            mapRef.current.fitBounds(bounds, { padding: 100, duration: 1000, maxZoom: 16 });
        } else {
            mapRef.current.once('load', () => {
                mapRef.current.fitBounds(bounds, { padding: 100, duration: 1000, maxZoom: 16 });
            });
        }

    }, [placesData, openSidebar]);


    return (
        <>
            <div id="map" style={{ width: '100%', height: '100%' }} />
            <div className="controls">
                <button
                    className="control-btn"
                    onClick={() => mapRef.current && mapRef.current.flyTo({ center, zoom: 15, pitch: 50, bearing: 0, duration: 1000 })}
                >
                    🏠 Về vị trí ban đầu
                </button>
                <button
                    className="control-btn"
                    onClick={() => {
                        const current = mapRef.current.getStyle?.() ?? {};
                        const next = current?.name === 'dark'
                            ? 'https://tiles.goong.io/assets/goong_map_web.json'
                            : 'https://tiles.goong.io/assets/goong_map_dark.json';
                        mapRef.current.setStyle(next);
                    }}
                >
                    🗺️ Đổi kiểu bản đồ
                </button>
            </div>
        </>
    );
}