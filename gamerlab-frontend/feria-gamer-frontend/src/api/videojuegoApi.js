import api from './axios';

export const getAllVideojuegos = async (params = {}) => {
  return api.get('/videojuego', { params });
};

export const getVideojuegoById = async (id) => {
  return api.get(`/videojuego/${id}`);
};

export const createVideojuego = async (videojuegoData) => {
  return api.post('/videojuego', videojuegoData);
};

export const updateVideojuego = async (id, videojuegoData) => {
  return api.patch(`/videojuego/${id}`, videojuegoData);
};