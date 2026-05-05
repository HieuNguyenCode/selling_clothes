const API_URL = import.meta.env.VITE_API_URL || '';

export const getImageUrl = (path: string | undefined): string => {
  if (!path) return '';
  
  // If it's a preview URL (blob/data), return it as is
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  let cleanPath = path;

  // If it's an absolute URL, check if it's localhost
  if (cleanPath.startsWith('http')) {
    try {
      const url = new URL(cleanPath);
      if (
        url.hostname === 'localhost' || 
        url.hostname === '127.0.0.1' || 
        url.hostname === '0.0.0.0' ||
        url.hostname === '::1'
      ) {
        // Strip the origin to make it a relative path
        cleanPath = url.pathname + url.search + url.hash;
      } else {
        // For external domains, return the absolute URL as is
        return cleanPath;
      }
    } catch (e) {
      // If parsing fails, we'll try treating it as a relative path
    }
  }

  // Ensure path starts with a slash
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  // Prepend API_URL ONLY if it's not a localhost address
  // This ensures we always use relative paths for anything local, bypassing CORS via the proxy
  const isLocalApi = API_URL.includes('localhost') || API_URL.includes('127.0.0.1') || API_URL === '';
  
  if (isLocalApi) {
    return normalizedPath;
  }

  return `${API_URL}${normalizedPath}`;
};

export const getFullUrl = getImageUrl;
