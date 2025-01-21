import React, { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Upload, FileText, Trash2, Loader2 } from 'lucide-react';
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
  const [preview, setPreview] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileType, setFileType] = useState<string>('');

  useEffect(() => {
    if (initialUrl) {
      const isPdf = initialUrl.toLowerCase().endsWith('.pdf');
      setFileType(isPdf ? 'application/pdf' : 'image/*');
      setFileUrl(initialUrl);

      // Handle preview URL
      if (initialUrl.startsWith('http')) {
        setPreview(initialUrl);
      } else {
        // If it's a local file, construct the proper preview URL
        setPreview(`/api/media/${initialUrl}`);
      }
    } else {
      setPreview(null);
      setFileUrl('');
      setFileType('');
    }
  }, [initialUrl]);

  const processFile = async (file: File) => {
    if (!file) return;

    // File type validation
    const isValidType = acceptedFileTypes.some((type) => {
      const [category, ext] = type.split('/');
      return ext === '*' ? file.type.startsWith(category) : file.type === type;
    });

    if (!isValidType) {
      alert(
        `Invalid file type. Accepted types are: ${acceptedFileTypes.join(', ')}`
      );
      return;
    }

    // Size validation (20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('File size should be less than 20MB');
      return;
    }

    setIsUploading(true);
    setFileType(file.type);

    try {
      // Create local preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', session?.user?.id || '');

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();

      // Update URLs after successful upload
      const uploadedUrl = data.url;
      const previewUrl = data.previewUrl || data.url;

      setFileUrl(uploadedUrl);
      setPreview(`/api/media/${previewUrl}`);
      onUpload(uploadedUrl);

      // Cleanup local preview
      URL.revokeObjectURL(localPreview);
    } catch (error) {
      console.error('Upload error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Upload failed. Please try again.'
      );
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!fileUrl) return;

      const filename = fileUrl.split('/').pop();
      if (!filename) return;

      setIsUploading(true);
      const response = await fetch(`/api/media/delete/${filename}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Delete failed');
      }

      // Clear all states
      setFileUrl('');
      setPreview(null);
      setFileType('');
      onUpload('');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file. Please try again.');
    } finally {
      setIsUploading(false);
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

  const canViewFile =
    session?.id === userId || session?.role === 'admin';
  const isPdf =
    fileType === 'application/pdf' || fileUrl?.toLowerCase().endsWith('.pdf');
  const downloadUrl = fileUrl?.startsWith('http')
    ? fileUrl
    : `/api/media/${fileUrl}`;

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`relative space-y-4 rounded-lg border-2 border-dashed p-4 text-center transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          <input {...getInputProps()} />

          {preview && canViewFile && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-50">
              {isPdf ? (
                <div className="flex h-full flex-col items-center justify-center bg-gray-100">
                  <FileText className="h-16 w-16 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">PDF Document</p>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <Image
                    src={preview}
                    alt="Upload preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col items-center justify-between gap-2">
            <Button
              type="button"
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Uploading...' : title}
            </Button>

            {isDragActive ? (
              <p className="text-sm text-blue-600">Drop the file here...</p>
            ) : (
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
