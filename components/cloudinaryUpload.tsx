import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { Button } from './ui/button';
import { useState } from 'react';

const CloudinaryUpload = ({ title, onUpload }) => {
  const [resource, setResource] = useState(null);
  const [resourceType, setResourceType] = useState(null);

  return (
    <CldUploadWidget
      options={{
        sources: ['local', 'url', 'camera'],
        resourceType: 'auto', // Automatically detects the resource type
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
            {resource && resourceType === 'image' && (
              <CldImage
                width="960"
                height="600"
                src={resource}
                sizes="100vw"
                alt="Uploaded image"
              />
            )}
            {resource && resourceType === 'raw' && (
              <a href={resource} target="_blank" rel="noopener noreferrer">
                View Uploaded Document
              </a>
            )}
            </div>
      <Button type='input' onClick={() => open()}>
        {title}
      </Button>
      </>
    );
  }}
    </CldUploadWidget>
  );
};

export default CloudinaryUpload;
