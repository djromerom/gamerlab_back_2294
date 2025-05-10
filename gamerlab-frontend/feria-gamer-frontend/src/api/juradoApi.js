import api from './axios';

export const getAllJurados = async () => {
  return api.get('/jurado');
};

export const getJuradoById = async (id) => {
  return api.get(`/jurado/${id}`);
};

export const createJurado = async (juradoData) => {
  return api.post('/jurado', juradoData);
};

export const updateJurado = async (id, juradoData) => {
  return api.patch(`/jurado/${id}`, juradoData);
};

export const deleteJurado = async (id) => {
  return api.delete(`/jurado/${id}`);
};

export const confirmarJurado = async (token) => {
  return api.get(`/jurado/confirmar/${token}`);
};

export const reenviarInvitacion = async (id) => {
  return api.patch(`/jurado/${id}/reenviar-invitacion`);
};

export const asignarVideojuego = async (juradoId, videojuegoId) => {
  return api.post(`/jurado/${juradoId}/asignar-videojuego/${videojuegoId}`);
};

export const eliminarAsignacion = async (juradoId, videojuegoId) => {
  return api.delete(`/jurado/${juradoId}/eliminar-asignacion/${videojuegoId}`);
};