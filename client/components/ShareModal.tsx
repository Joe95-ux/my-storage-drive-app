'use client';

import { useState } from 'react';
import { X, Copy } from 'lucide-react';
import api from '@/lib/api';

interface ShareModalProps {
  file: {
    _id: string;
    name: string;
  };
  onClose: () => void;
}

interface ShareLinkResponse {
  shareLink: string;
}

interface ShareUserResponse {
  message: string;
}

type Permission = 'view' | 'edit';

export default function ShareModal({ file, onClose }: ShareModalProps) {
  const [shareLink, setShareLink] = useState('');
  const [permission, setPermission] = useState<Permission>('view');
  const [email, setEmail] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');

  const generateShareLink = async () => {
    try {
      const { data } = await api.post<ShareLinkResponse>(`/api/files/${file._id}/share/link`, {
        permission,
        isPublic
      });
      setShareLink(data.shareLink);
      setError('');
    } catch (error) {
      setError('Error generating share link');
    }
  };

  const shareWithUser = async () => {
    try {
      await api.post<ShareUserResponse>(`/api/files/${file._id}/share/user`, {
        email,
        permission
      });
      setEmail('');
      setError('');
    } catch (error) {
      setError('Error sharing with user');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Share &quot;{file.name}&quot;</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Share Link</label>
              <button
                onClick={generateShareLink}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Generate New Link
              </button>
            </div>
            {shareLink && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link Settings</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded text-blue-500"
                />
                <span className="text-sm">Anyone with link</span>
              </label>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as Permission)}
                className="text-sm border rounded p-1"
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Share with People</label>
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={shareWithUser}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 