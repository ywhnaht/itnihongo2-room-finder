import { Navigate, createBrowserRouter } from "react-router-dom";
import RoomDetail from "../pages/RoomDetail";
import RoomList from "../pages/RoomList"; // 💡 1. Import trang RoomList

const router = createBrowserRouter([
  {
    path: "/RoomList",
    element: <RoomList />
  },
  {
    path: "/RoomDetail/:id",
    element: <RoomDetail />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;