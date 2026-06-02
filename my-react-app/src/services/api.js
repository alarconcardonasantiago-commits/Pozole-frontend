/*
 * ============================================================================
 * ARCHIVO: api.js (Frontend - JavaScript)
 * DESCRIPCIÓN: Centraliza la comunicación con el servidor (backend).
 * HERRAMIENTAS: Función nativa 'fetch' de JavaScript.
 * FUNCIÓN: Contiene todas las funciones que envían y reciben datos del backend
 * a través de internet (Cloudflare Tunnel).
 * ============================================================================
 */

// Centralized API service for the Pozole Backend
// Change this URL to your Render deployment URL when deployed
// Usamos la URL que Cloudflare nos da (configurada en Vercel)
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

// Helper function for fetch requests
const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json();
  return data;
};

// ========== Control de Acceso ==========
export const loginAcceso = (tipo_usuario, apartamento, codigo_acceso = '') =>
  apiFetch('/api/acceso/login', {
    method: 'POST',
    body: JSON.stringify({ tipo_usuario, apartamento, codigo_acceso }),
  });

export const registrarInvitacion = (apartamento) =>
  apiFetch('/api/acceso/invitacion', {
    method: 'POST',
    body: JSON.stringify({ apartamento }),
  });

// ========== Parqueadero ==========
export const inscribirParqueadero = (apartamento) =>
  apiFetch('/api/parqueadero/inscribir', {
    method: 'POST',
    body: JSON.stringify({ apartamento }),
  });

export const ejecutarSorteo = () =>
  apiFetch('/api/parqueadero/sorteo', { method: 'POST' });

export const obtenerResultados = () =>
  apiFetch('/api/parqueadero/resultados');

export const obtenerEstadoParqueaderos = () =>
  apiFetch('/api/parqueadero/estado');

export const resetearParqueadero = () =>
  apiFetch('/api/parqueadero/reset', { method: 'POST' });

// ========== Seguridad Termica ==========
export const autorizarAccesoSeguridad = () =>
  apiFetch('/api/seguridad/autorizar', { method: 'POST' });

export const monitorearZona = (id_zona, temperatura) =>
  apiFetch('/api/seguridad/monitorear', {
    method: 'POST',
    body: JSON.stringify({ id_zona, temperatura }),
  });

export const escanearGeneral = () =>
  apiFetch('/api/seguridad/escanear_general', { method: 'POST' });

export const obtenerEstadoSensores = () =>
  apiFetch('/api/seguridad/estado');

export const obtenerHistorial = () =>
  apiFetch('/api/seguridad/historial');
