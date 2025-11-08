import React, { useEffect, useRef } from 'react';

export default function MapComponent({ placesData, setPlacesData, openSidebar, setStatus, setLoading }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const center = [108.15009, 16.07446];

  const accessToken = import.meta.env.VITE_GOONG_ACCESS_TOKEN;
  const REST_KEY = import.meta.env.VITE_GOONG_REST_API_KEY;

  useEffect(() => {
    // ensure goongjs is loaded via the CDN script in index.html
    if (!window.goongjs) {
      console.error('goongjs not found. Make sure CDN script is in index.html');
      setStatus('⚠️ Lỗi tải thư viện bản đồ');
      return;
    }

    const goongjs = window.goongjs;
    goongjs.accessToken = accessToken;

    // Create map
    mapRef.current = new goongjs.Map({
      container: 'map',
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
      center: center,
      zoom: 14,
      pitch: 45,
      bearing: 0
    });

    // controls
    mapRef.current.addControl(new goongjs.NavigationControl(), 'top-right');
    mapRef.current.addControl(new goongjs.FullscreenControl(), 'top-right');

    // center marker
    new goongjs.Marker({ color: '#FF4444', scale: 1.2 })
      .setLngLat(center)
      .setPopup(new goongjs.Popup().setHTML(`<div class="simple-popup"><h4>🎓 ĐH Bách Khoa Đà Nẵng</h4><p>Vị trí trung tâm</p></div>`))
      .addTo(mapRef.current);

    mapRef.current.on('load', () => {
      setStatus('🗺️ Đã tải bản đồ');
      mapRef.current.flyTo({ center, zoom: 14.5, pitch: 50, duration: 2000 });

      setTimeout(() => {
        setStatus('🔍 Tự động tìm kiếm...');
        searchNearby('Phòng Trọ');
      }, 1200);
    });

    // cleanup
    return () => {
      // remove markers
      markersRef.current.forEach(m => m.remove && m.remove());
      markersRef.current = [];
      // remove map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // search function
  const searchNearby = async (query) => {
    if (!mapRef.current) return;
    setLoading(true);
    setStatus('Đang tìm kiếm...');
    // clear old markers
    markersRef.current.forEach(m => m.remove && m.remove());
    markersRef.current = [];
    setPlacesData([]);

    const centerObj = mapRef.current.getCenter();
    const searchUrl = `https://rsapi.goong.io/Place/AutoComplete?api_key=${REST_KEY}&location=${centerObj.lat},${centerObj.lng}&input=${encodeURIComponent(query)}&limit=10&radius=3000`;

    try {
      const res = await fetch(searchUrl);
      const data = await res.json();
      if (!data.predictions?.length) throw new Error('Không tìm thấy kết quả');

      // get detail for each
      const promises = data.predictions.map(p =>
        fetch(`https://rsapi.goong.io/Place/Detail?place_id=${p.place_id}&api_key=${REST_KEY}`)
          .then(r => r.json())
          .catch(() => null)
      );

      const details = await Promise.all(promises);
      const newPlaces = [];

      details.forEach((detail, i) => {
        if (detail?.result?.geometry?.location) {
          const loc = detail.result.geometry.location;
          const pred = data.predictions[i];

          const sharedMockData = {
            price: "2.500.000",
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
            distanceSchool: "1.5 km (khoảng 10 phút đi xe máy)",
            distanceTransport: "Xe buýt số 8, 33 (điểm dừng cách 100m)",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
            imageCount: "7/8",
            facilities: [
              "Phòng có ban công, cửa sổ thoáng mát",
              "Khu vực an ninh, có bảo vệ 24/7",
              "Không chung chủ, tự do giờ giấc"
            ]
          };

          const place = {
            name: detail.result.name || pred.description,
            address: detail.result.formatted_address || pred.description,
            lat: loc.lat,
            lng: loc.lng,
            ...sharedMockData
          };

          // add marker
          const simplePopup = `<div class="simple-popup"><h4>📍 ${place.name}</h4><p>Nhấn để xem chi tiết</p></div>`;
          const marker = new window.goongjs.Marker({ color: '#007BFF' })
            .setLngLat([place.lng, place.lat])
            .setPopup(new window.goongjs.Popup({ offset: 25 }).setHTML(simplePopup))
            .addTo(mapRef.current);

          // closure index
          const placeIndex = newPlaces.length;
          marker.getElement().addEventListener('click', () => {
            openSidebar(placeIndex);
          });

          markersRef.current.push(marker);
          newPlaces.push(place);
        }
      });

      setPlacesData(newPlaces);

      if (newPlaces.length > 0) {
        setStatus(`✅ Tìm thấy ${newPlaces.length} kết quả`);
        // fit bounds
        const bounds = new window.goongjs.LngLatBounds();
        bounds.extend(center);
        newPlaces.forEach(p => bounds.extend([p.lng, p.lat]));
        mapRef.current.fitBounds(bounds, { padding: 100, duration: 1000, maxZoom: 16 });
      } else {
        setStatus('❌ Không có kết quả hợp lệ');
      }

    } catch (err) {
      console.error(err);
      setStatus('⚠️ Lỗi tìm kiếm');
      alert('Không tìm thấy kết quả. Hãy thử từ khóa khác.');
    } finally {
      setLoading(false);
    }
  };

  // Expose searchNearby to global so top bar button can call it
  useEffect(() => {
    window.__SEARCH_NEARBY__ = searchNearby;
    return () => { window.__SEARCH_NEARBY__ = undefined; };
  }, []);

  // Render the map container
  return (
    <>
      <div id="map" />
      <div className="controls">
        <button className="control-btn" onClick={() => mapRef.current && mapRef.current.flyTo({ center, zoom: 15, pitch: 50, bearing: 0, duration: 1000 })}>🏠 Về vị trí ban đầu</button>
        <button className="control-btn" onClick={() => {
          // toggle style
          const current = mapRef.current.getStyle?.() ?? {};
          const next = (current?.name === 'dark' ? 'https://tiles.goong.io/assets/goong_map_web.json' : 'https://tiles.goong.io/assets/goong_map_dark.json');
          mapRef.current.setStyle(next);
        }}>🗺️ Đổi kiểu bản đồ</button>
      </div>
    </>
  );
}
