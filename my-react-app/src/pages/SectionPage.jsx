import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import anime from 'animejs';
import { SECTIONS } from '../constants/sections';
import './SectionPage.css';

// Las imágenes proporcionadas por el usuario para el apartamento
const APARTMENT_IMAGES = [
  'https://media.discordapp.net/attachments/1506529298125684866/1511313877407629352/31f2ba0869cc8b06786e64c571dbffc5.png?ex=6a20003b&is=6a1eaebb&hm=e3f5a0809e11236671b17158fcd1ef4873d9880d009a4d72bd6c21b313d33d18&=&format=webp&quality=lossless&width=676&height=902',
  'https://media.discordapp.net/attachments/1506529298125684866/1511313877915406416/5a0818c4c6bef5963b2c006e4ab724f6.png?ex=6a20003b&is=6a1eaebb&hm=b50f9f4669c18a5309f3c1562be3e362e125dad99fee42e95669737f6f99e479&=&format=webp&quality=lossless',
  'https://media.discordapp.net/attachments/1506529298125684866/1511313878234038402/86a4bc1733149fda21f9a71f5ff7ecf6.png?ex=6a20003b&is=6a1eaebb&hm=9f139a031da27d84c4202f829e9b761523a6dcf2eacf868c3b94ea15773381b7&=&format=webp&quality=lossless&width=721&height=901',
  'https://media.discordapp.net/attachments/1506529298125684866/1511313878590427266/dbb330522890dab89cdc880e87b80bc7.png?ex=6a20003b&is=6a1eaebb&hm=3a649feed2c76ad232b3128e1d51c5af9f0e40c45bdbca0fedf3d2e27d3a5ed7&=&format=webp&quality=lossless&width=601&height=902',
  'https://media.discordapp.net/attachments/1506529298125684866/1511314073516507166/57168d29d8c27cc43847b5cf362e8f58.png?ex=6a200069&is=6a1eaee9&hm=e278a2e26e9d223cbe00f6615f76959e3d421db5aa35c2d66c59d85306ead166&=&format=webp&quality=lossless',
  'https://media.discordapp.net/attachments/1506529298125684866/1511314074535723098/c0d1db6b8589053d78a83006852c2bb1.png?ex=6a20006a&is=6a1eaeea&hm=9debb5d7c09d605ddd6033da2c2118ce60e2215b7bdd8756037238f09f4c6c6a&=&format=webp&quality=lossless',
  'https://media.discordapp.net/attachments/1506529298125684866/1511314075295154366/8db4f0155f51db3c068caa40d0f6b27a.png?ex=6a20006a&is=6a1eaeea&hm=68d0a2dbfc0abdf81aa28cdddd2e86bd87d5384c8d7ad3af54603b6155fdd484&=&format=webp&quality=lossless'
];

const SectionPage = () => {
  const { path } = useParams();
  const section = SECTIONS.find((s) => s.path === path);
  const pageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!section || !pageRef.current) return;

    const elements = pageRef.current.querySelectorAll('.stagger-enter');
    anime.set(elements, { opacity: 0, translateY: 40 });
    anime({
      targets: elements,
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1000,
      delay: anime.stagger(100),
      easing: 'easeOutExpo',
    });
  }, [path, section]);

  if (!section) {
    return (
      <main className="section-page-not-found">
        <h1>Página no encontrada</h1>
        <p>Lo sentimos, este apartamento no existe.</p>
        <Link to="/" className="btn-back">← Volver al Inicio</Link>
      </main>
    );
  }

  // Extraer el número del piso para generar el nombre del apartamento (Ej: Piso 6 -> Apartamento 601)
  const floorNumberMatch = section.name.match(/\d+/);
  const floorNum = floorNumberMatch ? floorNumberMatch[0] : '1';
  const aptName = `Apartamento ${floorNum}01`;

  return (
    <main className="section-page" ref={pageRef}>
      {/* Hero Section */}
      <div 
        className="apt-hero" 
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(20,20,22,1) 100%), url(${APARTMENT_IMAGES[0]})`
        }}
      >
        <div className="apt-hero-content">
          <span className="welcome-label stagger-enter" style={{ color: section.color }}>BIENVENIDO A TU HOGAR</span>
          <h1 className="stagger-enter">{aptName}</h1>
          <p className="stagger-enter">
            Un espacio diseñado para ofrecerte el máximo confort, tecnología y lujo. 
            Disfruta de una experiencia inigualable en tu nuevo hogar.
          </p>
          <div className="apt-badges stagger-enter">
            <span className="badge">✨ Domótica Integrada</span>
            <span className="badge">🌡️ Climatización Inteligente</span>
            <span className="badge">🔒 Seguridad 24/7</span>
          </div>
        </div>
      </div>

      {/* Main Content Gallery */}
      <div className="apt-container">
        <div className="apt-header stagger-enter">
          <h2>Galería del Apartamento</h2>
          <p>Explora cada rincón de este magnífico espacio de diseño moderno.</p>
        </div>

        <div className="apt-gallery">
          {APARTMENT_IMAGES.slice(1).map((img, index) => (
            <div key={index} className={`gallery-item item-${index} stagger-enter`}>
              <img src={img} alt={`Vista del apartamento ${index + 1}`} loading="lazy" />
              <div className="gallery-overlay">
                <span>Explorar Espacio</span>
              </div>
            </div>
          ))}
        </div>

        <div className="apt-footer stagger-enter">
          <Link
            to="/"
            className="apt-btn-back"
            style={{ background: section.gradient }}
          >
            ← Volver al Lobby
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SectionPage;
