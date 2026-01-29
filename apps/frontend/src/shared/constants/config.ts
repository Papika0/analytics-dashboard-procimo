export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  debounceDelay: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY || '300', 10),
} as const;
