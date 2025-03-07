import { useState } from 'react'
import { File, Folder, Download, Share2, Trash2 } from 'lucide-react'
import api from '@/lib/api'
import FilePreview from './FilePreview'

interface FileItem {
  _id: string
  name: string
  type: string
  size: number
  path: string
  isFolder: boolean
  createdAt: string
}

interface FileListProps {
  files: FileItem[]
  onFolderClick: (folderId: string) => void
  onFileDelete: () => void
}

export default function FileList({ files, onFolderClick, onFileDelete }: FileListProps) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  const handleDelete = async (fileId: string) => {
    try {
      await api.delete(`/api/files/${fileId}`)
      onFileDelete()
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileClick = (file: FileItem) => {
    if (!file.isFolder) {
      setSelectedFile(file)
    } else {
      onFolderClick(file._id)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modified
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {file.isFolder ? (
                      <Folder className="h-5 w-5 text-blue-500 mr-2" />
                    ) : (
                      <File className="h-5 w-5 text-gray-500 mr-2" />
                    )}
                    <span
                      className={`${file.isFolder ? 'cursor-pointer hover:text-blue-500' : 'cursor-pointer hover:text-blue-500'}`}
                      onClick={() => handleFileClick(file)}
                    >
                      {file.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {file.isFolder ? '-' : formatSize(file.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(file.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {!file.isFolder && (
                      <Download
                        className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => {/* Handle download */}}
                      />
                    )}
                    <Share2
                      className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                      onClick={() => {/* Handle share */}}
                    />
                    <Trash2
                      className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => handleDelete(file._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </>
  )
} 