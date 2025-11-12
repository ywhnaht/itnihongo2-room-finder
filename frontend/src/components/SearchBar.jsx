import React, { useState } from 'react';

export default function SearchBar({ onSearch, className }) {
    const [keyword, setKeyword] = useState('');
    const [price, setPrice] = useState('');
    const [distance, setDistance] = useState('');
    const [rating, setRating] = useState('');

    const handleSearchClick = () => {
        onSearch({
            keyword,
            price,
            distance,
            rating,
        });
    };

    return (
        <div className={`search-bar-container ${className || ''}`}>
            {/* Ô tìm kiếm */}
            <input
                type="text"
                className="search-bar-input"
                placeholder="Tìm kiếm phòng trọ..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            {/* Bộ lọc Giá */}
            <select
                className="search-bar-filter"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            >
                <option value="">Giá cả</option>
                <option value="0-2000000">Dưới 2 triệu</option>
                <option value="2000000-3000000">2 - 3 triệu</option>
                <option value="3000000-5000000">3 - 5 triệu</option>
                <option value="5000000">Trên 5 triệu</option>
            </select>

            {/* Bộ lọc Khoảng cách */}
            <select
                className="search-bar-filter"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
            >
                <option value="">Khoảng cách</option>
                <option value="1">Dưới 1 km</option>
                <option value="3">Dưới 3 km</option>
                <option value="5">Dưới 5 km</option>
            </select>

            {/* Bộ lọc Đánh giá */}
            <select
                className="search-bar-filter"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            >
                <option value="">Đánh giá</option>
                <option value="4">Từ 4 sao</option>
                <option value="3">Từ 3 sao</option>
                <option value="2">Từ 2 sao</option>
            </select>

            {/* Nút Tìm kiếm */}
            <button className="search-bar-button" onClick={handleSearchClick}>
                🔍
            </button>
        </div>
    );
}