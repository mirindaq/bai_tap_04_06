const stripTrailingSlash = (value) => value.replace(/\/+$/, '');

export const API_BASE_URL = stripTrailingSlash(
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8085/orchestrator-service'
);

export const AUTH_API_PREFIX = '';
export const TOUR_API_PREFIX = '/tours';
export const ORCHESTRATOR_API_PREFIX = '';
