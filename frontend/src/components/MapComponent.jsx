import React, { useEffect, useRef } from 'react';

export default function MapComponent({ placesData, setPlacesData, openSidebar, setStatus, setLoading }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const center = [108.15009, 16.07446];

  const accessToken = import.meta.env.VITE_GOONG_ACCESS_TOKEN;

  // Mock dữ liệu phụ
  const sharedMockData = {
    priceUnit: "đ/tháng",
    size: "25",
    sizeUnit: "m²",
    electricity: "3.500",
    electricityUnit: "đ/kWh",
    water: "100.000",
    waterUnit: "đ/người/tháng",
    internet: "100.000",
    internetUnit: "đ/phòng/tháng",
    parking: "Miễn phí",
    contact: "0902.123.456",
    distanceTransport: "Xe buýt số 8, 33 (điểm dừng cách 100m)",
    imageCount: "7/8",
    facilities: [
      "Phòng có ban công, cửa sổ thoáng mát",
      "Khu vực an ninh, có bảo vệ 24/7",
      "Không chung chủ, tự do giờ giấc"
    ]
  };

  useEffect(() => {
    if (!window.goongjs) {
      console.error('goongjs not found. Make sure CDN script is in index.html');
      setStatus('⚠️ Lỗi tải thư viện bản đồ');
      return;
    }

    const goongjs = window.goongjs;
    goongjs.accessToken = accessToken;

    // Khởi tạo bản đồ
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

    // Marker trung tâm (trường ĐH Bách Khoa)
    new goongjs.Marker({ color: '#FF4444', scale: 1.2 })
      .setLngLat(center)
      .addTo(mapRef.current);

    // Khi bản đồ load xong
    mapRef.current.on('load', () => {
      setStatus('🗺️ Đã tải bản đồ');
      mapRef.current.flyTo({ center, zoom: 14.5, pitch: 50, duration: 2000 });

      setTimeout(() => {
        setStatus('📡 Đang tải dữ liệu phòng trọ...');
        fetchRentalData();
      }, 1000);
    });

    return () => {
      // Cleanup markers & map
      markersRef.current.forEach(m => m.remove && m.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const fetchRentalData = async () => {
    if (!mapRef.current) return;
    setLoading(true);
    setPlacesData([]);
    markersRef.current.forEach(m => m.remove && m.remove());
    markersRef.current = [];

    try {
      const res = await fetch('https://itnihongo2-room-finder-production.up.railway.app/api/v1/rentals');
      const json = await res.json();

      if (!json?.data?.data || !Array.isArray(json.data.data)) throw new Error('Không có dữ liệu hợp lệ');

      const newPlaces = [];

      json.data.data.forEach((item, i) => {
        let coords = [];
        try {
          coords = JSON.parse(item.locationGeoJson).coordinates;
        } catch {
          return;
        }
        if (!coords || coords.length < 2) return;
        const [lng, lat] = coords;

        // Merge dữ liệu thật với sharedMockData
        const place = {
          id: item.id,
          name: item.name || `Phòng trọ #${i + 1}`,
          address: item.fullAddress || 'Chưa có địa chỉ',
          lat,
          lng,
          price: item.price ? item.price.toLocaleString('vi-VN') + ' đ' : sharedMockData.price,
          distanceToSchool: item.distanceToSchool ? item.distanceToSchool.toFixed(1) + ' km' : sharedMockData.distanceSchool,
          averageRating: item.averageRating || 'N/A',
          image: item.thumbNailUrl || sharedMockData.image,
          ...sharedMockData // giữ các thông tin phụ
        };

        newPlaces.push(place);
      });

      setPlacesData(newPlaces);

      // Tạo markers **không popup**, click mở sidebar
      newPlaces.forEach((place, i) => {
        const marker = new window.goongjs.Marker({ color: '#007BFF' })
          .setLngLat([place.lng, place.lat])
          .addTo(mapRef.current);

        marker.getElement().addEventListener('click', () => openSidebar(i));
        markersRef.current.push(marker);
      });

      if (newPlaces.length > 0) {
        setStatus(`✅ Đã tải ${newPlaces.length} phòng trọ`);
        const bounds = new window.goongjs.LngLatBounds();
        bounds.extend(center);
        newPlaces.forEach(p => bounds.extend([p.lng, p.lat]));
        mapRef.current.fitBounds(bounds, { padding: 100, duration: 1000, maxZoom: 16 });
      } else {
        setStatus('❌ Không có kết quả hợp lệ');
      }

    } catch (err) {
      console.error(err);
      setStatus('⚠️ Lỗi tải dữ liệu');
      alert('Không thể tải dữ liệu phòng trọ!');
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchRentalData ra ngoài (nếu cần gọi từ button)
  useEffect(() => {
    window.__FETCH_RENTALS__ = fetchRentalData;
    return () => { window.__FETCH_RENTALS__ = undefined; };
  }, []);

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
