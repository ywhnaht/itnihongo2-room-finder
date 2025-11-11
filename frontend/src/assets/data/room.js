// Data mô phỏng bảng 'amenities'
export const AMENITIES_MASTER = [
  { id: 1, name: 'Wifi miễn phí', icon_class: '📶' },
  { id: 2, name: 'Điều hòa', icon_class: '❄️' },
  { id: 3, name: 'Nóng lạnh', icon_class: '🛁' },
  { id: 4, name: 'Chỗ giữ xe', icon_class: '🛵' },
  { id: 5, name: 'Gần Minimart', icon_class: '🏪' },
  { id: 6, name: 'An ninh 24/7', icon_class: '🛡️' },
  { id: 7, name: 'Có gác lửng', icon_class: '⬆️' },
];

const amenityMap = AMENITIES_MASTER.reduce((map, amenity) => {
  map[amenity.id] = amenity;
  return map;
}, {});

const getAmenitiesByIds = (ids) => {
  return ids.map(id => amenityMap[id]).filter(a => a);
};

export const roomList = [
  {
    id: 1,
    name: 'Trọ KTX-style gần Bách Khoa',
    description: 'Phòng trọ kiểu KTX mới xây, an ninh tốt, gần cổng sau trường ĐH Bách Khoa. Chỉ cho sinh viên thuê.',
    full_address: '123 Nguyễn Lương Bằng, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng',
    price: 1800000,
    area: 20.0,
    location: { longitude: 108.151123, latitude: 16.074062 },
    thumbnail_url: 'https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg', 
    contact_phone: '0905111222',
    contact_name: 'Cô Hoa',
    average_rating: 4.5, 
    rating_count: 15,
    postedDate: '2025-11-01', 
    isHot: true, 
    // Mô phỏng kết quả JOIN với bảng rental_amenities
    amenities: getAmenitiesByIds([1, 4, 6]), 
  },
  {
    id: 2,
    name: 'Căn hộ mini full nội thất (Hải Châu)',
    description: 'Căn hộ studio đầy đủ tiện nghi, có bếp riêng, Smart TV. Ngay trung tâm, tiện đi lại. Giờ giấc tự do.',
    full_address: '45 Phan Châu Trinh, Phước Ninh, Hải Châu, Đà Nẵng',
    price: 4500000,
    area: 30.0,
    location: { longitude: 108.221542, latitude: 16.064231 },
    thumbnail_url: 'https://cdn.pixabay.com/photo/2014/08/11/21/39/wall-416060_1280.jpg', 
    contact_phone: '0988777666',
    contact_name: 'Anh Minh',
    average_rating: 4.8,
    rating_count: 22,
    postedDate: '2025-10-28',
    isHot: false,
    amenities: getAmenitiesByIds([1, 2, 3, 5]),
  },
  {
    id: 3,
    name: 'Phòng trọ có gác gần biển Mỹ Khê',
    description: 'Phòng trọ rộng rãi, thoáng mát, có gác lửng. Đi bộ ra biển 5 phút, khu phố Tây An Thượng.',
    full_address: '88 An Thượng 10, Bắc Mỹ Phú, Ngũ Hành Sơn, Đà Nẵng',
    price: 3200000,
    area: 28.0,
    location: { longitude: 108.243011, latitude: 16.054765 },
    thumbnail_url: 'https://cdn.pixabay.com/photo/2018/08/01/08/55/hotel-3576826_1280.jpg', 
    contact_phone: '0912345678',
    contact_name: 'Chị Lan',  
    average_rating: 4.2,
    rating_count: 8,
    postedDate: '2025-11-05',
    isHot: true,
    amenities: getAmenitiesByIds([1, 2, 7]),
  },
];
