const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5267';

export const getImageUrl = (path: string | undefined): string => {
  if (!path) return '';
  
  // If it's a preview URL (blob/data), return it as is
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  let cleanPath = path;

  // If it's an absolute URL pointing to localhost (any port), strip the base
  // This handles cases where the API might return full URLs with wrong ports
  if (cleanPath.startsWith('http')) {
    try {
      const url = new URL(cleanPath);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        cleanPath = url.pathname + url.search + url.hash;
      } else {
        // For other domains, return as is
        return cleanPath;
      }
    } catch (e) {
      // If URL parsing fails, just return the path
      return cleanPath;
    }
  }

  // Ensure path starts with a slash if it doesn't already
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  // Prepend API_URL
  return `${API_URL}${normalizedPath}`;
};

export const getFullUrl = getImageUrl;
