// ===== Raj Photo Edit AI - Main Application =====

// Global Variables
let originalImage = null;
let currentImage = null;
let canvas = null;
let ctx = null;
let currentFilter = null;
let filters = [];
let activeCategory = 'all';
let searchQuery = '';

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    loadFilters();
    setupEventListeners();
    loadPopularFilters();
});

// Initialize Canvas
function initCanvas() {
    canvas = document.getElementById('previewCanvas');
    ctx = canvas.getContext('2d');
}

// Load Filters from JSON
function loadFilters() {
    // Simulate loading filters from JSON file
    // In production, this would be fetched from filters.json
    filters = window.FILTERS_DATA || [
        // Vivid & Popular (50)
        ...Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            name: ['Vivid', 'Clarendon', 'Juno', 'Valencia', 'Lark', 'Gingham', 'Ludwig', 'Aesthetic Bright', 'Cinematic Orange', 'Cinematic Blue', 'Drama', 'Noir', 'Romantic Glow', 'Warm Tone', 'Cool Tone', 'HDR Boost', 'Bright', 'Contrast Boost', 'Saturation Boost', 'Matte Film'][i],
            category: 'vivid',
            preset: {
                brightness: Math.floor(Math.random() * 20) + 5,
                contrast: Math.floor(Math.random() * 25) + 10,
                saturation: Math.floor(Math.random() * 30) + 15,
                hue: Math.floor(Math.random() * 10) - 5,
                sharpen: Math.floor(Math.random() * 10) + 2,
                vignette: Math.floor(Math.random() * 15),
                glow: Math.floor(Math.random() * 10)
            }
        })),
        
        // Portrait (15)
        ...Array.from({ length: 15 }, (_, i) => ({
            id: i + 21,
            name: ['Skin Smooth', 'Blemish Remove', 'Eye Brighten', 'Lip Color Enhance', 'Warm Portrait', 'Bright Portrait', 'Soft Portrait', 'Face Glow', 'Glamorous', 'Skin Tone Correct', 'Natural Beauty', 'Makeup Enhance', 'Soft Highlight', 'Cheek Glow', 'Smile Enhance'][i],
            category: 'portrait',
            preset: {
                brightness: Math.floor(Math.random() * 15) + 5,
                contrast: Math.floor(Math.random() * 15) + 5,
                saturation: Math.floor(Math.random() * 15) + 5,
                hue: 0,
                sharpen: Math.floor(Math.random() * 8) + 2,
                vignette: 0,
                glow: Math.floor(Math.random() * 15) + 5
            }
        })),
        
        // Landscape (15)
        ...Array.from({ length: 15 }, (_, i) => ({
            id: i + 36,
            name: ['Green Boost', 'Blue Sky Enhance', 'Sunset Glow', 'Forest Boost', 'Mountain HDR', 'Beach Vivid', 'River Enhance', 'Lake Enhance', 'Sky HDR', 'Clouds Pop', 'Autumn Leaves', 'Winter Chill', 'Spring Bloom', 'Summer Bright', 'Golden Hour'][i],
            category: 'landscape',
            preset: {
                brightness: Math.floor(Math.random() * 20) + 5,
                contrast: Math.floor(Math.random() * 25) + 15,
                saturation: Math.floor(Math.random() * 30) + 20,
                hue: Math.floor(Math.random() * 10) - 5,
                sharpen: Math.floor(Math.random() * 12) + 3,
                vignette: Math.floor(Math.random() * 20),
                glow: Math.floor(Math.random() * 10)
            }
        })),
        
        // Food (15)
        ...Array.from({ length: 15 }, (_, i) => ({
            id: i + 51,
            name: ['Food Pop', 'Food Warm', 'Food Cool', 'Food Glow', 'Food HDR', 'Dessert Glow', 'Coffee Pop', 'Beverage HDR', 'Dish Boost', 'Plate Glow', 'Meal Matte', 'Smoothie Pop', 'Cake Pop', 'Ice Cream Glow', 'Fruit Pop'][i],
            category: 'food',
            preset: {
                brightness: Math.floor(Math.random() * 15) + 10,
                contrast: Math.floor(Math.random() * 20) + 15,
                saturation: Math.floor(Math.random() * 25) + 20,
                hue: Math.floor(Math.random() * 8) - 4,
                sharpen: Math.floor(Math.random() * 15) + 5,
                vignette: Math.floor(Math.random() * 15),
                glow: Math.floor(Math.random() * 15) + 5
            }
        })),
        
        // Night (15)
        ...Array.from({ length: 15 }, (_, i) => ({
            id: i + 66,
            name: ['Nightscape Glow', 'Nightscape HDR', 'Astro Glow', 'Milky Way Pop', 'Star Pop', 'Starry Night HDR', 'City Lights Pop', 'Neon Glow', 'Street Glow', 'Night Vivid', 'Neon City', 'Urban Glow', 'Moon Glow', 'Twilight HDR', 'Night Matte'][i],
            category: 'night',
            preset: {
                brightness: Math.floor(Math.random() * 20) - 10,
                contrast: Math.floor(Math.random() * 30) + 20,
                saturation: Math.floor(Math.random() * 20) + 10,
                hue: Math.floor(Math.random() * 20) - 10,
                sharpen: Math.floor(Math.random() * 15) + 5,
                vignette: Math.floor(Math.random() * 30) + 20,
                glow: Math.floor(Math.random() * 20) + 10
            }
        })),
        
        // Art (15)
        ...Array.from({ length: 15 }, (_, i) => ({
            id: i + 81,
            name: ['Sketch', 'Oil Painting', 'Watercolor', 'Cartoon', 'Comic', 'Pop Art', 'Neon Glow', 'Pixelate', 'Glitch', 'VHS', 'Double Exposure', 'Rainbow Effect', 'Cyberpunk', 'Vaporwave', 'Fantasy Glow'][i],
            category: 'art',
            preset: {
                brightness: Math.floor(Math.random() * 25) + 5,
                contrast: Math.floor(Math.random() * 30) + 15,
                saturation: Math.floor(Math.random() * 30) + 15,
                hue: Math.floor(Math.random() * 30) - 15,
                sharpen: Math.floor(Math.random() * 20) + 5,
                vignette: Math.floor(Math.random() * 25),
                glow: Math.floor(Math.random() * 25) + 10
            }
        })),
        
        // AI (15)
        ...Array.from({ length: 15 }, (_, i) => ({
            id: i + 96,
            name: ['AI Auto Enhance', 'AI Skin Smooth', 'AI Blemish Remove', 'AI Eye Brighten', 'AI Background Blur', 'AI Super Resolution', 'AI Face Retouch', 'AI Colorize', 'AI Portrait Enhance', 'AI Landscape Enhance', 'AI Night Enhance', 'AI Food Enhance', 'AI Sky Replacement', 'AI Denoise', 'AI Upscale 4x'][i],
            category: 'ai',
            preset: {
                brightness: Math.floor(Math.random() * 20) + 5,
                contrast: Math.floor(Math.random() * 20) + 10,
                saturation: Math.floor(Math.random() * 20) + 10,
                hue: 0,
                sharpen: Math.floor(Math.random() * 15) + 5,
                vignette: Math.floor(Math.random() * 15),
                glow: Math.floor(Math.random() * 15) + 5
            }
        }))
    ];
    
    displayFilters();
}

// Display Filters in Grid
function displayFilters() {
    const grid = document.getElementById('filtersGrid');
    let filteredFilters = filters;
    
    // Filter by category
    if (activeCategory !== 'all') {
        filteredFilters = filteredFilters.filter(f => f.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
        filteredFilters = filteredFilters.filter(f => 
            f.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (filteredFilters.length === 0) {
        grid.innerHTML = `
            <div class="no-filters">
                <i class="fas fa-filter"></i>
                <p>No filters found</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredFilters.map(filter => `
        <div class="filter-item ${currentFilter?.id === filter.id ? 'active' : ''}" 
             data-filter-id="${filter.id}"
             onclick="applyFilter(${filter.id})">
            <div class="filter-name">${filter.name}</div>
            <div class="filter-category">${filter.category}</div>
        </div>
    `).join('');
}

// Load Popular Filters
function loadPopularFilters() {
    const popular = document.getElementById('popularFilters');
    const popularFilters = filters.slice(0, 8);
    
    popular.innerHTML = popularFilters.map(filter => `
        <div class="popular-filter-item" onclick="applyFilter(${filter.id})">
            ${filter.name}
        </div>
    `).join('');
}

// Apply Filter to Image
function applyFilter(filterId) {
    if (!originalImage) {
        alert('Please upload an image first!');
        return;
    }
    
    const filter = filters.find(f => f.id === filterId);
    if (!filter) return;
    
    currentFilter = filter;
    
    // Update active state
    document.querySelectorAll('.filter-item').forEach(el => {
        el.classList.remove('active');
    });
    
    const activeElement = document.querySelector(`.filter-item[data-filter-id="${filterId}"]`);
    if (activeElement) {
        activeElement.classList.add('active');
    }
    
    // Apply filter to image
    applyImageFilter(filter.preset);
}

// Apply Image Filter using Canvas
function applyImageFilter(preset) {
    if (!currentImage) return;
    
    // Create a temporary canvas for processing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = currentImage.width;
    tempCanvas.height = currentImage.height;
    
    // Draw original image
    tempCtx.drawImage(currentImage, 0, 0);
    
    // Get image data
    let imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    let data = imageData.data;
    
    // Apply filter adjustments
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Brightness
        r += preset.brightness || 0;
        g += preset.brightness || 0;
        b += preset.brightness || 0;
        
        // Contrast
        const contrastFactor = (preset.contrast || 0) / 100 + 1;
        r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255;
        g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255;
        b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255;
        
        // Saturation
        const saturationFactor = (preset.saturation || 0) / 100 + 1;
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = gray + (r - gray) * saturationFactor;
        g = gray + (g - gray) * saturationFactor;
        b = gray + (b - gray) * saturationFactor;
        
        // Clamp values
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
    }
    
    tempCtx.putImageData(imageData, 0, 0);
    
    // Draw to main canvas
    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.drawImage(tempCanvas, 0, 0);
}

// Setup Event Listeners
function setupEventListeners() {
    // File Upload
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--gray)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--gray)';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });
    
    selectFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });
    
    // Category Tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            activeCategory = tab.dataset.category;
            displayFilters();
        });
    });
    
    // Search
    const searchInput = document.getElementById('filterSearch');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        displayFilters();
    });
    
    // Download Button
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    
    // Reset Button
    document.getElementById('resetBtn').addEventListener('click', resetImage);
    
    // Fullscreen Button
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    
    // AI Enhancement Buttons
    document.querySelectorAll('.btn-ai').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!originalImage) {
                alert('Please upload an image first!');
                return;
            }
            
            const aiType = btn.dataset.ai;
            applyAIEnhancement(aiType);
        });
    });
}

// Handle Image Upload
function handleImageUpload(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
            originalImage = img;
            currentImage = img;
            
            // Set canvas dimensions
            const maxWidth = 800;
            const maxHeight = 600;
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = (maxHeight / height) * width;
                height = maxHeight;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Show preview container, hide upload area
            document.getElementById('uploadArea').style.display = 'none';
            document.getElementById('previewContainer').style.display = 'block';
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// Download Image
function downloadImage() {
    if (!canvas) return;
    
    const resolution = document.getElementById('resolution').value;
    let downloadCanvas = canvas;
    
    if (resolution === '4k') {
        // Create 4K version
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 3840;
        tempCanvas.height = 2160;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0, 3840, 2160);
        downloadCanvas = tempCanvas;
    } else if (resolution === 'hd') {
        // Create HD version
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 1920;
        tempCanvas.height = 1080;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0, 1920, 1080);
        downloadCanvas = tempCanvas;
    }
    
    const link = document.createElement('a');
    link.download = `raj-photo-edit-${currentFilter?.name || 'edited'}.jpg`;
    link.href = downloadCanvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

// Reset Image
function resetImage() {
    if (!originalImage) return;
    
    currentImage = originalImage;
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    currentFilter = null;
    
    document.querySelectorAll('.filter-item').forEach(el => {
        el.classList.remove('active');
    });
}

// Toggle Fullscreen
function toggleFullscreen() {
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    
    if (!document.fullscreenElement) {
        canvasWrapper.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Apply AI Enhancement (Simulated)
function applyAIEnhancement(type) {
    // In production, this would call backend API
    console.log(`Applying AI enhancement: ${type}`);
    
    // Simulate processing
    const btn = document.querySelector(`.btn-ai[data-ai="${type}"]`);
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Simulate enhanced image
        alert(`AI ${type} enhancement applied! (Demo simulation)`);
    }, 2000);
}

// Make functions globally accessible
window.applyFilter = applyFilter;
window.handleImageUpload = handleImageUpload;
