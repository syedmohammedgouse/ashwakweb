# Image Setup Guide for Ashwak Photography

## 📁 Image Folder Structure

Your website is now set up to use images from the `pics/` folder. Here's what you need to do:

## 🖼️ Required Image Files

Add these images to your `pics/` folder:

1. **wedding-1.jpg** - Wedding Photography
2. **fashion-1.jpg** - Fashion Photography  
3. **portrait-1.jpg** - Portrait Photography
4. **commercial-1.jpg** - Commercial Photography
5. **prewedding-1.jpg** - Pre-Wedding Shoots
6. **product-1.jpg** - Product Photography
7. **event-1.jpg** - Event Photography
8. **lifestyle-1.jpg** - Lifestyle Photography

## 📋 How to Add Images

### Option 1: Rename Your Images
1. Copy your images to the `pics/` folder
2. Rename them to match the filenames above
3. Make sure they are in JPG format

### Option 2: Update HTML
If you want to use different filenames:
1. Open `index.html`
2. Find the `<img src="pics/filename.jpg">` lines
3. Change the filenames to match your actual image files

## 🎯 Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 800x600 pixels or larger
- **Aspect Ratio**: 4:3 or 16:9 works best
- **File Size**: Keep under 500KB for fast loading

## 🔄 Fallback System

The website has a smart fallback system:
- If an image loads successfully → Shows the image
- If an image fails to load → Shows a placeholder with the category name

## 📱 Responsive Images

The images will automatically:
- Scale to fit the container
- Maintain aspect ratio
- Zoom slightly on hover
- Work on all device sizes

## 🚀 Quick Start

1. **Add your images** to the `pics/` folder
2. **Rename them** to match the required filenames
3. **Open index.html** in your browser
4. **Your images will appear** in the portfolio grid!

## 💡 Tips

- Use high-quality images for best results
- Keep file sizes small for faster loading
- Test on different devices to ensure responsiveness
- Consider adding more images by duplicating the portfolio items

## 🔧 Customization

To add more portfolio items:
1. Copy a `<div class="portfolio-item">` block in `index.html`
2. Update the image source and alt text
3. Add your new image to the `pics/` folder

---

**Need help?** The website will work with placeholders until you add your images! 