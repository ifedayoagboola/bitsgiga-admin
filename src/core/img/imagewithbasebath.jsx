import React from 'react';
import { image_path, static_image_path } from '../../environment';

interface Image {
  className?: string;
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  id?: string;
  isR2?: boolean; // Explicit flag for R2 images
}

const ImageWithBasePath = (props: Image) => {
  const altText = String(props.alt);
  const isAbsolute = /^https?:\/\//i.test(props.src) || props.src?.startsWith('data:');
  const basePath = props.isR2 ? image_path : static_image_path;
  const fullSrc = isAbsolute ? props.src : `${basePath}${props.src}`;

  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={altText}
      width={props.width}
      id={props.id}
    />
  );
};

export default ImageWithBasePath;
