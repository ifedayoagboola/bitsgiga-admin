import React from 'react';
import { image_path } from '../../environment';

interface Image {
  className?: string;
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  id?:string;
}

const ImageWithBasePath = (props: Image) => {
  // Build image src: use absolute URLs as-is, otherwise prepend base image_path
  const altText = String(props.alt);
  const isAbsolute = /^https?:\/\//i.test(props.src) || props.src?.startsWith('data:');
  const fullSrc = isAbsolute ? props.src : `${image_path}${props.src}`;
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
