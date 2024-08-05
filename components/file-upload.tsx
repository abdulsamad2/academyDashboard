'use-client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { Input } from './ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { Button } from './ui/button';
import { ImagePlus } from 'lucide-react';
interface ImageUploaderProps {
  form: any;
  control: any;
  name: string;
  label: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  form,
  control,
  name,
  label
}) => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>('');

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue('image', acceptedFiles[0]);
        form.clearErrors('image');
      } catch (error) {
        setPreview(null);
        form.resetField('image');
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: {
        'image/png': [],
        'image/jpg': [],
        'image/jpeg': [],
        'image/pdf': []
      }
    });

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="mx-auto md:w-1/2">
          <FormLabel
            className={`${fileRejections.length !== 0 && 'text-destructive'}`}
          >
            <h2 className="text-xl font-semibold tracking-tight">
              {label}{' '}
              <span
                className={
                  form.formState.errors.image || fileRejections.length !== 0
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                }
              ></span>
            </h2>
          </FormLabel>
          <FormControl>
            <div
              {...getRootProps()}
              className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground"
            >
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview as string}
                  alt="Uploaded image"
                  className="max-h-[400px] rounded-lg"
                  export
                />
              )}
              <ImagePlus
                className={`size-40 ${preview ? 'hidden' : 'block'}`}
              />
              <Input {...getInputProps()} type="file" />
              {isDragActive ? (
                <p>Drop the image!</p>
              ) : (
                <p>Click here or drag an image to upload it</p>
              )}
            </div>
          </FormControl>
          <FormMessage>
            {fileRejections.length !== 0 && (
              <p>Image must be less than 1MB and of type png, jpg, or jpeg</p>
            )}
          </FormMessage>
        </FormItem>
      )}
    />
  );
};
export default ImageUploader;
