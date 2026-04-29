import axios from 'axios'
import { CLOUDINARY_CONFIG, FILE_CONFIG } from '../utils/cloudinaryConfig.js'

class CloudinaryService {
  constructor() {
    this.config = CLOUDINARY_CONFIG
  }

  /**
   * Upload file to Cloudinary
   * @param {File} file - File object to upload
   * @param {Function} onProgress - Callback for upload progress
   * @returns {Promise<Object>} Upload result with URL and metadata
   */
  async uploadFile(file, onProgress = null) {
    try {
      // Validate file
      this.validateFile(file)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', this.config.uploadPreset)
      formData.append('folder', this.config.folder)
      formData.append('resource_type', 'auto')   // ✅ hỗ trợ PDF, DOC, DOCX

      const uploadUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/auto/upload`

      const response = await this.uploadWithProgress(uploadUrl, formData, onProgress)

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const result = response.data

      // Generate thumbnail for images
      let thumbnailUrl = null
      if (this.isImage(file)) {
        thumbnailUrl = this.generateThumbnailUrl(result.public_id)
      }

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        thumbnailUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        messageType: this.getMessageType(file)
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Upload with progress tracking
   */
  uploadWithProgress(url, formData, onProgress) {
    return axios.post(url, formData, {
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const progress = Math.round((event.loaded / event.total) * 100)
          onProgress(progress)
        }
      }
    })
  }

  /**
   * Validate file before upload
   */
  validateFile(file) {
    if (!file) {
      throw new Error('No file provided')
    }

    const isImage = this.isImage(file)
    const isAllowedFile = this.isAllowedFile(file)

    if (!isImage && !isAllowedFile) {
      throw new Error('File type not supported')
    }

    const maxSize = isImage ? FILE_CONFIG.MAX_IMAGE_SIZE : FILE_CONFIG.MAX_FILE_SIZE

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      throw new Error(`File too large. Maximum size: ${maxSizeMB}MB`)
    }
  }

  /**
   * Check if file is an image
   */
  isImage(file) {
    return FILE_CONFIG.ALLOWED_IMAGES.includes(file.type)
  }

  /**
   * Check if file type is allowed
   */
  isAllowedFile(file) {
    return FILE_CONFIG.ALLOWED_FILES.includes(file.type)
  }

  /**
   * Get message type based on file type
   */
  getMessageType(file) {
    if (this.isImage(file)) {
      return FILE_CONFIG.MESSAGE_TYPES.IMAGE
    } else if (file.type === 'application/pdf') {
      return FILE_CONFIG.MESSAGE_TYPES.DOCUMENT
    } else {
      return FILE_CONFIG.MESSAGE_TYPES.FILE
    }
  }

  /**
   * Generate thumbnail URL for images
   */
  generateThumbnailUrl(publicId) {
    const { width, height } = FILE_CONFIG.THUMBNAIL_SIZE
    return `https://res.cloudinary.com/${this.config.cloudName}/image/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${publicId}`
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Get file icon based on type
   */
  getFileIcon(file) {
    if (this.isImage(file)) return '🖼️'
    if (file.type === 'application/pdf') return '📄'
    if (file.type.includes('word')) return '📝'
    if (file.type === 'text/plain') return '📋'
    return '📎'
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService()
export default cloudinaryService
