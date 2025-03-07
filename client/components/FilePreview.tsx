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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 relative">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">{file.name}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(file.path, '_blank')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 max-h-[80vh] overflow-auto">
          {isPDF ? (
            <PDFViewer file={file} />
          ) : (
            <div className="flex items-center justify-center h-96">
              <p>Preview not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 