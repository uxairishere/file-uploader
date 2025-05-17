import React from 'react';
import { Card, Box, Text, BlockStack } from '@shopify/polaris';

interface UploadStatsProps {
  activeUploads: number;
  maxConcurrentUploads: number;
  queuedFiles: number;
  completedFiles: number;
}

const UploadStats: React.FC<UploadStatsProps> = ({
  activeUploads,
  maxConcurrentUploads,
  queuedFiles,
  completedFiles,
}) => {
  return (
    <Card background="bg-surface-secondary">
      <Box paddingBlockEnd="400">
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd">Upload Statistics</Text>
          
          <div className="stats-item">
            <div className="stats-icon">⏳</div>
            <div>
              <Text as="p" variant="bodyMd" fontWeight="bold">Active Uploads</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {activeUploads} of {maxConcurrentUploads} max
              </Text>
            </div>
          </div>
          
          <div className="stats-item">
            <div className="stats-icon">🔄</div>
            <div>
              <Text as="p" variant="bodyMd" fontWeight="bold">Queued Files</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {queuedFiles} waiting
              </Text>
            </div>
          </div>
          
          <div className="stats-item">
            <div className="stats-icon">✅</div>
            <div>
              <Text as="p" variant="bodyMd" fontWeight="bold">Completed</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {completedFiles} files
              </Text>
            </div>
          </div>
        </BlockStack>
      </Box>
    </Card>
  );
};

export default UploadStats; 