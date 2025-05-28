import axios, { AxiosInstance } from 'axios';

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

// Add request interceptor to include the auth token for both instances
const addAuthInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
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
};

addAuthInterceptor(api);
addAuthInterceptor(apiAuth);

// Add response interceptor to handle errors for both instances
const addErrorInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
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
};

addErrorInterceptor(api);
addErrorInterceptor(apiAuth);

// 🔐 AUTH SERVICE ENDPOINTS
export const authService = {
  login: (data: any) => apiAuth.post('/auth/login', data),
  register: (data: any) => apiAuth.post('/auth/register', data),
  profile: () => apiAuth.get('/auth/profile'),
  health: () => apiAuth.get('/auth/health'),
};

export const userService = {
  getAll: () => apiAuth.get('/users/all'),
  getById: (id: string) => apiAuth.get(`/users/${id}`),
  create: (data: any) => apiAuth.post('/auth/register', data),
  update: (id: string, data: any) => apiAuth.put(`/users/${id}`, data),
  delete: (id: string) => apiAuth.delete(`/users/${id}`),
};

export const activityService = {
  getLogs: () => apiAuth.get('/activity/logs'),
};

// ⚡ QUALITY SERVICE ENDPOINTS
export const softwareService = {
  getAll: () => api.get('/software/list'),
  getById: (id: string) => api.get(`/software/${id}`),
  create: (data: any) => api.post('/software/register', data),
  update: (id: string, data: any) => api.put(`/software/${id}`, data),
  delete: (id: string) => api.delete(`/software/${id}`),
};



export const participantService = {
  getAll: () => api.get('/participant/list'),
  getBySoftware: (softwareId: string) => api.get(`/participant/software/${softwareId}`),
  getById: (id: string) => api.get(`/participant/${id}`),
  create: (data: any) => api.post('/participant/register', data),
  update: (id: string, data: any) => api.put(`/participant/${id}`, data),
  delete: (id: string) => api.delete(`/participant/${id}`),
};

export const standardService = {
  getAll: () => api.get('/standard/list'),
  getById: (id: string) => api.get(`/standard/${id}`),
  create: (data: any) => api.post('/standard/create', data),
  update: (id: string, data: any) => api.put(`/standard/${id}`, data),
  delete: (id: string) => api.delete(`/standard/${id}`),
};

export const parameterService = {
  getAll: () => api.get('/parameter/list'),
  getByStandard: (standardId: string) => api.get(`/parameter/standard/${standardId}`),
  getById: (id: string) => api.get(`/parameter/${id}`),
  create: (data: any) => api.post('/parameter/create', data),
  update: (id: string, data: any) => api.put(`/parameter/${id}`, data),
  delete: (id: string) => api.delete(`/parameter/${id}`),
};

export const subcategoryService = {
  getAll: () => api.get('/subcategory/list'),
  getByParameter: (parameterId: string) => api.get(`/subcategory/parameter/${parameterId}`),
  getById: (id: string) => api.get(`/subcategory/${id}`),
  create: (data: any) => {
    // Mapear parameter_id a param_id para el backend
    // Solo enviar campos que el backend acepta
    const backendData = {
      param_id: data.parameter_id,
      name: data.name,
      description: data.description
    };
    return api.post('/subcategory/create', backendData);
  },
  update: (id: string, data: any) => api.put(`/subcategory/${id}`, data),
  delete: (id: string) => api.delete(`/subcategory/${id}`),
};

export const assessmentService = {
  getAll: () => api.get('/assessment/assessments'),
  create: (data: any) => api.post('/assessment/assessments', data),
  getById: (id: string) => api.get(`/assessment/assessments/${id}`),
  update: (id: string, data: any) => api.put(`/assessment/assessments/${id}`, data),
  delete: (id: string) => api.delete(`/assessment/assessments/${id}`),
  getBySoftware: (softwareId: string) => api.get(`/assessment/assessments/software/${softwareId}`),
  getByStandard: (standardId: string) => api.get(`/assessment/assessments/standard/${standardId}`),
  getSoftwareSummary: (softwareId: string) => api.get(`/assessment/assessments/software/${softwareId}/summary`),
};

export const classificationService = {
  getAll: () => api.get('/classification/classifications'),
  create: (data: any) => api.post('/classification/classifications', data),
  getById: (id: string) => api.get(`/classification/classifications/${id}`),
  update: (id: string, data: any) => api.put(`/classification/classifications/${id}`, data),
  delete: (id: string) => api.delete(`/classification/classifications/${id}`),
  getByScore: (score: number) => api.get(`/classification/classifications/score/${score}`),
};

export const resultService = {
  create: (data: any) => api.post('/result/results', data),
  getById: (id: string) => api.get(`/result/results/${id}`),
  update: (id: string, data: any) => api.put(`/result/results/${id}`, data),
  delete: (id: string) => api.delete(`/result/results/${id}`),
  getByAssessment: (assessmentId: string) => api.get(`/result/results/assessment/${assessmentId}`),
};

export const reportService = {
  generateAssessmentReport: (assessmentId: string) => {
    return api.get(`/report/reports/assessment/${assessmentId}`, {
      responseType: 'blob'
    });
  },
  generateSoftwareReport: (softwareId: string) => {
    return api.get(`/report/reports/software/${softwareId}`, {
      responseType: 'blob'
    });
  },
};

// Legacy aliases for backward compatibility (deprecated - use specific services above)
export const evaluationService = assessmentService;