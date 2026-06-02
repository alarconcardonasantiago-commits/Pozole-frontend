import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import './Section.css';

const Section = ({ section, index, onExplore }) => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

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
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleExplore = () => {
    if (section.requiresAccess) {
      onExplore(section);
    } else {
      navigate(`/${section.path}`);
    }
  };

  return (
    <section
      id={`section-${section.id}`}
      className="section"
      style={{
        background: `linear-gradient(180deg, rgba(20,20,22,0.4) 0%, rgba(0,0,0,0.7) 100%)`,
        borderBottom: `2px solid ${section.color}40`, // Add a subtle border to separate floors
      }}
      ref={sectionRef}
    >
      <div className="section-container">
        <div className="section-header-text animate-item">
          <h2 style={{ backgroundImage: section.gradient }}>{section.name}</h2>
          <p>{section.description}</p>
        </div>

        {section.hasTwoColumns ? (
          /* Two-column layout for Pisos */
          <div className="section-columns">
            {section.columns.map((col, colIndex) => (
              <div key={colIndex} className="section-column animate-item">
                <div className="section-image">
                  <img
                    src={`https://placehold.co/600x400/141416/FFFFFF?text=${encodeURIComponent(section.name + ' - ' + col.label)}&font=outfit`}
                    alt={`${section.name} ${col.label}`}
                    loading="lazy"
                  />
                </div>
                <p className="column-label">{col.label}</p>
                <button
                  className="section-link"
                  style={{ background: section.gradient }}
                  onClick={handleExplore}
                >
                  Explorar {section.name} →
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Single column for Parqueadero / Seguridad */
          <div className="section-single animate-item">
            <div className="section-image">
              <img
                src={`https://placehold.co/800x500/141416/FFFFFF?text=${encodeURIComponent(section.name)}&font=outfit`}
                alt={section.name}
                loading="lazy"
              />
            </div>
            <button
              className="section-link"
              style={{ background: section.gradient }}
              onClick={handleExplore}
            >
              Explorar {section.name} →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Section;
