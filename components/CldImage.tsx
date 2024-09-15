import React from 'react';
//@ts-ignore
import { CldImage } from 'next-cloudinary';

const CldImage = ({ url }:any) => {
  return (
    <CldImage
      width="960"
      height="600"
      src={url}
      sizes="100vw"
      alt="Description of my image"
    />
  );
};

export default CldImage;
