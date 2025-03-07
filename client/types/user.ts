export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  storageUsed: number;
  storageLimit: number;
} 