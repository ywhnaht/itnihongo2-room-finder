// import React, { useState, useRef } from 'react';
// import MapComponent from '../components/MapComponent';
// // import Sidebar from '../components/Sidebar'; // 1. Xóa Sidebar chi tiết
// import Loading from '../components/Loading';
// import ResultSidebar from '../components/ResultSidebar'; // 2. Import ResultSidebar
// import SearchBar from '../components/SearchBar';

// export default function Map() {
//   // --- State và Ref ---
//   const [placesData, setPlacesData] = useState([]);
//   const [isResultSidebarOpen, setIsResultSidebarOpen] = useState(false); // 3. State mới
//   const [status, setStatus] = useState('Tìm kiếm phòng trọ tại Đà Nẵng...');
//   const [loading, setLoading] = useState(false);
//   const mapInstanceRef = useRef(null);

//   // --- Các hàm xử lý giao diện ---

//   // Xử lý khi click vào 1 item trong ResultSidebar (để pan bản đồ)
//   const handleRoomItemClick = (room) => {
//     if (!mapInstanceRef.current || !room.lng || !room.lat) return;

//     mapInstanceRef.current.flyTo({
//       center: [room.lng, room.lat],
//       zoom: 17,
//       pitch: 45,
//       duration: 1500
//     });
//     // Không cần mở sidebar chi tiết ở đây nữa
//   };

//   // 4. Hàm xử lý khi click marker trên bản đồ
//   const handleMarkerClick = (index) => {
//     // Khi click marker, ta cũng chỉ cần pan bản đồ và đảm bảo sidebar kết quả đang mở
//     setIsResultSidebarOpen(true);
//     const place = placesData[index];
//     if (mapInstanceRef.current && place) {
//       mapInstanceRef.current.flyTo({
//         center: [place.lng, place.lat],
//         zoom: 17,
//         pitch: 45,
//         duration: 1500
//       });
//     }
//   };

//   // --- Hàm gọi API chính (từ SearchBar) ---
//   const fetchRentalData = async (filters) => {
//     if (!filters) return;

//     setLoading(true);
//     setPlacesData([]);
//     setStatus('📡 Đang tìm kiếm theo bộ lọc...');

//     // 5. Kiểm tra và sửa lại tham số API cho đúng
//     const params = new URLSearchParams();
//     if (filters.keyword) params.append('search', filters.keyword);
//     if (filters.rating) params.append('minRating', filters.rating);
//     if (filters.distance) params.append('maxDistance', filters.distance);
//     if (filters.price) {
//       if (filters.price.includes('-')) {
//         const [min, max] = filters.price.split('-');
//         params.append('minPrice', min);
//         params.append('maxPrice', max);
//       } else {
//         params.append('minPrice', filters.price);
//       }
//     }

//     const API_URL = `https://itnihongo2-room-finder-production.up.railway.app/api/v1/rentals/search?${params.toString()}`;

//     try {
//       const res = await fetch(API_URL);
//       const json = await res.json();
//       const apiData = json?.data?.data;
//       if (!apiData || !Array.isArray(apiData)) throw new Error('Không có dữ liệu hợp lệ');

//       const newPlaces = apiData.map((item, i) => {
//         let coords = [];
//         try {
//           coords = JSON.parse(item.locationGeoJson).coordinates;
//         } catch { return null; }

//         if (!coords || coords.length < 2) return null;
//         const [lng, lat] = coords;

//         return {
//           id: item.id,
//           name: item.name || `Phòng trọ #${i + 1}`,
//           address: item.fullAddress || 'Chưa có địa chỉ',
//           lat,
//           lng,
//           price: item.price ? item.price.toLocaleString('vi-VN') + ' đ' : 'N/A',
//           distanceToSchool: item.distanceToSchool ? item.distanceToSchool.toFixed(1) : 'N/A',
//           averageRating: item.averageRating ? item.averageRating.toFixed(1) : 'N/A',
//           image: item.thumbNailUrl || 'https://via.placeholder.com/100x80.png?text=No+Image',
//           // ... (thêm các trường khác nếu ResultSidebar cần)
//         };
//       }).filter(Boolean);

//       setPlacesData(newPlaces);
//       setStatus(`✅ Tìm thấy ${newPlaces.length} phòng trọ`);
//       setIsResultSidebarOpen(true); // 6. Mở Sidebar kết quả khi tìm xong

//     } catch (err) {
//       console.error(err);
//       setStatus('⚠️ Lỗi tải dữ liệu. Vui lòng thử lại.');
//       setIsResultSidebarOpen(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Render JSX ---
//   return (
//     <>
//       {/* Thanh tìm kiếm */}
//       <SearchBar
//         onSearch={fetchRentalData}
//         className={isResultSidebarOpen ? 'with-sidebar' : ''}
//       />


//       {/* 7. Dùng ResultSidebar (thay vì RoomList và Sidebar cũ) */}
//       <ResultSidebar
//         places={placesData}
//         onMapClick={handleRoomItemClick} // Click item để pan bản đồ
//         isOpen={isResultSidebarOpen}
//         onClose={() => setIsResultSidebarOpen(false)}
//       />

//       {/* Component bản đồ */}
//       <MapComponent
//         placesData={placesData}
//         openSidebar={handleMarkerClick} // Click marker
//         onMapLoad={(map) => { mapInstanceRef.current = map; }}
//       />

//       {/* Loading spinner */}
//       {loading && <Loading />}
//     </>
//   );
// }


import React, { useState, useRef } from 'react';
import MapComponent from '../components/MapComponent';
import Loading from '../components/Loading';
import ResultSidebar from '../components/ResultSidebar';
import SearchBar from '../components/SearchBar';

const PAGE_SIZE = 5; // Số lượng kết quả mỗi trang

export default function Map() {
  // --- State và Ref ---
  const [placesData, setPlacesData] = useState([]);
  const [isResultSidebarOpen, setIsResultSidebarOpen] = useState(false);
  const [status, setStatus] = useState('Tìm kiếm phòng trọ tại Đà Nẵng...');
  const [loading, setLoading] = useState(false);
  const mapInstanceRef = useRef(null);

  // --- State MỚI cho phân trang và bộ lọc ---
  const [pagination, setPagination] = useState(null); // Lưu trữ object pagination từ API
  const [currentFilters, setCurrentFilters] = useState(null); // Lưu bộ lọc cuối cùng

  // --- Các hàm xử lý giao diện ---

  const handleRoomItemClick = (room) => {
    // (Giữ nguyên code)
    if (!mapInstanceRef.current || !room.lng || !room.lat) return;
    mapInstanceRef.current.flyTo({
      center: [room.lng, room.lat],
      zoom: 17, pitch: 45, duration: 1500
    });
  };

  const handleMarkerClick = (index) => {
    // (Giữ nguyên code)
    setIsResultSidebarOpen(true);
    const place = placesData[index];
    if (mapInstanceRef.current && place) {
      mapInstanceRef.current.flyTo({
        center: [place.lng, place.lat],
        zoom: 17, pitch: 45, duration: 1500
      });
    }
  };

  // --- Hàm gọi API (CẬP NHẬT) ---
  // Hàm này giờ nhận 2 tham số:
  // 1. filters: Object bộ lọc TỪ SearchBar (nếu là tìm kiếm MỚI)
  // 2. page: Số trang cần tải (0-indexed)
  const fetchRentalData = async (filters, page = 0) => {
    setLoading(true);
    setPlacesData([]);

    // Nếu đây là tìm kiếm MỚI (có `filters`), hãy lưu nó lại
    // và set trạng thái
    let filtersToUse;
    if (filters) {
      setCurrentFilters(filters); // Lưu bộ lọc cho lần chuyển trang sau
      filtersToUse = filters;
      setStatus('📡 Đang tìm kiếm theo bộ lọc...');
    } else {
      // Nếu không có `filters`, đây là MỘT LẦN CHUYỂN TRANG
      // Dùng bộ lọc đã lưu
      filtersToUse = currentFilters;
      setStatus(`⏳ Đang tải trang ${page + 1}...`);
    }

    if (!filtersToUse) {
      setLoading(false);
      setStatus('Vui lòng nhập tìm kiếm hoặc bộ lọc.');
      return;
    }

    // 1. Xây dựng query string
    const params = new URLSearchParams();
    if (filtersToUse.keyword) params.append('search', filtersToUse.keyword);
    if (filtersToUse.rating) params.append('minRating', filtersToUse.rating);
    if (filtersToUse.distance) params.append('maxDistance', filtersToUse.distance);
    if (filtersToUse.price) {
      if (filtersToUse.price.includes('-')) {
        const [min, max] = filtersToUse.price.split('-');
        params.append('minPrice', min);
        params.append('maxPrice', max);
      } else {
        params.append('minPrice', filtersToUse.price);
      }
    }

    // 2. THÊM tham số phân trang
    params.append('page', page);
    params.append('size', PAGE_SIZE);

    const API_URL = `https://itnihongo2-room-finder-production.up.railway.app/api/v1/rentals/search?${params.toString()}`;

    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      const apiData = json?.data?.data;
      const apiPagination = json?.data?.pagination; // 3. Lấy thông tin pagination

      if (!apiData || !Array.isArray(apiData) || !apiPagination) throw new Error('Không có dữ liệu hoặc thông tin phân trang');

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
        };
      }).filter(Boolean);

      setPlacesData(newPlaces);
      setPagination(apiPagination); // 4. LƯU thông tin pagination vào state

      const totalResults = apiPagination.totalElements || 0;
      setStatus(`✅ Tìm thấy ${totalResults} kết quả (trang ${page + 1}/${apiPagination.totalPages || 1})`);
      setIsResultSidebarOpen(true);

    } catch (err) {
      console.error(err);
      setStatus('⚠️ Lỗi tải dữ liệu. Vui lòng thử lại.');
      setIsResultSidebarOpen(false);
      setPagination(null); // Xóa phân trang nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  // --- Hàm MỚI để xử lý chuyển trang ---
  const handlePageChange = (newPage) => {
    // newPage là 0-indexed
    if (pagination && newPage >= 0 && newPage < pagination.totalPages) {
      fetchRentalData(null, newPage); // Gọi API với bộ lọc cũ, nhưng trang mới
    }
  };

  // --- Render JSX ---
  return (
    <>
      {/* 1. onSearch giờ sẽ gọi trang ĐẦU TIÊN (page 0) */}
      <SearchBar
        onSearch={(filters) => fetchRentalData(filters, 0)}
        className={isResultSidebarOpen ? 'with-sidebar' : ''}
      />

      <div id="mapOverlay" className={isResultSidebarOpen ? 'with-sidebar map-overlay' : 'map-overlay'}>
        <h2>🏠 Tìm phòng trọ Đà Nẵng</h2>
        <p id="status">{status}</p>
      </div>

      {/* 2. Truyền props phân trang xuống ResultSidebar */}
      <ResultSidebar
        places={placesData}
        onMapClick={handleRoomItemClick}
        isOpen={isResultSidebarOpen}
        onClose={() => setIsResultSidebarOpen(false)}
        pagination={pagination} // Truyền object pagination
        onPageChange={handlePageChange} // Truyền hàm xử lý
      />

      <MapComponent
        placesData={placesData}
        openSidebar={handleMarkerClick}
        onMapLoad={(map) => { mapInstanceRef.current = map; }}
      />

      {loading && <Loading />}
    </>
  );
}