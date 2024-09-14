import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CloudinaryUploadProps {
  title: string;
  onUpload: (url: string) => void;
  initialUrl?: string;
}

const CloudinaryUpload = ({
  title,
  onUpload,
  initialUrl
}: CloudinaryUploadProps) => {
  const [resource, setResource] = useState<string | null>(initialUrl || null);
  const [resourceType, setResourceType] = useState<string | null>(null);

  return (
    <CldUploadWidget
      options={{
        sources: ['local', 'url', 'camera'],
        resourceType: 'auto' // Automatically detects the resource type
      }}
      signatureEndpoint="/api/upload"
      onSuccess={(result) => {
        const uploadedUrl = result.info.secure_url;
        const type = result.info.resource_type;
        setResource(uploadedUrl);
        setResourceType(type);
        onUpload(uploadedUrl); // Pass the uploaded URL back to the parent
      }}
      onError={(error) => {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      }}
    >
      {({ open }) => {
        return (
          <>
            <div>
              {resource &&
              (resourceType === 'image' ||
                resource.includes('.jpg') ||
                resource.includes('.png') ||
                resource.includes('.jpeg')) ? (
                <CldImage
                  width="960"
                  height="600"
                  src={resource}
                  sizes="100vw"
                  alt="Uploaded image"
                />
              ) : (
                resource && (
                  <a href={resource} target="_blank" rel="noopener noreferrer">
                    View Uploaded Document
                  </a>
                )
              )}
            </div>
            <Button
              type="button"
              className="bg-secondary-foreground py-4"
              onClick={() => open()}
            >
              {title}
            </Button>
          </>
        );
      }}
    </CldUploadWidget>
  );
};

export default CloudinaryUpload;
