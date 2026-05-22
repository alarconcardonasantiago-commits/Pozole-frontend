import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Pozole Frontend</h3>
          <p>Innovación y diseño premium para el futuro del desarrollo web. Creando experiencias que cautivan.</p>
        </div>
        
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Email: hola@pozole.com</p>
          <p>Teléfono: +1 (555) 123-4567</p>
          <p>Dirección: Av. Tecnológica 123, Ciudad Digital</p>
        </div>
        
        <div className="footer-section">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a href="/#section-1">Acerca de</a></li>
            <li><a href="/#section-2">Servicios</a></li>
            <li><a href="/#section-3">Proyectos</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Pozole Frontend. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
