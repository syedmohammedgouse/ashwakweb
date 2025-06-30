// Admin JavaScript
let allImages = [];
let currentFolder = 'all';
let selectedImage = null;

// Initialize admin interface
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up login...');
    
    // Show login first
    showLogin();
    
    // Add login form event listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            const pw = document.getElementById('adminPassword').value;
            console.log('Password entered:', pw);
            if (pw === 'ashwak100') {
                console.log('Password correct, showing admin panel');
                showAdmin();
                window.adminPanel = new AdminPanel();
            } else {
                console.log('Password incorrect');
                setLoginError('Incorrect password.');
            }
        });
    } else {
        console.error('Login form not found!');
    }
});

// Initialize admin interface
function initializeAdmin() {
    // Set up folder navigation
    document.querySelectorAll('.folder-item').forEach(item => {
        item.addEventListener('click', () => {
            const folder = item.dataset.folder;
            switchFolder(folder);
        });
    });

    // Set up toolbar buttons
    document.getElementById('uploadBtn').addEventListener('click', toggleUploadArea);
    document.getElementById('refreshBtn').addEventListener('click', loadImages);
}

// Setup event listeners
function setupEventListeners() {
    // File input change
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    
    // Drag and drop
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Modal close
    document.getElementById('imageModal').addEventListener('click', (e) => {
        if (e.target.id === 'imageModal') {
            closeModal();
        }
    });
}

// Load images from folders
async function loadImages() {
    showLoading();
    
    try {
        allImages = [];
        
        // Load wedding images
        const weddingImages = await loadImagesFromFolder('Wedding ', 'wedding');
        allImages.push(...weddingImages);
        
        // Load portfolio images
        const portfolioImages = await loadImagesFromFolder('Pics ', 'pics');
        allImages.push(...portfolioImages);
        
        // Sort by date (newest first)
        allImages.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        updateStats();
        displayImages(allImages);
        
    } catch (error) {
        console.error('Error loading images:', error);
        showError('Failed to load images');
    } finally {
        hideLoading();
    }
}

// Load images from a specific folder
async function loadImagesFromFolder(folderPath, categoryId) {
    const images = [];
    
    // This would be replaced with actual server-side folder scanning
    // For now, using the same approach as the main site
    const imageFiles = getImageFilesForFolder(categoryId);
    
    for (const filename of imageFiles) {
        const imagePath = `${folderPath}${filename}`;
        
        // Check if image exists
        try {
            const response = await fetch(imagePath, { method: 'HEAD' });
            if (response.ok) {
                images.push({
                    src: imagePath,
                    filename: filename,
                    folder: folderPath,
                    category: categoryId,
                    date: new Date(), // In real implementation, get actual file date
                    size: 'Unknown' // In real implementation, get actual file size
                });
            }
        } catch (error) {
            console.warn(`Image not found: ${imagePath}`);
        }
    }
    
    return images;
}

// Get image files for each folder (replace with actual folder scanning)
function getImageFilesForFolder(categoryId) {
    if (categoryId === 'wedding') {
        return [
            '7M400889-1.jpg', '7M401119-1.jpg', 'ASH02858.jpg', 'ASH02903.jpg',
            'ASH02870.jpg', '7M401899.jpg', '7M401870-1.jpg', 'ASH00014-Enhanced-RD.jpg',
            '7M401838-2.jpg', '7M401772_1-1.jpg', '7M401761_1-1.jpg', 'ASH02969.jpg',
            'ASH03000.JPG', 'ASH03127.JPG', 'ASH03702.JPG', 'ASH03716.JPG',
            'DSC07011 (1).jpg', 'DSC07100.jpg', 'DSC07417 (1).jpg', 'DSC09269.JPG',
            'DSC09684.jpg', 'DSC09720-.jpg', 'DSC09727-.jpg', 'DSC6310-.jpg',
            'DSC_2390-01.jpeg', 'DSC_2421-01.jpeg', 'DSC_2610-01.jpeg', 'DSC_3479-02.jpeg',
            'DSC_3482-01.jpeg', 'DSC_3485-01.jpeg', 'DSC_3493 (1)-02.jpeg', 'DSC_3687-01.jpeg',
            'DSC_3711-01.jpeg', 'DSC_8580-1-01.jpeg', 'IMG_3169.JPG', 'IMG_3170.JPG',
            'IMG_3171.JPG', 'IMG_3172.JPG', 'IMG_3173.JPG', 'IMG_3174.JPG',
            'IMG_3176.JPG', 'IMG_3177.JPG', 'IMG_3178.JPG', 'IMG_3179.JPG',
            'IMG_3180.JPG', 'IMG_3181.JPG', 'IMG_3182.JPG', 'IMG_3183.JPG',
            '_ASH5474.jpg', '_ASH5486.jpg', '_ASH6552.jpg', '_ASH6562.jpg',
            '_ASH6605.jpg', '_ASH6623.jpg', '_ASH6817.jpg', '_ASH6822.jpg',
            '_ASH6861.jpg', '_ASH6870.jpg', '_ASH6958.jpg', '_ASH7059.jpg',
            '_ASH7100.jpg', '_ASH7122.jpg', '_ASH7214.jpg', '_ASH7218.jpg',
            '_ASH7232.jpg', '_ASH7235.jpg', '_ASH7628.jpg', '_ASH7674.jpg',
            '_ASH9776.jpg', '_ASH9827.jpg', '_ASH9835.jpg', '_ASH9842.jpg',
            '_ASH9858.jpg', '_ASH9872.jpg', '_ASH9891.jpg', '_DSC0596-.jpg',
            '_DSC0696-.jpg', '_DSC0723-.jpg', '_DSC0856-.jpg', '_DSC0893-.jpg',
            '_DSC5453-.jpg', '_DSC5473-.jpg', '_DSC6736.jpg', '_DSC6835.jpg',
            '_DSC7162_1.jpg', '_DSC7171.jpg', '_DSC7224.jpg', '_DSC7383.jpg',
            '_DSC7448.jpg', '_DSC7463.jpg', '_DSC7603-.jpg', '_DSC7917-.jpg',
            '_DSC7923-.jpg', '_DSC7926-.jpg', '_DSC8011.jpg', '_DSC8211-.jpg',
            '_DSC8242- 2.jpg', '_DSC8257- 33.jpg'
        ];
    } else if (categoryId === 'pics') {
        return [
            '01.jpg', '04.jpg', '05.jpg', '07.jpg', '09.jpg', '10.jpg',
            '11(1).jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg',
            '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg',
            '22.jpg', '25.jpg', '26.jpg', 'A(10).jpg', 'DSC00032.jpg',
            'DSC00457(1).jpg', 'DSC00709(1).jpg', 'DSC01331.jpg', 'DSC01338.jpg',
            'DSC01503 (1).jpg', 'DSC01544.jpg', 'DSC01918.jpg', 'DSC02009.jpg',
            'DSC02048.jpg', 'DSC02114.jpg', 'DSC02159.jpg', 'DSC02188.jpg',
            'DSC02196.jpg', 'DSC02391.jpg', 'DSC02402.jpg', 'DSC02403.jpg',
            'DSC02412-1.jpg', 'DSC02421.jpg', 'DSC02429.jpg', 'DSC02435.jpg',
            'DSC02437.jpg', 'DSC02449.jpg', 'DSC02753.jpg', 'DSC02772.jpg',
            'DSC02780.jpg', 'DSC02800-1.jpg', 'DSC04773.JPG', 'DSC04788.JPG',
            'DSC04804.JPG', '_DSC0050.JPG', '_DSC0084.JPG', '_DSC0428.JPG'
        ];
    }
    
    return [];
}

// Display images in admin grid
function displayImages(images) {
    const grid = document.getElementById('adminImageGrid');
    grid.innerHTML = '';
    
    images.forEach((image, index) => {
        const item = createImageItem(image, index);
        grid.appendChild(item);
    });
    
    updateCurrentCount(images.length);
}

// Create image item for admin grid
function createImageItem(image, index) {
    const item = document.createElement('div');
    item.className = 'admin-image-item';
    item.dataset.index = index;
    
    item.innerHTML = `
        <img src="${image.src}" alt="${image.filename}" loading="lazy">
        <div class="image-overlay">
            <div class="image-actions">
                <button class="image-action-btn" onclick="viewImage(${index})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="image-action-btn" onclick="deleteImage(${index})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="image-info">
            <div class="image-filename">${image.filename}</div>
        </div>
    `;
    
    return item;
}

// Switch folder
function switchFolder(folder) {
    currentFolder = folder;
    
    // Update active folder
    document.querySelectorAll('.folder-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-folder="${folder}"]`).classList.add('active');
    
    // Filter images
    let filteredImages = allImages;
    if (folder !== 'all') {
        filteredImages = allImages.filter(img => img.folder === folder);
    }
    
    // Update display
    displayImages(filteredImages);
    updateCurrentFolder(folder);
}

// Update current folder display
function updateCurrentFolder(folder) {
    const folderNames = {
        'all': 'All Images',
        'Wedding ': 'Wedding',
        'Pics ': 'Portfolio'
    };
    
    document.getElementById('currentFolder').textContent = folderNames[folder] || folder;
}

// Update current count
function updateCurrentCount(count) {
    document.getElementById('currentCount').textContent = `${count} images`;
}

// Update statistics
function updateStats() {
    const totalImages = allImages.length;
    const weddingCount = allImages.filter(img => img.category === 'wedding').length;
    const portfolioCount = allImages.filter(img => img.category === 'pics').length;
    
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('weddingCount').textContent = weddingCount;
    document.getElementById('portfolioCount').textContent = portfolioCount;
    
    // Update folder counts
    document.querySelector('[data-folder="all"] .count').textContent = totalImages;
    document.querySelector('[data-folder="Wedding "] .count').textContent = weddingCount;
    document.querySelector('[data-folder="Pics "] .count').textContent = portfolioCount;
}

// Toggle upload area
function toggleUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const isVisible = uploadArea.style.display !== 'none';
    
    uploadArea.style.display = isVisible ? 'none' : 'block';
    
    const btn = document.getElementById('uploadBtn');
    if (isVisible) {
        btn.innerHTML = '<i class="fas fa-upload"></i> Upload Images';
    } else {
        btn.innerHTML = '<i class="fas fa-times"></i> Cancel Upload';
    }
}

// Handle file upload
function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        uploadFiles(files);
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = '#667eea';
    event.currentTarget.style.background = '#f8f9ff';
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        uploadFiles(files);
    }
    
    // Reset upload area
    event.currentTarget.style.borderColor = '#ddd';
    event.currentTarget.style.background = '#fafafa';
}

// Upload files (simulated)
function uploadFiles(files) {
    // In a real implementation, this would upload to server
    console.log('Uploading files:', files);
    
    // Simulate upload
    showMessage('Files uploaded successfully! (This is a demo - no actual upload)');
    
    // Refresh images after upload
    setTimeout(() => {
        loadImages();
        toggleUploadArea();
    }, 1000);
}

// View image in modal
function viewImage(index) {
    const image = allImages[index];
    selectedImage = image;
    
    document.getElementById('modalImage').src = image.src;
    document.getElementById('modalFilename').textContent = image.filename;
    document.getElementById('modalFolder').textContent = image.folder;
    document.getElementById('modalSize').textContent = image.size;
    document.getElementById('modalDate').textContent = image.date.toLocaleDateString();
    
    document.getElementById('imageModal').classList.add('show');
}

// Delete image
function deleteImage(index) {
    const image = allImages[index];
    
    if (confirm(`Are you sure you want to delete "${image.filename}"?`)) {
        // In a real implementation, this would delete from server
        console.log('Deleting image:', image);
        
        // Remove from array
        allImages.splice(index, 1);
        
        // Refresh display
        switchFolder(currentFolder);
        updateStats();
        
        showMessage('Image deleted successfully! (This is a demo - no actual deletion)');
    }
}

// Close modal
function closeModal() {
    document.getElementById('imageModal').classList.remove('show');
    selectedImage = null;
}

// Show loading
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('adminImageGrid').style.display = 'none';
}

// Hide loading
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('adminImageGrid').style.display = 'grid';
}

// Show message
function showMessage(message) {
    // Create temporary message
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    msgDiv.textContent = message;
    
    document.body.appendChild(msgDiv);
    
    setTimeout(() => {
        msgDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// Show error
function showError(message) {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    msgDiv.textContent = message;
    
    document.body.appendChild(msgDiv);
    
    setTimeout(() => {
        msgDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.selectedFiles = [];
        this.currentCategory = 'all';
        this.images = [];
        this.apiBase = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadImages();
        this.setupDragAndDrop();
        this.updateStats();
    }

    bindEvents() {
        // Upload form events
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files);
        });

        document.getElementById('submitUpload').addEventListener('click', () => {
            this.uploadFiles();
        });

        document.getElementById('clearUpload').addEventListener('click', () => {
            this.clearUpload();
        });

        // Category filter events
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
            });
        });

        // Modal events
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('deleteImage').addEventListener('click', () => {
            this.deleteCurrentImage();
        });

        document.getElementById('cancelDelete').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on outside click
        document.getElementById('imageModal').addEventListener('click', (e) => {
            if (e.target.id === 'imageModal') {
                this.closeModal();
            }
        });

        // Form validation
        document.getElementById('category').addEventListener('change', () => {
            this.validateForm();
        });
    }

    setupDragAndDrop() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        uploadZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleFileSelection(files);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight(e) {
            uploadZone.classList.add('dragover');
        }

        function unhighlight(e) {
            uploadZone.classList.remove('dragover');
        }
    }

    handleFileSelection(files) {
        this.selectedFiles = Array.from(files).filter(file => {
            return file.type.startsWith('image/');
        });

        if (this.selectedFiles.length === 0) {
            this.showMessage('Please select valid image files (JPG, PNG, GIF, WebP).', 'error');
            return;
        }

        this.displayFilePreview();
        this.validateForm();
    }

    displayFilePreview() {
        const filesGrid = document.getElementById('filesGrid');
        const uploadedFiles = document.getElementById('uploadedFiles');
        
        filesGrid.innerHTML = '';
        
        this.selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const reader = new FileReader();
            reader.onload = (e) => {
                fileItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                `;
            };
            reader.readAsDataURL(file);
            
            filesGrid.appendChild(fileItem);
        });
        
        uploadedFiles.style.display = 'block';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    validateForm() {
        const category = document.getElementById('category').value;
        const submitBtn = document.getElementById('submitUpload');
        
        submitBtn.disabled = !category || this.selectedFiles.length === 0;
    }

    async uploadFiles() {
        const category = document.getElementById('category').value;
        const title = document.getElementById('imageTitle').value;
        const description = document.getElementById('imageDescription').value;

        if (!category || this.selectedFiles.length === 0) {
            this.showMessage('Please select a category and at least one image.', 'error');
            return;
        }

        console.log(`Starting upload of ${this.selectedFiles.length} files to category: ${category}`);

        const progressBar = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const uploadStatus = document.getElementById('uploadStatus');
        const uploadProgress = document.getElementById('uploadProgress');

        uploadProgress.style.display = 'block';
        uploadStatus.innerHTML = '';

        try {
            const formData = new FormData();
            formData.append('category', category);
            formData.append('title', title);
            formData.append('description', description);

            this.selectedFiles.forEach((file, index) => {
                console.log(`Adding file ${index + 1}: ${file.name} (${file.size} bytes)`);
                formData.append('images', file);
            });

            console.log('Sending upload request to server...');
            const response = await fetch(`${this.apiBase}/upload`, {
                method: 'POST',
                body: formData
            });

            console.log(`Server response status: ${response.status}`);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Upload failed:', errorData);
                throw new Error(errorData.error || `Upload failed with status ${response.status}`);
            }

            const result = await response.json();
            console.log('Upload successful:', result);
            
            // Update progress
            progressBar.style.width = '100%';
            progressText.textContent = '100%';
            uploadStatus.innerHTML = result.message;
            
            this.showMessage(result.message, 'success');
            
            // Clear form and reload images
            setTimeout(() => {
                this.clearUpload();
                this.loadImages();
                this.updateStats();
                
                // Refresh the main website to show new images
                this.refreshMainWebsite();
            }, 2000);

        } catch (error) {
            console.error('Upload error:', error);
            this.showMessage(`Upload failed: ${error.message}`, 'error');
            uploadStatus.innerHTML = 'Upload failed. Please try again.';
        }
    }

    // Refresh the main website to show new images
    refreshMainWebsite() {
        try {
            // Try to send a message to the main page if it's open
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage({ type: 'REFRESH_IMAGES' }, '*');
            }
            
            // Also try to refresh the main page directly
            const mainPageUrl = window.location.href.replace('/admin.html', '/index.html');
            if (mainPageUrl !== window.location.href) {
                // Open main page in new tab if not already open
                window.open(mainPageUrl, '_blank');
            }
            
            // Show a message to the user
            this.showMessage('Images uploaded successfully! The main website will refresh to show new images.', 'success');
            
        } catch (error) {
            console.log('Could not refresh main website:', error);
            this.showMessage('Images uploaded! Please refresh the main website to see new images.', 'info');
        }
    }

    clearUpload() {
        this.selectedFiles = [];
        document.getElementById('fileInput').value = '';
        document.getElementById('category').value = '';
        document.getElementById('imageTitle').value = '';
        document.getElementById('imageDescription').value = '';
        document.getElementById('uploadedFiles').style.display = 'none';
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('submitUpload').disabled = true;
    }

    async loadImages() {
        const loadingState = document.getElementById('loadingState');
        const emptyState = document.getElementById('emptyState');
        const imagesGrid = document.getElementById('imagesGrid');

        loadingState.style.display = 'block';
        emptyState.style.display = 'none';
        imagesGrid.innerHTML = '';

        try {
            const response = await fetch(`${this.apiBase}/images`);
            
            if (!response.ok) {
                throw new Error('Failed to load images');
            }

            const data = await response.json();
            this.images = data.images || [];
            this.displayImages(this.images);
            this.updateStats();

        } catch (error) {
            console.error('Error loading images:', error);
            this.showMessage('Failed to load images. Please refresh the page.', 'error');
        } finally {
            loadingState.style.display = 'none';
        }
    }

    displayImages(images) {
        const imagesGrid = document.getElementById('imagesGrid');
        const emptyState = document.getElementById('emptyState');

        if (images.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        imagesGrid.innerHTML = '';

        images.forEach(image => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.addEventListener('click', () => {
                this.openImageModal(image);
            });

            imageItem.innerHTML = `
                <img src="${image.url}" alt="${image.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K'">
                <div class="image-info">
                    <h4>${image.title}</h4>
                    <p>${image.category}</p>
                    <p>${this.formatFileSize(image.size)}</p>
                    <div class="image-actions">
                        <button class="action-btn" onclick="event.stopPropagation(); adminPanel.openImageModal(${JSON.stringify(image).replace(/"/g, '&quot;')})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="action-btn delete" onclick="event.stopPropagation(); adminPanel.deleteImage('${image.category}', '${image.name}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;

            imagesGrid.appendChild(imageItem);
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Filter images
        const filteredImages = category === 'all' 
            ? this.images 
            : this.images.filter(img => img.category === category);

        this.displayImages(filteredImages);
    }

    openImageModal(image) {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalFilename = document.getElementById('modalFilename');
        const modalCategory = document.getElementById('modalCategory');
        const modalSize = document.getElementById('modalSize');
        const modalDate = document.getElementById('modalDate');

        modalImage.src = image.url;
        modalImage.alt = image.title;
        modalFilename.textContent = image.name;
        modalCategory.textContent = image.category;
        modalSize.textContent = this.formatFileSize(image.size);
        modalDate.textContent = new Date(image.uploadDate).toLocaleDateString();

        modal.classList.add('show');
        modal.dataset.imageCategory = image.category;
        modal.dataset.imageName = image.name;
    }

    closeModal() {
        const modal = document.getElementById('imageModal');
        modal.classList.remove('show');
        delete modal.dataset.imageCategory;
        delete modal.dataset.imageName;
    }

    deleteCurrentImage() {
        const modal = document.getElementById('imageModal');
        const category = modal.dataset.imageCategory;
        const filename = modal.dataset.imageName;
        
        if (category && filename) {
            this.deleteImage(category, filename);
        }
    }

    async deleteImage(category, filename) {
        if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
            try {
                const response = await fetch(`${this.apiBase}/images/${category}/${filename}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Delete failed');
                }

                const result = await response.json();
                this.showMessage(result.message, 'success');
                this.closeModal();
                this.loadImages(); // Reload all images
                this.updateStats();

            } catch (error) {
                console.error('Delete error:', error);
                this.showMessage(`Failed to delete image: ${error.message}`, 'error');
            }
        }
    }

    showMessage(message, type = 'info') {
        const messageContainer = document.getElementById('messageContainer');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-info-circle';
        
        messageElement.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        messageContainer.appendChild(messageElement);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageContainer.contains(messageElement)) {
                    messageContainer.removeChild(messageElement);
                }
            }, 300);
        }, 5000);
    }

    async updateStats() {
        // Fetch all images and calculate stats
        try {
            const response = await fetch(`${this.apiBase}/images`);
            if (!response.ok) return;
            const data = await response.json();
            const images = data.images || [];
            let totalSize = 0;
            images.forEach(img => { totalSize += img.size; });
            document.getElementById('statTotalImages').textContent = images.length;
            document.getElementById('statTotalSize').textContent = this.formatFileSize(totalSize);
        } catch (e) {}
    }
}

// Login logic
function showLogin() {
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('adminContainer').style.display = 'none';
}

function showAdmin() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';
}

function setLoginError(msg) {
    document.getElementById('loginError').textContent = msg;
}

// Check if server is running
async function checkServerStatus() {
    try {
        const response = await fetch('http://localhost:3000/api/images');
        if (!response.ok) {
            throw new Error('Server not responding');
        }
        console.log('✅ Server is running');
    } catch (error) {
        console.warn('⚠️ Server is not running. Please start the server with: npm start');
        console.warn('The admin panel will work in demo mode only.');
        
        // Show warning message
        setTimeout(() => {
            const adminPanel = window.adminPanel;
            if (adminPanel) {
                adminPanel.showMessage('Server is not running. Uploads will be simulated. Start server with: npm start', 'info');
            }
        }, 1000);
    }
}

// Check server status on load
window.addEventListener('load', checkServerStatus); 