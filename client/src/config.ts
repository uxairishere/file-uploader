interface Config {
  apiUrl: string;
  maxConcurrentUploads: number;
  acceptedFileTypes: string;
}

// Configuration for the application
const config: Config = {
  // API URL - can be changed based on environment
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Maximum number of concurrent uploads allowed
  maxConcurrentUploads: Number(import.meta.env.VITE_MAX_CONCURRENT_UPLOADS) || 3,
  
  // Accepted file types for the uploader
  acceptedFileTypes: import.meta.env.VITE_ACCEPTED_FILE_TYPES || 'image/*, application/pdf',
};

export default config; 