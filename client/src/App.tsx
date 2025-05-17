import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import enTranslations from '@shopify/polaris/locales/en.json';
import {
  AppProvider,
  Page,
  Card,
  Box,
  Text,
  BlockStack,
  InlineStack,
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import './styles/uploader.css';
import config from './config';

// Components
import FileItem from './components/FileItem';
import UploadDropzone from './components/UploadDropzone';
import UploadStats from './components/UploadStats';

interface FileWithProgress {
  file: File;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  id: string;
  error?: string;
  completedAt?: number; // Timestamp when upload completed
}

function App() {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [activeUploads, setActiveUploads] = useState<string[]>([]);
  const MAX_CONCURRENT_UPLOADS = config.maxConcurrentUploads || 20;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'queued' as const,
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Use noClick to prevent multiple file dialogs
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    noClick: true // This prevents automatic click handling
  });

  // Function to manually open file dialog
  const handleBrowseClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = config.acceptedFileTypes;
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        onDrop(Array.from(target.files));
      }
    };
    
    input.click();
  };

  const uploadFile = useCallback(async (fileWithProgress: FileWithProgress) => {
    const formData = new FormData();
    formData.append('files', fileWithProgress.file);
    
    try {
      // Update file status to uploading
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileWithProgress.id ? { ...f, status: 'uploading' } : f
        )
      );
      
      // Add to active uploads
      setActiveUploads((prev) => [...prev, fileWithProgress.id]);
      
      // Upload the file
      await axios.post(`${config.apiUrl}/uploads/files`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.id === fileWithProgress.id ? { ...f, progress } : f
              )
            );
          }
        },
      });
      
      // Update status to completed with timestamp
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileWithProgress.id 
            ? { ...f, status: 'completed', progress: 100, completedAt: Date.now() } 
            : f
        )
      );
    } catch (error) {
      // Handle error
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileWithProgress.id
            ? { ...f, status: 'error', error: 'Upload failed' }
            : f
        )
      );
    } finally {
      // Remove from active uploads
      setActiveUploads((prev) => prev.filter((id) => id !== fileWithProgress.id));
    }
  }, []);

  // Process queue whenever activeUploads changes
  useEffect(() => {
    const processQueue = async () => {
      if (activeUploads.length < MAX_CONCURRENT_UPLOADS) {
        const nextFile = files.find(
          (f) => f.status === 'queued' && !activeUploads.includes(f.id)
        );
        
        if (nextFile) {
          uploadFile(nextFile);
        }
      }
    };
    
    processQueue();
  }, [files, activeUploads, uploadFile, MAX_CONCURRENT_UPLOADS]);

  // Remove completed uploads after a delay
  useEffect(() => {
    const completedFiles = files.filter(
      (file) => file.status === 'completed' && file.completedAt
    );
    
    if (completedFiles.length > 0) {
      const timers = completedFiles.map((file) => {
        return setTimeout(() => {
          setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
        }, 3000); // Remove after 3 seconds
      });
      
      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [files]);

  const removeFile = useCallback((id: string) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== id));
  }, []);

  return (
    <div className="app-container">
      <AppProvider i18n={enTranslations}>
        <Page fullWidth>
          <div className="content-container">
            <Card>
              <Box padding={{ xs: '400', sm: '500', md: '600' }}>
                <BlockStack gap="600">
                  <Text as="h1" variant="headingLg" alignment="center">File Uploader</Text>
                  
                  <UploadDropzone 
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                    isDragActive={isDragActive}
                    handleBrowseClick={handleBrowseClick}
                  />
                  
                  {files.length > 0 && (
                    <Box padding={{ xs: '400', sm: '500', md: '600' }}>
                      <BlockStack gap="400">
                        <InlineStack align="space-between">
                          <Text as="h2" variant="headingMd">Files</Text>
                          <Text as="p" variant="bodySm" tone="subdued">
                            {files.length} {files.length === 1 ? 'file' : 'files'}
                          </Text>
                        </InlineStack>
                        
                        <div className="files-grid">
                          {files.map((fileWithProgress) => (
                            <FileItem
                              key={fileWithProgress.id}
                              file={fileWithProgress.file}
                              progress={fileWithProgress.progress}
                              status={fileWithProgress.status}
                              id={fileWithProgress.id}
                              onRemove={removeFile}
                            />
                          ))}
                        </div>
                      </BlockStack>
                    </Box>
                  )}
                  
                  <Box paddingBlockStart="200">
                    <UploadStats
                      activeUploads={activeUploads.length}
                      maxConcurrentUploads={MAX_CONCURRENT_UPLOADS}
                      queuedFiles={files.filter(f => f.status === 'queued').length}
                      completedFiles={files.filter(f => f.status === 'completed').length}
                    />
                  </Box>
                </BlockStack>
              </Box>
            </Card>
          </div>
        </Page>
      </AppProvider>
    </div>
  );
}

export default App;
