import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/types';
import api from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<AuthResponse>('/api/auth/login', credentials);
      return data;
    }
  });
}

export function useRegister() {
  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: async (userData: RegisterData) => {
      const { data } = await api.post<AuthResponse>('/api/auth/register', userData);
      return data;
    }
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, Partial<User>>({
    mutationFn: async (userData: Partial<User>) => {
      const { data } = await api.patch<User>('/api/auth/profile', userData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
    }
  });
} 