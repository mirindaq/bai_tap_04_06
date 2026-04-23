import { API_BASE_URL, ORDER_API_PREFIX } from '../constants/api';

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

export const orderApi = {
  async createOrder(payload) {
    const response = await fetch(`${API_BASE_URL}${ORDER_API_PREFIX}`, {
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

  async getMyOrders(userId) {
    if (!userId) {
      throw new Error('Thieu userId de lay danh sach ve da dat');
    }

    const response = await fetch(`${API_BASE_URL}${ORDER_API_PREFIX}/my`, {
      method: 'GET',
      headers: {
        'X-User-Id': String(userId),
        ...buildAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    return response.json();
  },
};
