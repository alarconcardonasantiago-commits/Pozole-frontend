import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import anime from 'animejs';
import { SECTIONS } from '../constants/sections';
import './SectionPage.css';

const SectionPage = () => {
  const { path } = useParams();
  const section = SECTIONS.find((s) => s.path === path);
  const pageRef = useRef(null);

  useEffect(() => {
    if (!section) return;
    
    const elements = pageRef.current.querySelectorAll('.stagger-enter');
    
    anime.set(elements, { opacity: 0, translateY: 30 });
    
    anime({
      targets: elements,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: anime.stagger(150),
      easing: 'easeOutQuart',
    });
  }, [path, section]);

  if (!section) {
    return (
      <main className="section-page-not-found">
        <div className="section-page-content">
          <h1>Página no encontrada</h1>
          <p>Lo sentimos, esta sección no existe.</p>
          <Link to="/" className="btn-back">
            ← Volver al Inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section-page" ref={pageRef}>
      <div className="section-page-hero" style={{ background: section.gradient }}>
        <h1 className="stagger-enter">{section.name}</h1>
        <p className="stagger-enter">{section.description}</p>
      </div>

      <div className="section-page-container">
        <div className="section-page-body">
          <div className="section-text stagger-enter">
            <h2>Detalles y Especificaciones</h2>
            <p>
              Explora en profundidad lo que <strong>{section.name}</strong> tiene para ofrecer.
              Hemos diseñado esta experiencia con un enfoque meticuloso en la funcionalidad y 
              la estética premium.
            </p>

            <div className="section-details">
              <div className="detail-card">
                <h3>Visión</h3>
                <p>
                  Crear un ecosistema digital sin fricciones que permita a los usuarios
                  interactuar de forma intuitiva.
                </p>
              </div>

              <div className="detail-card">
                <h3>Características</h3>
                <ul>
                  <li>Rendimiento optimizado</li>
                  <li>Diseño altamente responsivo</li>
                  <li>Integraciones dinámicas</li>
                  <li>Experiencia inmersiva</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="section-image-large stagger-enter">
            <img
              src={`https://placehold.co/1000x600/1A1A1A/FFFFFF?text=${encodeURIComponent(section.name)}&font=outfit`}
              alt={section.name}
              loading="lazy"
            />
          </div>
        </div>

        <div className="section-footer stagger-enter">
          <Link to="/" className="btn-back" style={{ borderColor: section.color, color: section.color }}>
            ← Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SectionPage;
