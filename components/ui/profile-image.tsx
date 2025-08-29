"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProfileImageProps {
  username: string;
  className?: string;
  onClick?: (imageSrc: string) => void;
  alt?: string;
}

export function ProfileImage({ username, className = "", onClick, alt = "profile" }: ProfileImageProps) {
  const [imageSrc, setImageSrc] = useState('');
  const [hasValidImage, setHasValidImage] = useState(true);
  const [currentExtensionIndex, setCurrentExtensionIndex] = useState(0);
  const { toast } = useToast();

  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  useEffect(() => {
    if (!username) {
      setImageSrc('/profiles/default.jpg');
    } else {
      setImageSrc(`/profiles/${username}${extensions[0]}`);
    }
    setHasValidImage(true);
    setCurrentExtensionIndex(0);
  }, [username]);

  const handleImageError = () => {
    const nextIndex = currentExtensionIndex + 1;
    
    if (nextIndex < extensions.length) {
      // Try next extension
      setImageSrc(`/profiles/${username}${extensions[nextIndex]}`);
      setCurrentExtensionIndex(nextIndex);
    } else {
      // All extensions failed, use default
      setImageSrc('/profiles/default.jpg');
    }
  };

  const handleImageLoad = () => {
    setHasValidImage(true);
  };

  const handleClick = () => {
    if (!hasValidImage) {
      toast({
        title: "No Image Available",
        description: `No profile image found for ${username}`,
        variant: "destructive",
      });
      return;
    }

    if (onClick) {
      onClick(imageSrc);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${!hasValidImage ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      onClick={handleClick}
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  );
} 