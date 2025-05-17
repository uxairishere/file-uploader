import React from 'react';

interface FileItemProps {
  file: File;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  id: string;
  onRemove: (id: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, progress, status, id, onRemove }) => {
  // Check if file is image or video
  const isImage = file.type.includes('image');
  const isVideo = file.type.includes('video');

  // Generate file icon based on type
  let fileIcon = '📄'; // Default document
  if (isImage) fileIcon = '🖼️';
  else if (isVideo) fileIcon = '🎬';
  else if (file.type.includes('pdf')) fileIcon = '📕';
  else if (file.type.includes('zip') || 
           file.type.includes('rar') || 
           file.type.includes('archive')) fileIcon = '🗄️';
  
  // Generate status text and style
  const statusBadgeClass = `status-badge ${status}`;

  return (
    <div className="file-item">
      <button
        onClick={() => onRemove(id)}
        className="remove-button"
        aria-label="Remove file"
      >
        ×
      </button>
      
      <div className="file-thumbnail">
        {isImage ? (
          <img src={URL.createObjectURL(file)} alt={file.name} />
        ) : (
          <div className="default-icon">{fileIcon}</div>
        )}
        
        {status === 'uploading' && (
          <div className="upload-overlay">
            <div 
              className="upload-progress"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      
      <div className="file-info">
        <div className="file-name" title={file.name}>
          {file.name.length > 18 
            ? file.name.substring(0, 15) + '...' 
            : file.name}
        </div>
        <div className="file-meta">
          {(file.size / 1024).toFixed(1)} KB
          <span className={statusBadgeClass}>
            {status === 'completed' ? '✓' : 
             status === 'error' ? '✗' : 
             status === 'uploading' ? '↑' : '⌛'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileItem; 