import api from '../api/apiService';

export default {
  async getAll() {
      const response = await api.get('/triangulations');
      return response.data;
  },

  async getById(id) {
      const response = await api.get(`/triangulations/${id}`);
      return response.data;
  },

  async save(triangulationData) {
      const response = await api.post('/triangulations', triangulationData);
      return response.data;
  },

  async delete(id) {
      await api.delete(`/triangulations/${id}`);
  }

}
