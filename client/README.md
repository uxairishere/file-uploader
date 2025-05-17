# File Uploader

A React-based file uploader with concurrent upload management. This application provides a drag-and-drop interface for file uploading with real-time progress tracking.

## Features

- Drag and drop support for dozens of files
- Queue management with concurrent upload limiting (max 3 at a time)
- Real-time upload progress tracking
- File upload status indicators (queued, uploading, completed, error)
- Built with Shopify Polaris for clean, modern UI
- TypeScript for improved code quality and type safety

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A running backend server that can handle file uploads (already setup with NestJS)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd file-uploader/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Configuration

The API URL for the backend server can be configured in the `.env` file:

```
VITE_API_URL=http://localhost:3000
```

## Deployment

To build the application for production:

```bash
npm run build
```

This will create optimized files in the `dist` folder that can be deployed to any static hosting service.

## Development Notes

### Time Spent
- Approximately 35 minutes was spent on this implementation.

### Trade-offs Made
1. **Error Handling**: Basic error handling is implemented. In a production environment, more detailed error handling and retry logic would be beneficial.
2. **File Type Limitations**: Currently accepts images and PDFs. This can be expanded based on requirements.
3. **Authentication**: The current implementation doesn't handle authentication tokens. In a real-world scenario, authorization headers would be added to API requests.
4. **Testing**: Due to time constraints, testing was not included, though it would be essential for a production application.

## About

This project was created as part of a coding challenge to demonstrate proficiency in React, TypeScript, and handling asynchronous operations.
