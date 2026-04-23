import { API_BASE_URL, TOUR_API_PREFIX } from '../constants/api';

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

export const tourApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}${TOUR_API_PREFIX}`, {
      method: 'GET',
      headers: {
        ...buildAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    return response.json();
  },
};
