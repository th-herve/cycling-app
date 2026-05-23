import Image, { ImageProps } from "next/image";
import { useState } from "react";

/*
 * Wrap next/image.
 * If the image source does not exist, returns nothing.
 */
const ImageHideEmpty = ({ alt, ...props }: ImageProps) => {
  const [hideImage, setHideImage] = useState(false);

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
