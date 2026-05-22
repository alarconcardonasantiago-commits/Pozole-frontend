import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import anime from 'animejs';
import { SECTIONS } from '../constants/sections';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    anime({
      targets: '.navbar',
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });
  }, []);

  const handleMouseEnter = (e) => {
    anime({
      targets: e.target,
      scale: 1.05,
      color: '#FFF',
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  const handleMouseLeave = (e, isActive) => {
    anime({
      targets: e.target,
      scale: 1,
      color: isActive ? '#FFF' : '#9CA3AF',
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <h1>Pozole</h1>
          </Link>
        </div>

        <nav className="navbar-nav" ref={navRef}>
          {SECTIONS.map((section) => {
            const isActive = location.pathname === `/${section.path}`;
            return (
              <Link
                key={section.id}
                to={`/${section.path}`}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={(e) => handleMouseLeave(e, isActive)}
                style={{ color: isActive ? '#FFF' : '#9CA3AF' }}
              >
                {section.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
