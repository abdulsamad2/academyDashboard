import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { Button } from './ui/button';
import { useState } from 'react';

interface CloudinaryUploadProps {
  title: string;
  onUpload: (url: string) => void;
  initialUrl?: string;
}

// Utility function to convert PDF URL to JPG
const convertPdfToJpg = (url: string): string => {
  if (!url) return url;

  // Check if URL ends with .pdf (case-insensitive)
  const pdfRegex = /\.pdf$/i;

  // If it's a PDF, replace the extension
  return url.replace(pdfRegex, '.jpg');
};

const CloudinaryUpload = ({
  title,
  onUpload,
  initialUrl
}: CloudinaryUploadProps) => {
  // Convert initial URL if it's a PDF
  const [resource, setResource] = useState<string | null>(
    initialUrl ? convertPdfToJpg(initialUrl) : null
  );
  const [resourceType, setResourceType] = useState<string | null>(null);

  return (
    <CldUploadWidget
      options={{
        sources: ['local', 'url', 'camera'],
        resourceType: 'auto' // Automatically detects the resource type
      }}
      signatureEndpoint="/api/upload"
      onSuccess={(result) => {
        //@ts-ignore
        const uploadedUrl = result.info.secure_url;
        //@ts-ignore
        const type = result.info.resource_type;

        // Convert URL if it's a PDF
        const displayUrl = convertPdfToJpg(uploadedUrl);

        setResource(displayUrl);
        setResourceType(type);
        onUpload(displayUrl); // Pass the uploaded URL back to the parent
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
                  resource.includes('.jpeg')) && (
                  <CldImage
                    width="960"
                    height="600"
                    src={resource}
                    sizes="100vw"
                    alt="Uploaded image"
                  />
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
