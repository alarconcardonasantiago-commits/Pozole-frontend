import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ScrollButtons from './components/ScrollButtons';
import WelcomeModal from './components/WelcomeModal';
import Home from './pages/Home';
import SectionPage from './pages/SectionPage';
import ParqueaderoPage from './pages/ParqueaderoPage';
import SeguridadPage from './pages/SeguridadPage';
import './App.css';

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app">
      {showWelcome && isHome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parqueadero" element={<ParqueaderoPage />} />
        <Route path="/seguridad" element={<SeguridadPage />} />
        <Route path="/:path" element={<SectionPage />} />
      </Routes>
      <ScrollButtons />
    </div>
  );
};

export default App;