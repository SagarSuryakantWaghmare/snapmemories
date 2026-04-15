/**
 * User-friendly error messages with recovery actions
 */

export const ERROR_MESSAGES = {
  CAMERA_PERMISSION: {
    title: 'Camera access denied',
    message: 'We need camera permission to capture photos. Please enable it in your browser settings.',
    action: 'Try uploading photos instead',
  },
  CAMERA_NOT_FOUND: {
    title: 'No camera detected',
    message: 'We couldn\'t find a camera on your device. Please check that a camera is connected.',
    action: 'Upload photos instead',
  },
  CAMERA_TIMEOUT: {
    title: 'Camera is taking too long',
    message: 'The camera is still warming up. Wait a moment or try uploading photos instead.',
    action: 'Retry or upload photos',
  },
  FILE_UPLOAD_ERROR: {
    title: 'Upload failed',
    message: 'We couldn\'t upload your photos. Please try again with different files.',
    action: 'Try another file',
  },
  FILE_TYPE_ERROR: {
    title: 'Invalid file type',
    message: 'Please upload image files (JPG, PNG, GIF, WebP).',
    action: 'Select valid image files',
  },
  DOWNLOAD_ERROR: {
    title: 'Download failed',
    message: 'We couldn\'t save your photo strip. Please try again.',
    action: 'Try downloading again',
  },
  FILTER_ERROR: {
    title: 'Filter failed',
    message: 'We couldn\'t apply the filter. Please try another one.',
    action: 'Try another filter',
  },
  GENERAL_ERROR: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try refreshing the page.',
    action: 'Refresh page',
  },
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

export function getErrorMessage(key: ErrorMessageKey) {
  return ERROR_MESSAGES[key] || ERROR_MESSAGES.GENERAL_ERROR;
}

export function formatErrorForUser(error: unknown): {
  title: string;
  message: string;
  details?: string;
} {
  if (error instanceof Error) {
    if (error.message.includes('camera')) {
      return {
        title: ERROR_MESSAGES.CAMERA_NOT_FOUND.title,
        message: ERROR_MESSAGES.CAMERA_NOT_FOUND.message,
        details: error.message,
      };
    }
    if (error.message.includes('permission')) {
      return {
        title: ERROR_MESSAGES.CAMERA_PERMISSION.title,
        message: ERROR_MESSAGES.CAMERA_PERMISSION.message,
      };
    }
    if (error.message.includes('timeout')) {
      return {
        title: ERROR_MESSAGES.CAMERA_TIMEOUT.title,
        message: ERROR_MESSAGES.CAMERA_TIMEOUT.message,
      };
    }
  }

  return {
    title: ERROR_MESSAGES.GENERAL_ERROR.title,
    message: ERROR_MESSAGES.GENERAL_ERROR.message,
    details: error instanceof Error ? error.message : String(error),
  };
}
