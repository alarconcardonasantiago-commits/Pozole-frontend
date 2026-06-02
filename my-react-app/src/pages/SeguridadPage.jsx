import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import {
  autorizarAccesoSeguridad,
  monitorearZona,
  escanearGeneral,
  obtenerEstadoSensores,
  obtenerHistorial,
} from '../services/api';
import './SeguridadPage.css';

const ZONAS = [
  { id: 1, label: 'Piso 1' },
  { id: 2, label: 'Piso 2' },
  { id: 3, label: 'Piso 3' },
  { id: 4, label: 'Piso 4' },
  { id: 5, label: 'Piso 5' },
];

const alertColor = (tipo) => {
  if (!tipo) return '';
  if (tipo.toLowerCase().includes('persona')) return 'alert-persona';
  if (tipo.toLowerCase().includes('plaga')) return 'alert-plaga';
  if (tipo.toLowerCase().includes('anormal')) return 'alert-anormal';
  if (tipo.toLowerCase().includes('brusco')) return 'alert-brusco';
  return 'alert-ok';
};

const SeguridadPage = () => {
  const [autorizado, setAutorizado] = useState(false);
  const [sensores, setSensores] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(1);
  const [temperatura, setTemperatura] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('monitorear');

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 4500);
  };

  const fetchEstado = async () => {
    try {
      const data = await obtenerEstadoSensores();
      setSensores(data.data || []);
    } catch { /* noop */ }
  };

  const fetchHistorial = async () => {
    try {
      const data = await obtenerHistorial();
      setHistorial(data.data || []);
    } catch { /* noop */ }
  };

  const handleEscaneoGeneralSilent = async () => {
    try {
      const data = await escanearGeneral();
      if (data.status === 'success') {
        await fetchEstado();
        await fetchHistorial();
      }
    } catch { /* noop */ }
  };

  useEffect(() => {
    fetchEstado();
    fetchHistorial();
    anime({
      targets: '.seg-card',
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 600,
      delay: anime.stagger(80),
      easing: 'easeOutQuart',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intervalo aleatorio cada 3 segundos si está autorizado
  useEffect(() => {
    let interval;
    if (autorizado) {
      interval = setInterval(() => {
        handleEscaneoGeneralSilent();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autorizado]);

  const handleAutorizar = async () => {
    setLoading(true);
    try {
      const data = await autorizarAccesoSeguridad();
      if (data.status === 'success') {
        setAutorizado(true);
        showStatus('success', 'Acceso autorizado. Ya puedes monitorear las zonas.');
      }
    } catch {
      showStatus('error', 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleMonitorear = async () => {
    const temp = parseFloat(temperatura);
    if (isNaN(temp)) {
      showStatus('error', 'Ingresa una temperatura válida.');
      return;
    }
    setLoading(true);
    try {
      const data = await monitorearZona(zonaSeleccionada, temp);
      if (data.status === 'success') {
        const alertas = data.alertas?.join(', ') || 'Sin alertas';
        showStatus('success', `Zona monitoreada. Alertas: ${alertas}`);
        setTemperatura('');
        await fetchEstado();
        await fetchHistorial();
      } else {
        showStatus('error', data.message);
      }
    } catch {
      showStatus('error', 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleEscaneoGeneral = async () => {
    setLoading(true);
    try {
      const data = await escanearGeneral();
      if (data.status === 'success') {
        showStatus('success', `Escaneo general completado en ${data.resultados?.length || 0} zonas.`);
        await fetchEstado();
        await fetchHistorial();
      } else {
        showStatus('error', data.message);
      }
    } catch {
      showStatus('error', 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const tempClass = (temp) => {
    if (temp >= 35 && temp <= 40) return 'temp-persona';
    if (temp >= 28 && temp < 35) return 'temp-plaga';
    if (temp > 40) return 'temp-anormal';
    return 'temp-ok';
  };

  return (
    <main className="seg-page">
      <div className="seg-hero" style={{ background: 'linear-gradient(135deg, #71B280 0%, #134E5E 100%)' }}>
        <h1>🔒 Seguridad Térmica</h1>
        <p>Sistema de detección y monitoreo térmico del edificio.</p>
        {!autorizado && (
          <button className="seg-auth-btn" onClick={handleAutorizar} disabled={loading}>
            {loading ? 'Autorizando...' : '🔑 Autorizar Acceso al Sistema'}
          </button>
        )}
        {autorizado && <span className="seg-authorized-badge">✅ Sistema Autorizado</span>}
      </div>

      {status && (
        <div className={`seg-status seg-status--${status.type}`}>
          {status.type === 'success' ? '✅' : '⚠️'} {status.message}
        </div>
      )}

      <div className="seg-container">
        {/* Sensores sidebar */}
        <aside className="seg-sidebar">
          <div className="seg-sidebar-header">
            <h3>Estado Sensores</h3>
            <button className="seg-refresh-btn" onClick={fetchEstado} title="Actualizar">🔄</button>
          </div>
          <div className="sensors-list">
            {sensores.length === 0 ? (
              <p className="no-data">Cargando sensores...</p>
            ) : sensores.map((s) => (
              <div key={s.id_sensor} className={`sensor-item ${s.alerta ? 'sensor-alerta' : ''}`}>
                <div className="sensor-top">
                  <span className="sensor-zona">{s.zona}</span>
                  {s.alerta && <span className="sensor-alert-dot">🔴</span>}
                </div>
                <div className={`sensor-temp ${tempClass(s.temperatura_detectada)}`}>
                  {s.temperatura_detectada.toFixed(1)}°C
                </div>
                <div className="sensor-meta">
                  Anterior: {s.temperatura_anterior.toFixed(1)}°C &bull; Presencia: {s.presencia ? 'Sí' : 'No'}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main panel */}
        <div className="seg-main">
          {/* Removed Monitorear tab completely as requested */}
          <div className="seg-panel seg-card">
              <h2>Historial de Detecciones</h2>
              {historial.length === 0 ? (
                <p className="no-data">No hay detecciones registradas aún.</p>
              ) : (
                <div className="hist-table">
                  <div className="hist-header">
                    <span>#</span>
                    <span>Zona</span>
                    <span>Temperatura</span>
                    <span>Tipo de Alerta</span>
                  </div>
                  {[...historial].reverse().map((h, i) => (
                    <div key={i} className={`hist-row ${alertColor(h.tipo_alerta)}`}>
                      <span>{historial.length - i}</span>
                      <span>{h.zona}</span>
                      <span>{h.temperatura.toFixed(1)}°C</span>
                      <span>{h.tipo_alerta}</span>
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

export default SeguridadPage;
