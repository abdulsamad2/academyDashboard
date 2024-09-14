import React from 'react';
import { CldImage } from 'next-cloudinary';

const CldImage = ({ url }) => {
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
