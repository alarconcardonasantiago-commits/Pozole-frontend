import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import {
  inscribirParqueadero,
  ejecutarSorteo,
  obtenerResultados,
  obtenerEstadoParqueaderos,
} from '../services/api';
import './ParqueaderoPage.css';

const ParqueaderoPage = () => {
  const [apartamento, setApartamento] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
  const [resultados, setResultados] = useState([]);
  const [parqueaderos, setParqueaderos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('inscribir'); // 'inscribir' | 'resultados' | 'estado'

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleInscribir = async () => {
    if (!apartamento.trim()) {
      showStatus('error', 'Por favor ingresa un número de apartamento.');
      return;
    }
    setLoading(true);
    try {
      const data = await inscribirParqueadero(apartamento.trim());
      showStatus(data.status === 'success' ? 'success' : 'error', data.message);
      if (data.status === 'success') setApartamento('');
    } catch {
      showStatus('error', 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSorteo = async () => {
    setLoading(true);
    try {
      const data = await ejecutarSorteo();
      if (data.status === 'success') {
        showStatus('success', `Sorteo ejecutado. ${data.ganadores?.length || 0} ganador(es) asignado(s).`);
        handleVerResultados();
        handleEstado();
      } else {
        showStatus('error', data.message);
      }
    } catch {
      showStatus('error', 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerResultados = async () => {
    setActiveTab('resultados');
    setLoading(true);
    try {
      const data = await obtenerResultados();
      setResultados(data.data || []);
      if (data.status === 'error') showStatus('error', data.message);
    } catch {
      showStatus('error', 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleEstado = async () => {
    setActiveTab('estado');
    setLoading(true);
    try {
      const data = await obtenerEstadoParqueaderos();
      setParqueaderos(data.data || []);
    } catch {
      showStatus('error', 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleEstado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    anime({
      targets: '.parking-card',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 700,
      delay: anime.stagger(100),
      easing: 'easeOutQuart',
    });
  }, []);

  const APARTAMENTOS = ['101','102','201','202','301','302','401','402','501','502'];

  return (
    <main className="parking-page">
      <div className="parking-hero" style={{ background: 'linear-gradient(135deg, #dc2430 0%, #7b4397 100%)' }}>
        <h1>🅿️ Parqueadero</h1>
        <p>Gestión del sorteo de parqueaderos disponibles en el edificio.</p>
      </div>

      {status && (
        <div className={`parking-status parking-status--${status.type}`}>
          {status.type === 'success' ? '✅' : '⚠️'} {status.message}
        </div>
      )}

      <div className="parking-container">
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
            onClick={handleEstado}
            disabled={loading}
          >
            🔄 Actualizar Estado
          </button>
        </aside>

        {/* Panel principal */}
        <div className="parking-main">
          {/* Tabs */}
          <div className="parking-tabs">
            <button
              className={`parking-tab ${activeTab === 'inscribir' ? 'active' : ''}`}
              onClick={() => setActiveTab('inscribir')}
            >
              📋 Inscribir
            </button>
            <button
              className={`parking-tab ${activeTab === 'resultados' ? 'active' : ''}`}
              onClick={handleVerResultados}
            >
              🏆 Resultados
            </button>
          </div>

          {/* Panel Inscribir */}
          {activeTab === 'inscribir' && (
            <div className="parking-panel parking-card">
              <h2>Inscribir Apartamento</h2>
              <p className="panel-desc">Selecciona el apartamento a inscribir en el sorteo de parqueadero.</p>
              <div className="apt-grid">
                {APARTAMENTOS.map((apt) => (
                  <button
                    key={apt}
                    className={`apt-btn ${apartamento === apt ? 'selected' : ''}`}
                    onClick={() => setApartamento(apt)}
                  >
                    {apt}
                  </button>
                ))}
              </div>
              <div className="parking-actions">
                <button
                  className="parking-btn parking-btn--primary"
                  onClick={handleInscribir}
                  disabled={loading || !apartamento}
                >
                  {loading ? 'Procesando...' : '📝 Inscribir'}
                </button>
                <button
                  className="parking-btn parking-btn--accent"
                  onClick={handleSorteo}
                  disabled={loading}
                >
                  {loading ? 'Sorteando...' : '🎲 Ejecutar Sorteo'}
                </button>
              </div>
            </div>
          )}

          {/* Panel Resultados */}
          {activeTab === 'resultados' && (
            <div className="parking-panel parking-card">
              <h2>Resultados del Sorteo</h2>
              {resultados.length === 0 ? (
                <p className="no-data">No hay inscritos aún o no se ha ejecutado el sorteo.</p>
              ) : (
                <div className="results-table">
                  <div className="results-header">
                    <span>Apartamento</span>
                    <span>Resultado</span>
                  </div>
                  {resultados.map((r, i) => (
                    <div key={i} className={`results-row ${r.resultado.includes('GANADOR') ? 'winner' : ''}`}>
                      <span>🏠 {r.apartamento}</span>
                      <span>{r.resultado.includes('GANADOR') ? `🏆 ${r.resultado}` : '❌ ' + r.resultado}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ParqueaderoPage;
