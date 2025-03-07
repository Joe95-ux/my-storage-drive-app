import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { File, ApiResponse, SearchFilters } from '@/types';
import api from '@/lib/api';

export function useFiles(folderId: string | null) {
  return useQuery({
    queryKey: ['files', folderId],
    queryFn: async () => {
      const { data } = await api.get<File[]>('/api/files', {
        params: { folderId }
      });
      return data;
    }
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post<File>('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const { data } = await api.delete<ApiResponse<void>>(`/api/files/${fileId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useSearchFiles() {
  return useMutation({
    mutationFn: async (params: SearchFilters & { query: string }) => {
      const { data } = await api.get<File[]>('/api/files/search', { params });
      return data;
    }
  });
} 