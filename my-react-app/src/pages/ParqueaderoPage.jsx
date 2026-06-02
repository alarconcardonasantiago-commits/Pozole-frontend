import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import { obtenerEstadoParqueaderos } from '../services/api';
import './ParqueaderoPage.css';

const ParqueaderoPage = () => {
  const [parqueaderos, setParqueaderos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null); // { spot: 'P-01' }
  const [error, setError] = useState('');

  const fetchEstado = async () => {
    setLoading(true);
    try {
      const data = await obtenerEstadoParqueaderos();
      setParqueaderos(data.data || []);
    } catch {
      setError('Error de conexión con el servidor al cargar parqueaderos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstado();
  }, []);

  const handleObtenerTiquete = () => {
    // Buscar parqueaderos libres
    const libres = parqueaderos.filter(p => p.estado === 'LIBRE');
    
    if (libres.length === 0) {
      setError('¡Lo sentimos! El parqueadero está lleno en este momento.');
      setTicket(null);
      return;
    }

    // Elegir uno aleatorio
    const randomIndex = Math.floor(Math.random() * libres.length);
    const assignedSpot = libres[randomIndex].parqueadero;

    // Actualizar el estado local para marcarlo como ocupado
    const nuevosParqueaderos = parqueaderos.map(p => 
      p.parqueadero === assignedSpot ? { ...p, estado: 'OCUPADO' } : p
    );
    setParqueaderos(nuevosParqueaderos);
    
    setTicket(assignedSpot);
    setError('');

    // Animación del ticket
    setTimeout(() => {
      anime({
        targets: '.ticket-card',
        scale: [0.8, 1],
        opacity: [0, 1],
        rotate: ['-5deg', '0deg'],
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
      });
    }, 50);
  };

  return (
    <main className="parking-page">
      <div className="parking-hero" style={{ background: 'linear-gradient(135deg, #dc2430 0%, #7b4397 100%)' }}>
        <h1>🅿️ Parqueadero Inteligente</h1>
        <p>Sistema de asignación automática de parqueo. Obtén tu tiquete al instante.</p>
      </div>

      {error && (
        <div className="parking-status parking-status--error">
          ⚠️ {error}
        </div>
      )}

      <div className="parking-container">
        {/* Panel principal */}
        <div className="parking-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div className="parking-panel parking-card" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
            <h2>Bienvenido al Edificio</h2>
            <p className="panel-desc">Presiona el botón para que el sistema te asigne un espacio de parqueo disponible.</p>
            
            <button
              className="parking-btn parking-btn--primary"
              style={{ padding: '20px 40px', fontSize: '1.2rem', margin: '20px 0', borderRadius: '50px' }}
              onClick={handleObtenerTiquete}
              disabled={loading}
            >
              {loading ? 'Cargando...' : '🎫 OBTENER TIQUETE DE PARQUEO'}
            </button>

            {ticket && (
              <div className="ticket-card" style={{ 
                marginTop: '30px', 
                padding: '30px', 
                background: 'linear-gradient(135deg, #FFDF00 0%, #FF8C00 100%)', 
                color: '#000', 
                borderRadius: '15px', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                display: 'inline-block'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Tu Parqueadero Asignado</h3>
                <div style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  {ticket}
                </div>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>Conserva este tiquete a la salida</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar de Parqueaderos */}
        <aside className="parking-sidebar">
          <h3>Estado Parqueaderos</h3>
          <div className="spots-grid">
            {parqueaderos.length > 0 ? parqueaderos.map((p) => (
              <div
                key={p.parqueadero}
                className={`spot-card ${p.estado === 'OCUPADO' ? 'spot-occupied' : 'spot-free'}`}
              >
                <span className="spot-icon">{p.estado === 'OCUPADO' ? '🔴' : '🟢'}</span>
                <span className="spot-name">{p.parqueadero}</span>
                <span className="spot-status">{p.estado}</span>
              </div>
            )) : (
              <p className="no-data">Cargando...</p>
            )}
          </div>
          <button
            className="parking-btn parking-btn--secondary"
            onClick={fetchEstado}
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            🔄 Actualizar Estado
          </button>
        </aside>

      </div>
    </main>
  );
};

export default ParqueaderoPage;
