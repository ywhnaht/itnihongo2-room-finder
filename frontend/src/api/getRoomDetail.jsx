export async function getRoomDetail(id) {
  try {
    const response = await fetch(`https://itnihongo2-room-finder-production.up.railway.app/api/v1/rentals/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Lỗi khi lấy dữ liệu phòng.');
    }
    return result.data;
  } catch (error) {
    console.error('Lỗi khi gọi API getRoomDetail:', error);
    throw error;
  }
}
