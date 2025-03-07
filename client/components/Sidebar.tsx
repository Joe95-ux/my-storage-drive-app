'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HardDrive,
  Users,
  Clock,
  Star,
  Trash2,
  Cloud,
  HardDriveDownload,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isStorageExpanded, setIsStorageExpanded] = useState(true);

  const storageUsed = user?.storageUsed || 0;
  const storageLimit = user?.storageLimit || 15 * 1024 * 1024 * 1024; // 15GB
  const storagePercentage = (storageUsed / storageLimit) * 100;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const navItems = [
    { href: '/', icon: HardDrive, label: 'My Drive' },
    { href: '/shared', icon: Users, label: 'Shared with me' },
    { href: '/recent', icon: Clock, label: 'Recent' },
    { href: '/starred', icon: Star, label: 'Starred' },
    { href: '/trash', icon: Trash2, label: 'Trash' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">My Drive</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg mb-1 ${
              pathname === item.href
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <button
            onClick={() => setIsStorageExpanded(!isStorageExpanded)}
            className="flex items-center space-x-2 text-gray-700 w-full"
          >
            <HardDriveDownload className="h-5 w-5" />
            <span className="flex-1">Storage</span>
            {isStorageExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {isStorageExpanded && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <div className="text-sm text-gray-600">
              {formatBytes(storageUsed)} of {formatBytes(storageLimit)} used
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 