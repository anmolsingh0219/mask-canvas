# Mask Drawing App Frontend

A React application for image masking and drawing with real-time preview capabilities.

## Features

- Image upload with drag & drop support
- Real-time drawing with customizable brush
- Live mask preview
- Export masks with timestamps
- Multiple brush colors
- Adjustable brush size
- Custom cursor for drawing
- Dark theme UI

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mask-drawing-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=https://your-backend-url/api
```

## Running Locally

1. Start the development server:
```bash
npm run dev
```

2. Access the application at `http://localhost:5173`

> **Important Note**: When running locally, you'll need to modify the API URL in your `.env` file to point to your local backend:
```env
VITE_API_URL=http://localhost:8000/api
```
Make sure your backend server is running before testing the frontend application.

## Build for Production

Create a production build:
```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── assets/
│   │   └── imagepipeline_logo.webp
│   ├── components/
│   │   ├── DrawingCanvas.jsx
│   │   └── ImageUpload.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── index.html
├── package.json
└── vite.config.js
```

## Testing Locally

1. Ensure your backend server is running at `http://localhost:8000`
2. Update `.env` with local backend URL
3. Start the frontend development server
4. Test the following functionalities:
   - Image upload (drag & drop or click to upload)
   - Drawing tools (brush size and colors)
   - Real-time mask preview
   - Mask export
   - Change image functionality

## Dependencies

- React
- Vite
- Tailwind CSS
- React Sketch Canvas
- Lucide React

## Usage Guide

1. Start the application
2. Upload an image:
   - Click the upload button or
   - Drag and drop an image
3. Use drawing tools:
   - Adjust brush size with the slider
   - Select different colors from the palette
4. Create mask:
   - Draw on the image
   - See real-time preview
   - Clear canvas if needed
5. Export mask:
   - Click "Export Mask" to download
   - Mask will be saved with timestamp

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add some feature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## Troubleshooting

- If uploads fail, check backend connection and CORS settings
- For local development issues, verify API_URL in .env
- Make sure both frontend and backend servers are running
- Check browser console for any error messages
