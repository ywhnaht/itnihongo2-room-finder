import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom'; // 1. Import
import router from './routers'; // 2. Import router của bạn
import './styles/index.css';

// 3. Render RouterProvider thay vì App
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);