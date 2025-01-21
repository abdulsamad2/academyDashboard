import React, { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Upload, FileText, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface EnhancedUploadProps {
  title: string;
  onUpload: (url: string) => void;
  initialUrl?: string;
  userId?: string;
  acceptedFileTypes?: string[];
}

const EnhancedUpload = ({
  title,
  onUpload,
  initialUrl,
  userId,
  acceptedFileTypes = ['image/*', 'application/pdf']
}: EnhancedUploadProps) => {
  const { data: session } = useSession();
  const [preview, setPreview] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileType, setFileType] = useState<string>('');

  useEffect(() => {
    if (initialUrl) {
      const isPdf = initialUrl.toLowerCase().endsWith('.pdf');
      setFileType(isPdf ? 'application/pdf' : 'image/*');
      setFileUrl(initialUrl);

      if (initialUrl.startsWith('http')) {
        setPreview(initialUrl);
      } else {
        const previewName = `${initialUrl}`;
        setPreview(previewName);
      }
    }
  }, [initialUrl]);

  const processFile = async (file: File) => {
    if (!file) return;

    // File type validation
    if (
      !acceptedFileTypes.some((type) => {
        const [category, ext] = type.split('/');
        return ext === '*'
          ? file.type.startsWith(category)
          : file.type === type;
      })
    ) {
      alert('Invalid file type');
      return;
    }

    // Size validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setFileType(file.type);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', session?.user?.id || '');

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Update both file and preview URLs
      setFileUrl(data.url);
      setPreview(data.url);
      onUpload(data.url); // Save the main file URL to the form
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!fileUrl) return;

      // Only attempt to delete if it's a local file
      if (!fileUrl.startsWith('http')) {
        // Extract just the filename from the URL if needed
        const filename = fileUrl.split('/').pop();

        const response = await fetch(`/api/media/delete/${filename}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Delete failed');
        }

        // Clear the form and state
        setFileUrl('');
        setPreview('');
        setFileType('');
        onUpload(''); // Clear the form value
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    multiple: false
  });

  // Access control
  const canViewFile =
    //@ts-ignore
    session?.user?.id === userId || session?.user?.role === 'admin';

  // Handle URLs
  const isLegacyUrl = fileUrl?.startsWith('http');
  const previewUrl = preview
    ? isLegacyUrl
      ? preview
      : `/api/media/${preview}`
    : '';
  const downloadUrl = isLegacyUrl ? fileUrl : `/api/media/${fileUrl}`;

  const isPdf =
    fileType === 'application/pdf' || fileUrl?.toLowerCase().endsWith('.pdf');

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`space-y-4 rounded-lg border-2 border-dashed p-4 text-center transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          {fileUrl && canViewFile && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-50">
              {isPdf ? (
                <div className="flex h-full flex-col items-center justify-center bg-gray-100">
                  <FileText className="h-16 w-16 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">PDF Document</p>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <Image
                    src={previewUrl}
                    alt="Upload preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              {/* Delete button overlay */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this file?')) {
                    handleDelete();
                  }
                }}
                className="absolute right-2 top-2 rounded-full bg-red-100 p-2 text-red-600 opacity-0 transition-opacity hover:bg-red-200 group-hover:opacity-100"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}

          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-between gap-2">
            <Button
              type="button"
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Uploading...' : title}
            </Button>

            {isDragActive && (
              <p className="text-sm text-blue-600">Drop the file here...</p>
            )}

            {!isDragActive && (
              <p className="text-sm text-gray-500">
                Drag and drop a file here, or click to select
              </p>
            )}

            {canViewFile && fileUrl && (
              <div className="flex w-full items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(downloadUrl, '_blank');
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View {isPdf ? 'PDF' : 'Image'}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1 sm:flex-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this file?')) {
                      handleDelete();
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedUpload;
