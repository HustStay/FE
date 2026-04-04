// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dcxazccv9',        // Cloud name thật
  uploadPreset: 'chat-datn',     // Upload preset đã tạo
  apiKey: 'your-api-key',        // Optional cho client-side
  folder: 'datn-chat-files'      // Thư mục lưu file
}

// File type configurations
export const FILE_CONFIG = {
  // Allowed image types
  ALLOWED_IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],

  // Allowed file types
  ALLOWED_FILES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],

  // Size limits (bytes)
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,  // 5MB
  MAX_FILE_SIZE: 10 * 1024 * 1024,  // 10MB

  // Image thumbnail settings
  THUMBNAIL_SIZE: { width: 300, height: 200 },

  // Message types
  MESSAGE_TYPES: {
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    FILE: 'FILE',
    DOCUMENT: 'DOCUMENT'
  }
}

/**
 * Convert Cloudinary URL to downloadable URL with fl_attachment flag
 * This forces the browser to download the file instead of opening it
 */
export const getDownloadUrl = (fileUrl, fileName) => {
  if (!fileUrl) return ''
  
  // For Cloudinary URLs, add fl_attachment to force download
  if (fileUrl.includes('cloudinary.com')) {
    // Parse the URL to insert fl_attachment
    // Format: https://res.cloudinary.com/{cloud}/raw/upload/v{version}/{folder}/{file}
    // Add fl_attachment:filename after /upload/
    const uploadIndex = fileUrl.indexOf('/upload/')
    if (uploadIndex !== -1) {
      const beforeUpload = fileUrl.substring(0, uploadIndex + 8) // includes '/upload/'
      const afterUpload = fileUrl.substring(uploadIndex + 8)
      const encodedFileName = encodeURIComponent(fileName || 'file')
      return `${beforeUpload}fl_attachment:${encodedFileName}/${afterUpload}`
    }
  }
  
  return fileUrl
}