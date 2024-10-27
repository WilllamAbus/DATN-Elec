import React from 'react';

interface PlaceholderImageProps {
  altText?: string;
  className?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  altText = 'Placeholder Image',
  className = '',
}) => {
  return (
    <img
      src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/placeholderImage%2Fupload.png?alt=media&token=89de94b0-f53b-4a0b-afef-49e145c7bd45"
      alt={altText}
      className={className} 
    />
  );
};

export default PlaceholderImage;
