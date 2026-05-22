import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollButtons from './components/ScrollButtons';
import Home from './pages/Home';
import SectionPage from './pages/SectionPage';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:path" element={<SectionPage />} />
      </Routes>
      <ScrollButtons />
      <Footer />
    </div>
  );
};

export default App;