import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import './Section.css';

const Section = ({ section, index }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: element.querySelectorAll('.animate-item'),
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 800,
              delay: anime.stagger(150, { start: 100 }),
              easing: 'easeOutQuart',
            });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={`section-${section.id}`}
      className="section"
      style={{
        background: `linear-gradient(180deg, var(--dark-bg) 0%, rgba(0,0,0,0.8) 100%), ${section.gradient}`,
      }}
      ref={sectionRef}
    >
      <div className="section-container">
        <div className="section-content">
          <h2 className="animate-item" style={{ backgroundImage: section.gradient }}>
            {section.name}
          </h2>
          <p className="animate-item">{section.description}</p>

          <div className="section-image animate-item">
            <img
              src={`https://placehold.co/800x500/141416/FFFFFF?text=${encodeURIComponent(section.name)}&font=outfit`}
              alt={section.name}
              loading="lazy"
            />
          </div>

          <Link
            to={`/${section.path}`}
            className="section-link animate-item"
            style={{ background: section.gradient }}
          >
            Explorar {section.name} →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Section;
