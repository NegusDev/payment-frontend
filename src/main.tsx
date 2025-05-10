// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './assets/css/global.css';
import AboutPage from './pages/about.tsx';
import Home from './pages/home.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="about" element={<AboutPage />} />
    </Routes>
  </BrowserRouter>
)
