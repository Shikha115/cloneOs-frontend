import { axiosInstance, authAxios, removeAuthToken } from './url.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const prefix = '/auth';

// Low-level API
export const authApi = () => {
  const login = (credentials) => axiosInstance.post(`${prefix}/login`, credentials);
  const register = (userData) => axiosInstance.post(`${prefix}/signup`, userData);
  const profile = () => authAxios.get(`${prefix}/profile`);
  return { login, register, profile };
};

// Compatibility export for Dashboard.jsx
export const logout = () => {
  removeAuthToken();
  window.location.href = '/login';
};

// React Query hooks
export function useProfile(options = {}) {
  const { profile } = authApi();
  return useQuery({
    queryKey: ['auth', 'profile'],
    enabled: false, // run manually (e.g., after login/register)
    queryFn: async () => {
      const res = await profile();
      return res.data?.data ?? res.data;
    },
    ...options,
  });
}

export function useLogin(options = {}) {
  const { login } = authApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await login(credentials);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      await queryClient.refetchQueries({ queryKey: ['auth', 'profile'] });
    },
    ...options,
  });
}

export function useRegister(options = {}) {
  const { register } = authApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const res = await register(userData);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      await queryClient.refetchQueries({ queryKey: ['auth', 'profile'] });
    },
    ...options,
  });
}
