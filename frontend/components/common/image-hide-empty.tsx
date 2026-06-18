"use client"
import Image, { ImageProps } from "next/image";
import { useState } from "react";

/*
 * Wrap next/image.
 * If the image source does not exist, returns nothing or shows a message.
 */
const ImageHideEmpty = ({
  emptyMessage,
  alt,
  ...props
}: ImageProps & { emptyMessage?: string }) => {
  const [hideImage, setHideImage] = useState(false);

  if (hideImage && emptyMessage) {
    return <p>{emptyMessage}</p>
  }

  return (
    !hideImage && (
      <Image
        {...props}
        alt={alt}
        onError={() => {
          setHideImage(true);
        }}
      />
    )
  );
};

export default ImageHideEmpty;
