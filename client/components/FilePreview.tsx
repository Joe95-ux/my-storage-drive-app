'use client';

import { X, Download } from 'lucide-react';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => <div>Loading PDF viewer...</div>
});

interface FilePreviewProps {
  file: {
    _id: string;
    name: string;
    type: string;
    path: string;
  };
  onClose: () => void;
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  const isPDF = file.type === 'application/pdf';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl mx-4 relative">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <h3 className="text-lg font-medium dark:text-gray-100">{file.name}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(file.path, '_blank')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <Download className="h-5 w-5 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <X className="h-5 w-5 dark:text-gray-400" />
            </button>
          </div>
        </div>
        <div className="p-4 max-h-[80vh] overflow-auto">
          {isPDF ? (
            <PDFViewer file={file} />
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="dark:text-gray-400">Preview not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 