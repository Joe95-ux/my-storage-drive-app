'use client';

import { Trash2, FolderInput, Download } from 'lucide-react';
import api from '@/lib/api';

interface BulkOperationsBarProps {
  selectedFiles: string[];
  onClear: () => void;
  onDelete: () => void;
}

export default function BulkOperationsBar({
  selectedFiles,
  onClear,
  onDelete,
}: BulkOperationsBarProps) {
  const handleBulkDelete = async () => {
    try {
      await api.post('/api/files/bulk-delete', {
        fileIds: selectedFiles
      });
      onDelete();
      onClear();
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };

  const handleBulkDownload = async () => {
    try {
      const { data } = await api.post<Blob>('/api/files/bulk-download', {
        fileIds: selectedFiles
      }, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'files.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading files:', error);
    }
  };

  const handleBulkMove = async () => {
    // Implement move to folder functionality
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {selectedFiles.length} items selected
          </span>
          <button
            onClick={onClear}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleBulkDownload}
            className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100"
          >
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>

          <button
            onClick={handleBulkMove}
            className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100"
          >
            <FolderInput className="h-5 w-5" />
            <span>Move</span>
          </button>

          <button
            onClick={handleBulkDelete}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 rounded hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
} 