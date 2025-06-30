// Dynamic image loading system - fetches from server API
let allImages = [];
let currentCategory = 'all';
let loadedImages = 0;
let isLoading = false;
let imageCache = new Map();
let currentLightboxIndex = 0;

// Image categories based on actual folder structure
const categories = [
    { id: 'all', name: 'All Photos', folder: '' },
    { id: 'birthday', name: 'Birthday', folder: 'Image/birthday/' },
    { id: 'maternity', name: 'Maternity', folder: 'Image/maternity/' },
    { id: 'pre-wedding', name: 'Pre-Wedding', folder: 'Image/pre-wedding/' },
    { id: 'wedding', name: 'Wedding', folder: 'Image/wedding/' },
    { id: 'post-wedding', name: 'Post-Wedding', folder: 'Image/post-wedding/' },
    { id: 'baby-shoots', name: 'Baby Shoots', folder: 'Image/baby-shoots/' }
];

// Main categories for the filter bar
const mainCategories = [
    { id: 'all', name: 'All Photos' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'baby-shoots', name: 'Baby Shoots' },
    { id: 'birthday', name: 'Birthday' },
    { id: 'maternity', name: 'Maternity' },
    { id: 'pre-wedding', name: 'Pre-Wedding' },
    { id: 'post-wedding', name: 'Post-Wedding' },
    { id: 'portrait', name: 'Portrait' }
];

// API base URL
const API_BASE = 'http://localhost:3000/api';

// Listen for messages from admin panel to refresh images
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'REFRESH_IMAGES') {
        console.log('Received refresh message from admin panel');
        loadImagesFromServer();
    }
});

// Create portfolio grid with dynamic loading
function createPortfolioGrid() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) {
        console.error('Portfolio grid element not found!');
        return;
    }

    console.log('Portfolio grid found, creating filters and loading images...');

    // Create category filter
    createCategoryFilter();
    
    // Load images dynamically from server
    loadImagesFromServer();
}

// Create category filter buttons
function createCategoryFilter() {
    const portfolioSection = document.querySelector('.portfolio-section');
    if (!portfolioSection) return;

    // Remove existing filter if any
    const existingFilter = document.querySelector('.category-filter');
    if (existingFilter) existingFilter.remove();

    const filterDiv = document.createElement('div');
    filterDiv.className = 'category-filter';
    
    mainCategories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category.name;
        button.dataset.category = category.id;
        button.onclick = () => filterByCategory(category.id);
        filterDiv.appendChild(button);
    });

    // Insert before the grid
    const grid = document.getElementById('portfolioGrid');
    grid.parentNode.insertBefore(filterDiv, grid);
    
    // Set first button as active
    filterDiv.querySelector('.category-btn').classList.add('active');
}

// Load images dynamically from server API
async function loadImagesFromServer() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) {
        console.error('Portfolio grid not found!');
        return;
    }

    console.log('Loading images from server API...');
    
    // Show loading state
    grid.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i><p>Loading images...</p></div>';
    
    try {
        // First try to fetch from server API
        console.log('Fetching from:', `${API_BASE}/images`);
        const response = await fetch(`${API_BASE}/images`);
        
        console.log('Server response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            const serverImages = data.images || [];
            
            console.log(`Received ${serverImages.length} images from server`);
            console.log('Image categories found:', [...new Set(serverImages.map(img => img.category))]);
            
            // Transform server data to our format
            allImages = serverImages.map(img => ({
                src: img.url,
                category: img.category,
                filename: img.name,
                title: img.title || img.name,
                description: img.description || ''
            }));
            
            console.log('Transformed images:', allImages.length);
        } else {
            throw new Error(`Server responded with ${response.status}`);
        }
        
    } catch (error) {
        console.log('Server not available or no images in database, scanning folders...', error);
        // If server fails, scan folders directly
        await loadImagesFromFolders();
        return;
    }
    
    // If no images from server, scan folders as fallback
    if (allImages.length === 0) {
        console.log('No images from server, scanning folders...');
        await loadImagesFromFolders();
    } else {
        // Shuffle for variety
        allImages.sort(() => Math.random() - 0.5);
        console.log(`Total images prepared: ${allImages.length}`);
        displayImages(allImages);
    }
}

// Load images by scanning actual folders
async function loadImagesFromFolders() {
    console.log('Scanning folders for images...');
    allImages = [];
    
    // Scan each category folder
    for (const category of categories) {
        if (category.id !== 'all') {
            try {
                const folderImages = await getImagesFromFolder(category.folder);
                console.log(`Found ${folderImages.length} images in ${category.id} folder`);
                
                folderImages.forEach(filename => {
                    allImages.push({
                        src: category.folder + filename,
                        category: category.id,
                        filename: filename,
                        title: filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
                        description: `${category.name} photography`
                    });
                });
            } catch (error) {
                console.warn(`Error scanning ${category.id} folder:`, error);
            }
        }
    }
    
    console.log(`Total images found in folders: ${allImages.length}`);
    
    // If still no images, use static fallback
    if (allImages.length === 0) {
        console.log('No images found in folders, using static fallback...');
        await loadStaticFallbackImages();
    } else {
        // Shuffle for variety
        allImages.sort(() => Math.random() - 0.5);
    }
    
    displayImages(allImages);
}

// Get images from a specific folder
async function getImagesFromFolder(folderPath) {
    try {
        // Try to fetch folder contents from server
        const response = await fetch(`${API_BASE}/folder/${encodeURIComponent(folderPath)}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`Server returned ${data.files.length} files for ${folderPath}`);
            return data.files || [];
        } else {
            console.log(`Server folder scan failed for ${folderPath} (${response.status})`);
            return [];
        }
    } catch (error) {
        console.log(`Server folder scan failed for ${folderPath}:`, error);
        return [];
    }
}

// Check if an image exists
async function imageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Render separate sections for each business category
function renderCategorySections() {
    const container = document.getElementById('categorySections');
    if (!container) return;
    container.innerHTML = '';

    // Group images by category
    const imagesByCategory = {};
    categories.forEach(cat => {
        if (cat.id !== 'all') imagesByCategory[cat.id] = [];
    });
    allImages.forEach(img => {
        if (imagesByCategory[img.category]) {
            imagesByCategory[img.category].push(img);
        }
    });

    categories.forEach(cat => {
        if (cat.id === 'all') return;
        const section = document.createElement('section');
        section.className = 'category-section';
        section.id = `section-${cat.id}`;

        const heading = document.createElement('h3');
        heading.className = 'category-title';
        heading.textContent = cat.name;
        section.appendChild(heading);

        const grid = document.createElement('div');
        grid.className = 'portfolio-grid';

        const images = imagesByCategory[cat.id];
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                const item = createImageElement(image, index, true);
                grid.appendChild(item);
            });
        } else {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.innerHTML = `<i class='fas fa-images'></i><h3>No images yet</h3><p>Upload some ${cat.name.toLowerCase()} photos!</p>`;
            grid.appendChild(empty);
        }
        section.appendChild(grid);
        container.appendChild(section);
    });
}

// Render the category filter bar
function renderCategoryFilterBar() {
    const filterBar = document.getElementById('categoryFilterBar');
    if (!filterBar) return;
    filterBar.innerHTML = '';

    // Add refresh button first
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'refresh-btn';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Images';
    refreshBtn.title = 'Refresh images from server';
    refreshBtn.onclick = () => {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        loadImagesFromServer().finally(() => {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Images';
            refreshBtn.disabled = false;
        });
    };
    filterBar.appendChild(refreshBtn);

    mainCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = cat.name;
        btn.dataset.category = cat.id;
        if (cat.id === 'all') btn.classList.add('active');
        btn.onclick = () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCategorySections(cat.id);
        };
        filterBar.appendChild(btn);
    });
}

// Show/hide category sections based on filter
function filterCategorySections(categoryId) {
    categories.forEach(cat => {
        if (cat.id === 'all') return;
        const section = document.getElementById(`section-${cat.id}`);
        if (!section) return;
        if (categoryId === 'all' || categoryId === cat.id) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });
}

// Call this after rendering sections
function displayImages(images, category) {
    renderCategorySections();
    renderCategoryFilterBar();
    filterCategorySections(category || 'all');
    const grid = document.getElementById('portfolioGrid');
    if (grid && images.length === 0 && category && category !== 'all') {
        grid.innerHTML = `<div class='empty-state'><i class='fas fa-image'></i><h3>No images in this category yet</h3></div>`;
    }
}

// Handle masonry layout recalculation
function recalculateMasonry() {
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach(item => {
        const img = item.querySelector('img');
        if (img && img.complete && img.naturalHeight) {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            const gridRowSpan = Math.ceil(aspectRatio * 10);
            item.style.gridRowEnd = `span ${Math.max(gridRowSpan, 20)}`;
        }
    });
}

// Enhanced image loading with masonry support
function loadImage(img, src, item) {
    img.onload = function() {
        const aspectRatio = this.naturalHeight / this.naturalWidth;
        const gridRowSpan = Math.ceil(aspectRatio * 10);
        item.style.gridRowEnd = `span ${Math.max(gridRowSpan, 20)}`;
        item.classList.add('loaded');
        
        // Trigger masonry recalculation
        setTimeout(recalculateMasonry, 100);
    };
    
    img.onerror = function() {
        item.classList.add('error');
        item.innerHTML = '<div class="error-placeholder"><i class="fas fa-image"></i><p>Image not found</p></div>';
    };
    
    img.src = src;
}

// Create image element with masonry layout
function createImageElement(image, index, highPriority = false) {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.dataset.category = image.category;
    item.dataset.index = index;
    
    const img = document.createElement('img');
    img.alt = image.title || image.filename;
    img.loading = highPriority ? 'eager' : 'lazy';
    
    // Load image with masonry support
    if (highPriority) {
        loadImage(img, image.src, item);
    } else {
        // For lazy loading, store the src for later
        item.dataset.src = image.src;
        img.onload = function() {
            const aspectRatio = this.naturalHeight / this.naturalWidth;
            const gridRowSpan = Math.ceil(aspectRatio * 10);
            item.style.gridRowEnd = `span ${Math.max(gridRowSpan, 20)}`;
            item.classList.add('loaded');
        };
    }
    
    item.appendChild(img);
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'portfolio-overlay';
    overlay.innerHTML = `
        <h3>${image.title || image.filename}</h3>
        <p>${image.description || image.category}</p>
        <a href="#" class="view-btn" onclick="openLightboxWithImage('${image.src}', '${image.title || image.filename}'); return false;">
            <i class="fas fa-expand"></i> View
        </a>
    `;
    item.appendChild(overlay);
    
    // Add click handler for lightbox
    item.addEventListener('click', (e) => {
        if (!e.target.closest('.view-btn')) {
            openLightboxWithImage(image.src, image.title || image.filename);
        }
    });
    
    return item;
}

// Create lightweight placeholder for lazy loading
function createImagePlaceholder(image, index) {
    const item = document.createElement('div');
    item.className = 'portfolio-item placeholder';
    item.dataset.category = image.category;
    item.dataset.index = index;
    item.dataset.src = image.src;
    
    // Create skeleton loading
    item.innerHTML = `
        <div class="skeleton-image"></div>
        <div class="portfolio-overlay">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
        </div>
    `;
    
    return item;
}

// Setup lazy loading for remaining images
function setupLazyLoading() {
    const placeholders = document.querySelectorAll('.portfolio-item.placeholder');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const src = item.dataset.src;
                const index = parseInt(item.dataset.index);
                
                // Replace placeholder with actual image
                const img = document.createElement('img');
                img.alt = 'Portfolio image';
                img.loading = 'lazy';
                
                const overlay = document.createElement('div');
                overlay.className = 'portfolio-overlay';
                overlay.innerHTML = `
                    <h3>Image ${index + 1}</h3>
                    <p>Portfolio image</p>
                    <a href="#" class="view-btn" onclick="openLightboxWithImage('${src}', 'Image ${index + 1}'); return false;">
                        <i class="fas fa-eye"></i> View
                    </a>
                `;
                
                item.innerHTML = '';
                item.appendChild(img);
                item.appendChild(overlay);
                
                loadImage(img, src, item);
                
                observer.unobserve(item);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    placeholders.forEach(placeholder => {
        observer.observe(placeholder);
    });
}

// Filter images by category
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${categoryId}"]`).classList.add('active');
    
    // Filter images
    const filteredImages = categoryId === 'all' 
        ? allImages 
        : allImages.filter(img => img.category === categoryId);
    
    // Update lightbox images
    window.lightboxImages = filteredImages;
    
    // Display filtered images
    displayImages(filteredImages, categoryId);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Ashwak Photography Portfolio...');
    
    // Ensure page starts at the top
    window.scrollTo(0, 0);
    
    // Initialize all features except portfolio (which will be loaded after a delay)
    initCustomCursor();
    initNavigation();
    initParallax();
    initLightbox();
    initSmoothScrolling();
    initAnimations();
    initTitleFadeOut();
    
    // Delay portfolio loading to let hero section show first
    setTimeout(() => {
        initPortfolio();
    }, 1000); // Wait 1 second before loading portfolio
});

// Title Fade Out Animation
function initTitleFadeOut() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // Wait for initial animations to complete, then fade out the title
    setTimeout(() => {
        heroTitle.classList.add('fade-out');
    }, 3000); // Start fade out after 3 seconds
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const follower = document.getElementById('customCursorFollower');
    
    if (!cursor || !follower) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    // Cursor effects on hoverable elements
    const hoverElements = document.querySelectorAll('a, button, .portfolio-item, .cta-button');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            follower.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
        });
    });
}

// Navigation
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('show');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax Effect
function initParallax() {
    const heroImage = document.getElementById('heroImage');
    
    if (!heroImage) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    });
}

// Portfolio Management
function initPortfolio() {
    loadImagesFromFolders();
    setupCategoryFilter();
}

// Update category filter to only show categories with images
function updateCategoryFilter() {
    const filterContainer = document.querySelector('.category-filter');
    if (!filterContainer) return;
    filterContainer.innerHTML = '';

    mainCategories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.dataset.category = category.id;
        button.textContent = category.name;
        if (category.id === 'all') button.classList.add('active');
        filterContainer.appendChild(button);
    });

    setupCategoryFilter();
}

function setupCategoryFilter() {
    const filterButtons = document.querySelectorAll('.category-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = category;
            const filteredImages = category === 'all'
                ? allImages
                : allImages.filter(img => img.category === category);
            displayImages(filteredImages, category);
        });
    });
}

// Lightbox
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close button
    const closeBtn = document.getElementById('lightboxClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    // Navigation buttons
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateLightbox(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateLightbox(1));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    // Get current filtered images for lightbox navigation
    const currentImages = currentCategory === 'all' 
        ? allImages 
        : allImages.filter(img => img.category === currentCategory);
    
    const newIndex = currentLightboxIndex + direction;
    
    if (newIndex >= 0 && newIndex < currentImages.length) {
        currentLightboxIndex = newIndex;
        const image = currentImages[currentLightboxIndex];
        const lightboxImage = document.getElementById('lightboxImage');
        
        if (lightboxImage && image) {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.title || image.filename;
            updateLightboxNavigation(currentImages, newIndex);
        }
    }
}

function updateLightboxNavigation(images, currentIndex) {
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    if (prevBtn) {
        prevBtn.style.opacity = currentIndex > 0 ? '1' : '0.3';
        prevBtn.style.pointerEvents = currentIndex > 0 ? 'auto' : 'none';
    }
    
    if (nextBtn) {
        nextBtn.style.opacity = currentIndex < images.length - 1 ? '1' : '0.3';
        nextBtn.style.pointerEvents = currentIndex < images.length - 1 ? 'auto' : 'none';
    }
}

function openLightboxWithImage(imageSrc, imageTitle) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (!lightbox || !lightboxImage) return;
    
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageTitle;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Find the image in current filtered images for navigation
    const currentImages = currentCategory === 'all' 
        ? allImages 
        : allImages.filter(img => img.category === currentCategory);
    
    const imageIndex = currentImages.findIndex(img => img.src === imageSrc);
    if (imageIndex !== -1) {
        currentLightboxIndex = imageIndex;
        updateLightboxNavigation(currentImages, imageIndex);
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    // Add smooth scrolling behavior for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.portfolio-section');
    animateElements.forEach(el => observer.observe(el));
    
    // Parallax scroll effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-image');
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate any layout-dependent elements
}, 250));

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    .no-images {
        text-align: center;
        padding: 4rem 2rem;
        color: #888;
    }
    
    .no-images i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.95);
        padding: 2rem;
        gap: 1rem;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Ashwak Photography...');
    
    initTitleFadeOut();
    initCustomCursor();
    initNavigation();
    initParallax();
    initPortfolio();
    initSmoothScrolling();
    initAnimations();
    initLightbox();
    
    console.log('Initialization complete!');
    
    // Add window resize handler for masonry
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(recalculateMasonry, 250);
    });
}); 