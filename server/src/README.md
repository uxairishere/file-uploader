# File Upload API

A NestJS API for managing file uploads to S3-compatible storage with queue management.

## Features

- Upload single or multiple files to S3-compatible storage using AWS SDK v3
- Queue management to limit concurrent uploads (max 3 at a time)
- File metadata stored in MongoDB
- Rate limiting to prevent abuse
- Swagger API documentation

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/file-uploader

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
S3_ENDPOINT=https://s3.amazonaws.com  # Change for other S3-compatible services
```

## API Endpoints

- `POST /api/uploads/file` - Upload a single file
- `POST /api/uploads/files` - Upload multiple files
- `GET /api/uploads` - Get all files
- `DELETE /api/uploads/:id` - Delete a file

## Swagger Documentation

API documentation is available at `/api/docs` when the server is running.

## Implementation Notes

- Uses AWS SDK v3 for better performance and modularity
- Supports both standard S3 endpoints and custom endpoints (DigitalOcean Spaces, Backblaze, etc.) 