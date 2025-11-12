import React, { useEffect, useState } from 'react';
import RoomImage from '../components/RoomImages';
import RoomDetailCard from '../components/Information';
import { useParams } from 'react-router-dom';
import { getRoomDetail } from '../api/getRoomDetail';

function RoomDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRoom() {
      try {
        setError(null);
        setLoading(true);
        const result = await getRoomDetail(id);
        setData(result);
        console.log('Room detail data:', result);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  } 

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Lỗi: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-10 flex justify-center gap-10">
      <div className="w-5/6 flex gap-4">
        <div className="w-1/2">
          <RoomImage images={data?.images ?? []} />
        </div>
        <div className="w-1/2 flex flex-col gap-5">
          <RoomDetailCard data={data} /> 
        </div>
      </div>
    </div>
  );
}

export default RoomDetail;
