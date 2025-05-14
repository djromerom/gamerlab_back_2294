import api from './axios';

export const getAllEquipos = async (params = {}) => {
  return api.get('/equipo', { params });
};

export const getEquipoById = async (id) => {
  return api.get(`/equipo/${id}`);
};

export const createEquipo = async (equipoData) => {
  return api.post('/equipo', equipoData);
};

export const updateEquipo = async (id, equipoData) => {
  return api.patch(`/equipo/${id}`, equipoData);
};

export const addIntegrantes = async (equipoId, integrantesData) => {
  return api.post(`/equipo/${equipoId}/add-integrante`, integrantesData);
};

export const confirmarEstudiante = async (token) => {
  return api.get('/equipo/confirmar', { params: { token } });
};