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
        borderBottom: `2px solid ${section.color}40`,
        minHeight: section.isFloor ? '30vh' : '50vh', // Adjust height for floors vs others
      }}
      ref={sectionRef}
    >
      <div className="section-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        
        {section.isFloor ? (
          /* Floor Layout: Just a big button to access the floor */
          <div className="section-floor-only animate-item" style={{ textAlign: 'center', width: '100%' }}>
            <h2 style={{ backgroundImage: section.gradient, fontSize: '3rem', marginBottom: '30px' }}>{section.name}</h2>
            <button
              className="section-link floor-btn"
              style={{ background: section.gradient, fontSize: '1.5rem', padding: '20px 60px', borderRadius: '50px', width: 'auto' }}
              onClick={handleExplore}
            >
              Acceder al {section.name} →
            </button>
          </div>
        ) : (
          /* Parqueadero / Seguridad Layout: Image + button */
          <div className="section-single animate-item" style={{ textAlign: 'center' }}>
            <h2 style={{ backgroundImage: section.gradient, marginBottom: '20px' }}>{section.name}</h2>
            <p style={{ marginBottom: '30px', color: '#ccc' }}>{section.description}</p>
            <div className="section-image" style={{ marginBottom: '20px', borderRadius: '15px', overflow: 'hidden' }}>
              <img
                src={section.image}
                alt={section.name}
                loading="lazy"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
            <button
              className="section-link"
              style={{ background: section.gradient, fontSize: '1.2rem', padding: '15px 40px' }}
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
