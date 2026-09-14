export function optimizeImage(url: string | undefined, width?: number): string {
  if (!url) return '';
  
  // Only process unoptimized Cloudinary URLs
  if (url.includes('cloudinary.com') && !url.includes('f_auto')) {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const prefix = url.substring(0, uploadIndex + 8);
      const suffix = url.substring(uploadIndex + 8);
      
      // Auto format (WebP/AVIF), Auto Quality (compress without visual loss)
      const transforms = ['f_auto', 'q_auto', 'e_trim'];
      if (width) transforms.push(`w_${width}`);
      
      return `${prefix}${transforms.join(',')}/${suffix}`;
    }
  }
  return url;
}
