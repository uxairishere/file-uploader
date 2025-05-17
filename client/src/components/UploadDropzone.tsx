import React from 'react';
import { Box, Text } from '@shopify/polaris';

interface UploadDropzoneProps {
  getRootProps: (props?: any) => any;
  getInputProps: () => any;
  isDragActive: boolean;
  handleBrowseClick: (event: React.MouseEvent) => void;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  getRootProps,
  getInputProps,
  isDragActive,
  handleBrowseClick,
}) => {
  return (
    <div className="dropzone-container">
      <Box padding="600" background="bg-surface-secondary" borderRadius="300">
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <div className="dropzone-icon">
            <span role="img" aria-label="upload">📤</span>
          </div>
          <Text as="p" variant="headingMd" fontWeight="bold">
            {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
          </Text>
          <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
            or
          </Text>
          <button 
            className="browse-button"
            onClick={handleBrowseClick}
          >
            Choose Files
          </button>
          <input {...getInputProps()} />
        </div>
      </Box>
    </div>
  );
};

export default UploadDropzone; 