import { Navigate, createBrowserRouter } from "react-router-dom";
import RoomDetail from "../pages/RoomDetail";

const router = createBrowserRouter([
  {
    path: "/RoomDetail/:id",
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
