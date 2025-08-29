import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get profile image based on username
export function getProfileImage(username: string): string {
  if (!username) return '/profiles/default.jpg';
  
  // Return the path with .jpg extension first (most common)
  // If the user-specific image doesn't exist, the component will fall back to default.jpg
  return `/profiles/${username}.jpg`;
}

// Function to get profile image with fallback handling
export function getProfileImageWithFallback(username: string): string {
  if (!username) return '/profiles/default.jpg';
  
  // Common image extensions to check
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  // Return the first extension (browser will handle 404s)
  return `/profiles/${username}${extensions[0]}`;
}