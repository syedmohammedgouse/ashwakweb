# Ashwak Photography Portfolio

A modern, responsive photography portfolio website with admin panel for managing images.

## Features

### 🎨 **Main Portfolio**
- **Dynamic Image Loading** - Automatically loads images from folders
- **Category Filtering** - Filter by Wedding, Portfolio, or All photos
- **Fast Loading** - Optimized with lazy loading and placeholders
- **Responsive Design** - Works perfectly on all devices
- **Modern UI** - Clean, professional design with smooth animations

### 🔧 **Admin Panel**
- **Folder Management** - View images organized by folders
- **Image Statistics** - See counts for each category
- **Upload Interface** - Drag & drop or click to upload (demo mode)
- **Image Details** - View file information in modal
- **Delete Images** - Remove images from portfolio (demo mode)

## File Structure

```
web/
├── index.html          # Main portfolio page
├── admin.html          # Admin panel
├── styles.css          # Main site styles
├── admin-styles.css    # Admin panel styles
├── script.js           # Main site JavaScript
├── admin.js            # Admin panel JavaScript
├── Wedding /           # Wedding photos folder
├── Pics /              # Portfolio photos folder
└── README.md           # This file
```

## How to Use

### Viewing the Portfolio
1. Open `index.html` in your browser
2. Browse photos using category filters
3. Images load automatically from folders

### Accessing Admin Panel
1. Click "Admin" link in the footer of the main site
2. Or directly visit `admin.html`
3. Use the sidebar to navigate between folders
4. Upload new images or manage existing ones

### Adding New Images
1. **Manual Method**: Add images to the appropriate folders:
   - `Wedding /` for wedding photos
   - `Pics /` for portfolio photos
2. **Admin Method**: Use the upload interface in admin panel (demo mode)

## Technical Details

### Image Loading System
- **Dynamic Detection**: Automatically finds images in folders
- **Lazy Loading**: Only loads images as they come into view
- **Error Handling**: Gracefully handles missing images
- **Performance**: Optimized for fast loading with placeholders

### Admin Features
- **Real-time Statistics**: Shows image counts for each category
- **Folder Navigation**: Easy switching between image categories
- **Image Preview**: Modal view with file details
- **Upload Simulation**: Demo upload functionality

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance Optimizations
- ✅ Lazy loading for images
- ✅ Intersection Observer for efficient loading
- ✅ Placeholder animations
- ✅ Optimized CSS and JavaScript
- ✅ Responsive image grid

## Future Enhancements
- [ ] Real server-side upload functionality
- [ ] Image compression and optimization
- [ ] User authentication for admin
- [ ] Image metadata editing
- [ ] Bulk operations
- [ ] Image search and filtering

## Setup Instructions

1. **Local Development**:
   ```bash
   # Start a local server (Python 3)
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   ```

2. **Production Deployment**:
   - Upload all files to your web server
   - Ensure folder permissions allow image access
   - Configure server for proper MIME types

## Notes
- This is a client-side only implementation
- Upload and delete functions are simulated
- For production use, implement proper server-side functionality
- Images are loaded directly from folders for simplicity

## Support
For questions or issues, please check the code comments or create an issue in the repository. 

# Ashwak Photography - Admin Panel

A modern, functional admin panel for managing photography portfolio images with drag & drop upload functionality.

## Features

- **Drag & Drop Upload**: Easy image upload with visual feedback
- **Category Management**: Organize images by categories (wedding, portrait, event, commercial, lifestyle)
- **Image Preview**: View uploaded images with details
- **Delete Functionality**: Remove images with confirmation
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Progress**: Upload progress tracking
- **File Validation**: Supports JPG, PNG, GIF, WebP up to 10MB
- **Modern UI**: Dark theme with glassmorphic design

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the Admin Panel**
   - Open your browser and go to: `http://localhost:3000/admin.html`
   - The main portfolio site is at: `http://localhost:3000/index.html`

### Development Mode

For development with auto-restart on file changes:
```bash
npm run dev
```

## File Structure

```
web/
├── admin.html          # Admin panel interface
├── admin-styles.css    # Admin panel styles
├── admin.js           # Admin panel functionality
├── server.js          # Node.js server
├── package.json       # Dependencies
├── index.html         # Main portfolio site
├── styles.css         # Main site styles
├── script.js          # Main site functionality
└── Image/             # Image storage folders
    ├── wedding/
    ├── portrait/
    ├── event/
    ├── commercial/
    └── lifestyle/
```

## API Endpoints

### Upload Images
- **POST** `/api/upload`
- **Body**: FormData with `images`, `category`, `title`, `description`
- **Response**: Upload success/failure with file details

### Get All Images
- **GET** `/api/images`
- **Response**: Array of all images with metadata

### Delete Image
- **DELETE** `/api/images/:category/:filename`
- **Response**: Deletion success/failure

### Get Categories
- **GET** `/api/categories`
- **Response**: Array of categories with image counts

## Usage

### Uploading Images

1. **Select Category**: Choose the appropriate category for your images
2. **Add Details**: Optionally add title and description
3. **Upload Images**: 
   - Drag & drop images onto the upload zone, or
   - Click "Choose Files" to select images
4. **Submit**: Click "Upload Images" to start the upload process

### Managing Images

1. **View Images**: Browse uploaded images by category
2. **Image Details**: Click on any image to view details
3. **Delete Images**: Use the delete button to remove images
4. **Filter**: Use category buttons to filter images

## Configuration

### File Limits
- Maximum file size: 10MB per image
- Maximum files per upload: 10 images
- Supported formats: JPG, PNG, GIF, WebP

### Server Configuration
- Port: 3000 (configurable via PORT environment variable)
- CORS enabled for cross-origin requests
- Static file serving for images and HTML files

## Troubleshooting

### Server Won't Start
- Check if Node.js is installed: `node --version`
- Check if dependencies are installed: `npm install`
- Check if port 3000 is available

### Upload Issues
- Ensure images are under 10MB
- Check file format (JPG, PNG, GIF, WebP only)
- Verify server is running on localhost:3000

### Image Not Displaying
- Check if image file exists in the correct folder
- Verify file permissions
- Check browser console for errors

## Security Notes

- This is a development setup - for production, add authentication
- Consider adding rate limiting for uploads
- Implement proper error handling and logging
- Add input validation and sanitization

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - feel free to use and modify as needed.

## Support

For issues or questions, please check the troubleshooting section above or create an issue in the repository. 