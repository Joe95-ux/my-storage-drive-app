import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '@/types';
import api from '@/lib/api';

interface StorageStats {
  used: number;
  total: number;
  files: number;
  folders: number;
}

export function useStorageStats() {
  return useQuery({
    queryKey: ['storage-stats'],
    queryFn: async () => {
      const { data } = await api.get<StorageStats>('/api/storage/stats');
      return data;
    }
  });
}

export function useCleanupStorage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ApiResponse<void>>('/api/storage/cleanup');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
} 