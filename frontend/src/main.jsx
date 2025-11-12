import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routers'; // Import router của bạn
import './styles/index.css'; // Import CSS chính

// Lấy element root từ index.html
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Render RouterProvider (đây là điểm khởi đầu của app)
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);