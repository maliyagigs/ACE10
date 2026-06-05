// Central configuration for API orchestration
// When deploying to external platforms like Vercel, set VITE_API_URL to your Cloud Run endpoint.

const rawUrl = import.meta.env.VITE_API_URL || '';
// Force HTTPS for all production-bound environments
const secureUrl = rawUrl.replace(/^http:/, 'https:');
export const API_BASE = secureUrl.replace(/\/$/, '');

if (rawUrl) {
  console.log(`[ACE10 Config] Using explicit API Base: ${API_BASE}`);
} else {
  console.log(`[ACE10 Config] No VITE_API_URL found, defaulting to relative paths.`);
}

export const API_ENDPOINTS = {
  getContent: `${API_BASE}/api/get-content`,
  saveContent: `${API_BASE}/api/save-content`,
  health: `${API_BASE}/api/health`
};
