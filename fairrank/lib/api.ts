/**
 * API Client Utilities
 * Helper functions for frontend API calls
 */

import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

let axiosInstance: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: API_URL,
    });

    // Add token to headers
    axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  return axiosInstance;
}

/**
 * Authentication API calls
 */
export const authAPI = {
  signup: (data: any) => getApiClient().post('/auth/signup', data),
  login: (data: any) => getApiClient().post('/auth/login', data),
};

/**
 * Student API calls
 */
export const studentAPI = {
  getProfile: (userId: string) =>
    getApiClient().get(`/students/profile?userId=${userId}`),
  updateProfile: (data: any) =>
    getApiClient().put('/students/profile', data),
  createAssessment: (data: any) =>
    getApiClient().post('/students/assessments', data),
};

/**
 * Recruiter API calls
 */
export const recruiterAPI = {
  createRole: (data: any) =>
    getApiClient().post('/recruiters/roles', data),
  getRoles: (recruiterId: string) =>
    getApiClient().get(`/recruiters/roles?recruiterId=${recruiterId}`),
  updateRole: (roleId: string, data: any) =>
    getApiClient().put(`/recruiters/roles/${roleId}`, data),
};

/**
 * Application API calls
 */
export const applicationAPI = {
  createApplication: (data: any) =>
    getApiClient().post('/applications', data),
  getApplications: (query: any) => {
    const params = new URLSearchParams(query).toString();
    return getApiClient().get(`/applications?${params}`);
  },
  updateApplicationStatus: (appId: string, status: string) =>
    getApiClient().patch(`/applications/${appId}`, { status }),
};

/**
 * Error handler utility
 */
export function handleApiError(error: any): string {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An error occurred';
}
