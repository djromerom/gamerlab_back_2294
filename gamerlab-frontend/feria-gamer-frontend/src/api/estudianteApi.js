import api from './axios';

export const getAllEstudiantes = async () => {
  return api.get('/estudiante');
};

export const getEstudianteById = async (id) => {
  return api.get(`/estudiante/${id}`);
};

export const updateEstudiante = async (id, estudianteData) => {
  return api.patch(`/estudiante/${id}`, estudianteData);
};

export const removeEstudiante = async (id) => {
  return api.delete(`/estudiante/${id}`);
};

// Note: Creation of estudiantes is handled through equipoApi.js
// with the addIntegrantes function that posts to /equipo/{id}/add-integrante