import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import { loginAcceso } from '../services/api';
import './AccessModal.css';

const AccessModal = ({ section, onClose }) => {
  const [apartamento, setApartamento] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const PISO_APTS = {
    'piso-1': ['101', '102'],
    'piso-2': ['201', '202'],
    'piso-3': ['301', '302'],
    'piso-4': ['401', '402'],
    'piso-5': ['501', '502'],
    'piso-6': ['501', '502'],
  };
  const aptOptions = PISO_APTS[section?.path] || ['101','102','201','202','301','302','401','402','501','502'];

  useEffect(() => {
    anime({ targets: overlayRef.current, opacity: [0, 1], duration: 300, easing: 'easeOutQuad' });
    anime({ targets: cardRef.current, opacity: [0, 1], translateY: [30, 0], scale: [0.96, 1], duration: 450, easing: 'easeOutExpo' });
  }, []);

  const closeWithAnimation = (callback) => {
    anime({ targets: cardRef.current, opacity: [1, 0], translateY: [0, 20], scale: [1, 0.96], duration: 300, easing: 'easeInQuad' });
    anime({ targets: overlayRef.current, opacity: [1, 0], duration: 350, delay: 100, easing: 'easeInQuad', complete: callback });
  };

  const shakeCard = () => {
    anime({ targets: cardRef.current, translateX: [-10, 10, -8, 8, -5, 5, 0], duration: 500, easing: 'easeInOutSine' });
  };

  const handleAccess = async () => {
    if (!apartamento) { setError('Selecciona un apartamento.'); return; }
    if (!code.trim()) { setError('Ingresa tu código de acceso.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await loginAcceso(1, apartamento, code);
      if (data.status === 'success') {
        closeWithAnimation(() => { onClose(); navigate(`/${section.path}`); });
      } else {
        setError(data.message || 'Acceso denegado.');
        shakeCard();
      }
    } catch {
      setError('Error de conexión con el servidor.');
      shakeCard();
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    if (!apartamento) { setError('Selecciona un apartamento para continuar como invitado.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await loginAcceso(2, apartamento);
      if (data.status === 'success') {
        closeWithAnimation(() => { onClose(); navigate(`/${section.path}`); });
      } else {
        setError(data.message || 'No hay invitación activa para este apartamento.');
        shakeCard();
      }
    } catch {
      setError('Error de conexión con el servidor.');
      shakeCard();
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => { if (e.target === overlayRef.current) closeWithAnimation(onClose); };
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleAccess(); if (e.key === 'Escape') closeWithAnimation(onClose); };

  if (!section) return null;

  return (
    <div className="access-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="access-card" ref={cardRef}>
        <div className="access-color-bar" style={{ background: section.gradient }} />

        <button className="access-close-btn" onClick={() => closeWithAnimation(onClose)} aria-label="Cerrar">✕</button>

        <div className="access-header">
          <div className="access-icon">🔐</div>
          <h2 className="access-title">Acceso Restringido</h2>
          <p className="access-section-name" style={{ color: section.color }}>{section.name}</p>
          <p className="access-subtitle">
            Selecciona tu apartamento e ingresa tu código, o entra como invitado (requiere invitación registrada).
          </p>
        </div>

        <div className="access-form">
          <label className="access-label">Apartamento</label>
          <div className="access-apt-grid">
            {aptOptions.map((apt) => (
              <button
                key={apt}
                type="button"
                className={`access-apt-btn ${apartamento === apt ? 'selected' : ''}`}
                style={apartamento === apt ? { background: section.gradient, borderColor: 'transparent' } : {}}
                onClick={() => { setApartamento(apt); setError(''); }}
              >
                {apt}
              </button>
            ))}
          </div>

          <label className="access-label" htmlFor="access-code-input" style={{ marginTop: '20px' }}>
            Código de Acceso
          </label>
          <input
            id="access-code-input"
            type="password"
            className={`access-input ${error ? 'has-error' : ''}`}
            placeholder="••••"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            autoFocus
            maxLength={20}
            disabled={loading}
          />
          {error && <p className="access-error">{error}</p>}
        </div>

        <div className="access-actions">
          <button
            className="access-btn-primary"
            style={{ background: section.gradient }}
            onClick={handleAccess}
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Ingresar como Residente'}
          </button>
          <button className="access-btn-guest" onClick={handleGuest} disabled={loading}>
            {loading ? 'Verificando...' : '🎫 Soy invitado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessModal;
