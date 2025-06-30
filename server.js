const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const category = req.body.category || 'misc';
        const uploadPath = path.join(__dirname, 'Image', category);
        
        // Create directory if it doesn't exist
        fs.mkdir(uploadPath, { recursive: true })
            .then(() => cb(null, uploadPath))
            .catch(err => cb(err));
    },
    filename: function (req, file, cb) {
        // Keep original filename but ensure uniqueness
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, name + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept all image types
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Routes

// Upload images
app.post('/api/upload', upload.array('images', 50), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const category = req.body.category || 'misc';
        const title = req.body.title || '';
        const description = req.body.description || '';
        
        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            category: category,
            url: `/Image/${category}/${file.filename}`,
            size: file.size,
            title: title || path.basename(file.originalname, path.extname(file.originalname)),
            description: description
        }));

        console.log(`Uploaded ${uploadedFiles.length} files to ${category} category`);
        
        res.json({ 
            message: `Successfully uploaded ${uploadedFiles.length} image(s)`,
            files: uploadedFiles
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Get all images
app.get('/api/images', async (req, res) => {
    try {
        const images = [];
        const categories = ['birthday', 'maternity', 'pre-wedding', 'wedding', 'post-wedding', 'baby-shoots'];
        
        console.log('Scanning for images in categories:', categories);
        
        for (const category of categories) {
            const categoryPath = path.join(__dirname, 'Image', category);
            
            try {
                // Check if directory exists
                const dirExists = await fs.access(categoryPath).then(() => true).catch(() => false);
                
                if (!dirExists) {
                    console.log(`Category directory ${category} does not exist, skipping...`);
                    continue;
                }
                
                const files = await fs.readdir(categoryPath);
                console.log(`Found ${files.length} files in ${category} directory`);
                
                const imageFiles = files.filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'].includes(ext);
                    if (isImage) {
                        console.log(`  - ${file} (${category})`);
                    }
                    return isImage;
                });
                
                console.log(`  Total images in ${category}: ${imageFiles.length}`);
                
                for (const file of imageFiles) {
                    const filePath = path.join(categoryPath, file);
                    const stats = await fs.stat(filePath);
                    
                    images.push({
                        name: file,
                        category: category,
                        url: `/Image/${category}/${file}`,
                        size: stats.size,
                        uploadDate: stats.mtime,
                        title: path.basename(file, path.extname(file)).replace(/[-_]/g, ' '),
                        description: `${category.replace('-', ' ')} photography`
                    });
                }
            } catch (error) {
                console.log(`Error scanning ${category} folder:`, error.message);
            }
        }
        
        console.log(`Total images found across all categories: ${images.length}`);
        res.json({ images: images });
    } catch (error) {
        console.error('Error getting images:', error);
        res.status(500).json({ error: 'Failed to get images' });
    }
});

// Get images from a specific folder
app.get('/api/folder/:folderPath(*)', async (req, res) => {
    try {
        const folderPath = decodeURIComponent(req.params.folderPath);
        const fullPath = path.join(__dirname, folderPath);
        
        console.log(`Scanning folder: ${folderPath}`);
        
        // Security check - ensure path is within Image directory
        const normalizedPath = path.normalize(fullPath);
        const imageDir = path.join(__dirname, 'Image');
        
        if (!normalizedPath.startsWith(imageDir)) {
            console.log(`Access denied for path: ${folderPath}`);
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // Check if directory exists
        const dirExists = await fs.access(fullPath).then(() => true).catch(() => false);
        
        if (!dirExists) {
            console.log(`Directory does not exist: ${fullPath}`);
            return res.json({ files: [] });
        }
        
        const files = await fs.readdir(fullPath);
        console.log(`Found ${files.length} files in ${folderPath}`);
        
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'].includes(ext);
            if (isImage) {
                console.log(`  - ${file}`);
            }
            return isImage;
        });
        
        console.log(`Returning ${imageFiles.length} image files from ${folderPath}`);
        res.json({ files: imageFiles });
    } catch (error) {
        console.error('Error reading folder:', error);
        res.status(500).json({ error: 'Failed to read folder' });
    }
});

// Delete image
app.delete('/api/images/:category/:filename', async (req, res) => {
    try {
        const { category, filename } = req.params;
        const filePath = path.join(__dirname, 'Image', category, filename);
        
        // Security check
        const normalizedPath = path.normalize(filePath);
        const imageDir = path.join(__dirname, 'Image');
        
        if (!normalizedPath.startsWith(imageDir)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        await fs.unlink(filePath);
        
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// Get categories
app.get('/api/categories', (req, res) => {
    const categories = [
        { id: 'birthday', name: 'Birthday', folder: 'Image/birthday/' },
        { id: 'maternity', name: 'Maternity', folder: 'Image/maternity/' },
        { id: 'pre-wedding', name: 'Pre-Wedding', folder: 'Image/pre-wedding/' },
        { id: 'wedding', name: 'Wedding', folder: 'Image/wedding/' },
        { id: 'post-wedding', name: 'Post-Wedding', folder: 'Image/post-wedding/' },
        { id: 'baby-shoots', name: 'Baby Shoots', folder: 'Image/baby-shoots/' }
    ];
    
    res.json({ categories: categories });
});

// Serve performance test
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'performance-test.html'));
});

// Serve responsive test page
app.get('/responsive-test', (req, res) => {
    res.sendFile(path.join(__dirname, 'responsive-test.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log('  GET  /api/images - Get all images');
    console.log('  GET  /api/folder/:path - Get files from folder');
    console.log('  POST /api/upload - Upload images');
    console.log('  DELETE /api/images/:category/:filename - Delete image');
    console.log('  GET  /api/categories - Get categories');
    console.log('  GET  /test - Serve performance test');
    console.log('  GET  /responsive-test - Serve responsive test');
}); 