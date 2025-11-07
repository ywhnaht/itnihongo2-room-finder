import { Navigate, createBrowserRouter } from "react-router-dom";
import RoomDetail from "../pages/roomDetail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RoomDetail />
    )
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
