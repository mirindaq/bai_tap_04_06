import { API_BASE_URL, ORCHESTRATOR_API_PREFIX } from '../constants/api';

const parseErrorMessage = async (response) => {
  try {
    const data = await response.json();
    return data?.message || data?.error || 'Yeu cau that bai';
  } catch {
    return 'Yeu cau that bai';
  }
};

const buildAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

export const orchestratorApi = {
  async bookTour(payload) {
    const response = await fetch(`${API_BASE_URL}${ORCHESTRATOR_API_PREFIX}/book-tour`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...buildAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    return response.json();
  },
};
