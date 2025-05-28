import axios from 'axios';

// Create axios instance with base URL
export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = axios.create({
  baseURL: import.meta.env.VITE_QUALITY_SERVICE_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const userService = {
  getAll: () => apiAuth.get('/api/users'),
  getById: (id: string) => apiAuth.get(`/api/users/${id}`),
  create: (data: any) => apiAuth.post('/api/users', data),
  update: (id: string, data: any) => apiAuth.put(`/api/users/${id}`, data),
  delete: (id: string) => apiAuth.delete(`/api/users/${id}`),
};

export const softwareService = {
  getAll: () => api.get('/software'),
  getById: (id: string) => api.get(`/software/${id}`),
  create: (data: any) => api.post('/software', data),
  update: (id: string, data: any) => api.put(`/software/${id}`, data),
  delete: (id: string) => api.delete(`/software/${id}`),
  getParticipants: (id: string) => api.get(`/software/${id}/participants`),
  addParticipant: (id: string, userId: string) => api.post(`/software/${id}/participants`, { userId }),
  removeParticipant: (id: string, userId: string) => api.delete(`/software/${id}/participants/${userId}`),
};

export const standardService = {
  getAll: () => api.get('/standards'),
  getById: (id: string) => api.get(`/standards/${id}`),
  create: (data: any) => api.post('/standards', data),
  update: (id: string, data: any) => api.put(`/standards/${id}`, data),
  delete: (id: string) => api.delete(`/standards/${id}`),
  getParameters: (id: string) => api.get(`/standards/${id}/parameters`),
  createParameter: (id: string, data: any) => api.post(`/standards/${id}/parameters`, data),
  updateParameter: (id: string, parameterId: string, data: any) => 
    api.put(`/standards/${id}/parameters/${parameterId}`, data),
  deleteParameter: (id: string, parameterId: string) => 
    api.delete(`/standards/${id}/parameters/${parameterId}`),
  getSubcategories: (id: string, parameterId: string) => 
    api.get(`/standards/${id}/parameters/${parameterId}/subcategories`),
  createSubcategory: (id: string, parameterId: string, data: any) => 
    api.post(`/standards/${id}/parameters/${parameterId}/subcategories`, data),
  updateSubcategory: (id: string, parameterId: string, subcategoryId: string, data: any) => 
    api.put(`/standards/${id}/parameters/${parameterId}/subcategories/${subcategoryId}`, data),
  deleteSubcategory: (id: string, parameterId: string, subcategoryId: string) => 
    api.delete(`/standards/${id}/parameters/${parameterId}/subcategories/${subcategoryId}`),
};

export const evaluationService = {
  getAll: () => api.get('/evaluations'),
  getById: (id: string) => api.get(`/evaluations/${id}`),
  create: (data: any) => api.post('/evaluations', data),
  update: (id: string, data: any) => api.put(`/evaluations/${id}`, data),
  delete: (id: string) => api.delete(`/evaluations/${id}`),
  getParameterEvaluations: (id: string) => api.get(`/evaluations/${id}/parameters`),
  createParameterEvaluation: (id: string, data: any) => api.post(`/evaluations/${id}/parameters`, data),
  updateParameterEvaluation: (id: string, paramEvalId: string, data: any) => 
    api.put(`/evaluations/${id}/parameters/${paramEvalId}`, data),
  getResults: (id: string) => api.get(`/evaluations/${id}/results`),
  getParameterResults: (id: string, paramEvalId: string) => 
    api.get(`/evaluations/${id}/parameters/${paramEvalId}/results`),
};