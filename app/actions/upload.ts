'use server'

import { put } from '@vercel/blob'

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File
    
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Only PDF files are allowed' }
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 2MB' }
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return { success: true, url: blob.url }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Failed to upload file' }
  }
}
