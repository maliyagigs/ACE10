// Central configuration for API orchestration
// When deploying to external platforms like Vercel, set VITE_API_URL to your Cloud Run endpoint.

export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const API_ENDPOINTS = {
  getContent: `${API_BASE}/api/get-content`,
  saveContent: `${API_BASE}/api/save-content`,
  health: `${API_BASE}/api/health`
};
