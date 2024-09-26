
import { useAuthStore } from '@/app/store/Auth';

export async function apiRequest(url, options = {}) {
  const { getAccessToken, clearUser } = useAuthStore.getState();

  const token = await getAccessToken();
  if (!token) {
    clearUser();
    throw new Error('Authentication required');

  }

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (response.status === 401) {
    clearUser();
    throw new Error('Authentication expired');
  }

  return response;
}