import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { config } from '@shared/constants/config';
import { parseApiError } from './errors';

/**
 * Configured Axios instance for API requests
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Log original error for debugging
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error: No response received');
    } else {
      console.error('Request Error:', error.message);
    }

    // Parse and throw structured error
    const apiError = parseApiError(error);
    return Promise.reject(apiError);
  }
);

export { apiClient };
