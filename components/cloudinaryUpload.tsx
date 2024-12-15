'use client';

import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Upload } from 'lucide-react';

interface CloudinaryUploadProps {
  title: string;
  onUpload: (url: string) => void;
  initialUrl?: string;
}

// Utility function to convert PDF URL to JPG
const convertPdfToJpg = (url: string): string => {
  if (!url) return url;
  const pdfRegex = /\.pdf$/i;
  return url.replace(pdfRegex, '.jpg');
};

const CloudinaryUpload = ({
  title,
  onUpload,
  initialUrl
}: CloudinaryUploadProps) => {
  const { data: session } = useSession();
  const [resource, setResource] = useState<string | null>(
    initialUrl ? convertPdfToJpg(initialUrl) : null
  );
  const [resourceType, setResourceType] = useState<string | null>(null);

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="p-6">
        <CldUploadWidget
          options={{
            sources: ['local', 'url', 'camera'],
            resourceType: 'auto'
          }}
          signatureEndpoint="/api/upload"
          onSuccess={(result) => {
            //@ts-ignore
            const uploadedUrl = result.info.secure_url;
            //@ts-ignore
            const type = result.info.resource_type;
            const displayUrl = convertPdfToJpg(uploadedUrl);
            setResource(displayUrl);
            setResourceType(type);
            onUpload(displayUrl);
          }}
          onError={(error) => {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
          }}
        >
          {({ open }) => (
            <div className="space-y-4">
              {resource &&
                (resourceType === 'image' ||
                  resource.includes('.jpg') ||
                  resource.includes('.png') ||
                  resource.includes('.jpeg')) && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <CldImage
                      width="960"
                      height="600"
                      src={resource}
                      sizes="100vw"
                      alt="Uploaded image"
                      className="object-cover"
                    />
                  </div>
                )}

              <div className="flex flex-col items-center justify-between gap-2 ">
                <Button
                  type="button"
                  onClick={() => open()}
                  className="w-full sm:w-auto"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {title}
                </Button>

                {
                  //@ts-ignore
                  session?.role === 'admin' && resource && (
                    <a
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Original
                      </Button>
                    </a>
                  )
                }
              </div>
            </div>
          )}
        </CldUploadWidget>
      </CardContent>
    </Card>
  );
};

export default CloudinaryUpload;
