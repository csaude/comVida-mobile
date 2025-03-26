import api from '../api/apiService';

export default {
  async getAll() {
    const response = await api.get('/cohorts');
    return response.data;
  },

  async getById(id) {
      const response = await api.get(`/cohorts/${id}`);
      return response.data;
  },

  async save(cohortData) {
      const response = await api.post('/cohorts', cohortData);
      return response.data;
  },

  async delete(id) {
      await api.delete(`/cohorts/${id}`);
  }
}
