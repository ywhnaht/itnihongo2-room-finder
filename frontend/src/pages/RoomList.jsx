import React from 'react';
import RoomCard from '../components/RoomCard/index.jsx';
import { roomList } from '../assets/data/room.js';

function RoomList() {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0 z-0">
                {/* Đặt component bản đồ ở đây
                */}
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-700 text-2xl font-semibold text-center">
                        🗺️ Map Placeholder
                        <br />
                        (Component bản đồ sẽ hiển thị ở đây)
                    </span>
                </div>
            </div>

            <div className="absolute top-0 left-0 z-10 w-full md:w-1/2 lg:w-2/5 xl:w-1/3 h-full overflow-y-auto p-4 bg-white shadow-lg">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-4">
                    Kết quả tìm kiếm ({roomList.length} phòng)
                </h1>

                {/* Danh sách các RoomCard */}
                <div className="space-y-6">
                    {roomList.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>

                {roomList.length === 0 && (
                    <p className="text-center text-gray-500 text-lg py-10">
                        Không tìm thấy phòng trọ nào.
                    </p>
                )}
            </div>

        </div>
    );
}

export default RoomList;