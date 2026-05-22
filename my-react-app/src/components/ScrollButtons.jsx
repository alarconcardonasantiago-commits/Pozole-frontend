import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs';
import './ScrollButtons.css';

const ScrollButtons = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      // Show top if scrolled past 300px
      if (scrollY > 300) {
        if (!showTop) setShowTop(true);
      } else {
        if (showTop) setShowTop(false);
      }

      // Hide bottom if near bottom
      if (scrollY + innerHeight >= scrollHeight - 100) {
        if (showBottom) setShowBottom(false);
      } else {
        if (!showBottom) setShowBottom(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showTop, showBottom]);

  useEffect(() => {
    anime({
      targets: containerRef.current,
      opacity: [0, 1],
      translateX: [20, 0],
      duration: 1000,
      delay: 500,
      easing: 'easeOutExpo',
    });
  }, []);

  const scrollToTop = () => {
    anime({
      targets: document.scrollingElement || document.documentElement,
      scrollTop: 0,
      duration: 800,
      easing: 'easeInOutQuad',
    });
  };

  const scrollToBottom = () => {
    anime({
      targets: document.scrollingElement || document.documentElement,
      scrollTop: document.documentElement.scrollHeight,
      duration: 800,
      easing: 'easeInOutQuad',
    });
  };

  const handleMouseEnter = (e) => {
    anime({
      targets: e.currentTarget,
      scale: 1.1,
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  const handleMouseLeave = (e) => {
    anime({
      targets: e.currentTarget,
      scale: 1,
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  return (
    <div className="scroll-buttons" ref={containerRef}>
      <button
        className={`scroll-btn ${showTop ? 'visible' : 'hidden'}`}
        onClick={scrollToTop}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Ir arriba"
      >
        ↑
      </button>
      <button
        className={`scroll-btn ${showBottom ? 'visible' : 'hidden'}`}
        onClick={scrollToBottom}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Ir abajo"
      >
        ↓
      </button>
    </div>
  );
};

export default ScrollButtons;
