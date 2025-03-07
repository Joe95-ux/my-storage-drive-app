'use client';

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface FileUploadProps {
  onUploadSuccess: () => void;
}

interface UploadResponse {
  _id: string;
  name: string;
  type: string;
  size: number;
  path: string;
}

type AxiosConfig = {
  headers: Record<string, string>;
  onUploadProgress: (event: { loaded: number; total?: number }) => void;
};

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post<UploadResponse>('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(event: { loaded: number; total?: number }) {
          const progress = Math.round(
            (event.loaded * 100) / (event.total || 0)
          );
          setUploadProgress(progress);
        },
      } as AxiosConfig);

      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div className="space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
        </div>
      ) : (
        <>
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {isDragActive ? 'Drop the files here' : 'Drag & drop files here'}
          </h3>
          <p className="mt-1 text-xs text-gray-500">Or click to browse</p>
        </>
      )}
    </div>
  )
} 