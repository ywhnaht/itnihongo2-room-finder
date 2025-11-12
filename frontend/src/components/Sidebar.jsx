import React from 'react';

export default function Sidebar({ isOpen, place, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={`sidebar open`} id="sidebar">
      <div className="sidebar-header">
        <h2>Chi tiết phòng trọ</h2>
        <button className="close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="sidebar-content" id="sidebarContent">
        {place ? (
          <div className="detail-card">
            <div className="detail-gallery">
              <img src={place.image} alt={place.name} />
              <div className="gallery-counter">📷 {place.imageCount}</div>
            </div>

            <h3>{place.name}</h3>
            <div className="location-info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p>{place.address}</p>
            </div>

            <div className="distance-tags">
              <div className="distance-tag">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/>
                </svg>
                <div className="distance-tag-content">
                  <div className="distance-tag-title">Khoảng cách đến trường</div>
                  <div className="distance-tag-desc">{place.distanceToSchool}</div>
                </div>
              </div>
              <div className="distance-tag">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 20H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z"/>
                  <rect x="6" y="10" width="12" height="8" rx="1"/>
                </svg>
                <div className="distance-tag-content">
                  <div className="distance-tag-title">Phương tiện di chuyển</div>
                  <div className="distance-tag-desc">{place.distanceTransport}</div>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h4>Thông tin phòng trọ</h4>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-item-header"><div className="info-label">Giá phòng</div></div>
                  <div className="info-value">{place.price} {place.priceUnit}</div>
                </div>
                <div className="info-item">
                  <div className="info-item-header"><div className="info-label">Diện tích</div></div>
                  <div className="info-value">{place.size} {place.sizeUnit}</div>
                </div>
                <div className="info-item">
                  <div className="info-item-header"><div className="info-label">Tiền điện</div></div>
                  <div className="info-value">{place.electricity} {place.electricityUnit}</div>
                </div>
                <div className="info-item">
                  <div className="info-item-header"><div className="info-label">Tiền nước</div></div>
                  <div className="info-value">{place.water} {place.waterUnit}</div>
                </div>
                <div className="info-item">
                  <div className="info-item-header"><div className="info-label">Internet</div></div>
                  <div className="info-value">{place.internet} {place.internetUnit}</div>
                </div>
                <div className="info-item">
                  <div className="info-item-header"><div className="info-label">Giữ xe</div></div>
                  <div className="info-value">{place.parking}</div>
                </div>
              </div>
            </div>

            <div className="amenities">
              {place.facilities.map((f, i) => (
                <div key={i} className="amenity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </div>
              ))}
            </div>

            <button className="contact-btn" onClick={() => window.open(`tel:${place.contact}`)}>Xem chi tiết thông tin phòng</button>
          </div>
        ) : <p>Không có dữ liệu</p>}
      </div>
    </div>
  );
}
