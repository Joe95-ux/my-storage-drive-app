export interface File {
  _id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  isFolder: boolean;
  owner: string;
  parent?: string;
  shared: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  storageUsed: number;
  storageLimit: number;
}

export interface ShareLink {
  _id: string;
  file: string;
  token: string;
  permission: 'view' | 'edit';
  isPublic: boolean;
  createdBy: string;
  expiresAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SearchFilters {
  type?: 'all' | 'image' | 'document' | 'video' | 'audio';
  dateRange?: 'all' | 'today' | 'week' | 'month' | 'year';
  sortBy?: 'name' | 'date' | 'size' | 'type';
  sortOrder?: 'asc' | 'desc';
} 