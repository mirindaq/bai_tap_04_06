import { API_BASE_URL, AUTH_API_PREFIX } from '../constants/api';

const parseErrorMessage = async (response) => {
  try {
    const data = await response.json();
    return data?.message || data?.error || 'Yeu cau that bai';
  } catch {
    return 'Yeu cau that bai';
  }
};

export const authApi = {
  async register(payload) {
    const response = await fetch(`${API_BASE_URL}${AUTH_API_PREFIX}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    return response.json();
  },

  async login(payload) {
    const response = await fetch(`${API_BASE_URL}${AUTH_API_PREFIX}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    return response.json();
  },
};
