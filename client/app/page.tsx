'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FileList from '@/components/FileList';
import FileUpload from '@/components/FileUpload';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface File {
  _id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  isFolder: boolean;
  createdAt: string;
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  const fetchFiles = useCallback(async () => {
    try {
      const { data } = await api.get<File[]>('/api/files', {
        params: { folderId: currentFolder }
      });
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }, [currentFolder]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchFiles();
    }
  }, [user, loading, currentFolder, router, fetchFiles]);

  const handleCreateFolder = async (name: string) => {
    try {
      const { data } = await api.post('/api/files/folder', {
        name,
        parentId: currentFolder
      });
      setFiles((prev: File[]) => [data as File, ...prev]);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">My Drive</h1>
        <div className="flex items-center space-x-4">
          <FileUpload onUploadSuccess={fetchFiles} />
          <button
            onClick={() => {
              const name = prompt('Enter folder name:');
              if (name) handleCreateFolder(name);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Folder
          </button>
        </div>
      </div>
      <FileList
        files={files}
        onFolderClick={setCurrentFolder}
        onFileDelete={fetchFiles}
      />
    </div>
  );
}
