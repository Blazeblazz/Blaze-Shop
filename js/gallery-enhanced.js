// Enhanced Gallery with all improvements
document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.gallery-grid');

    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const indicatorsContainer = document.querySelector('.gallery-indicators');
    
    let currentImageIndex = 0;
    let visibleImages = [...galleryItems];
    
    // Lazy loading with Intersection Observer
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const skeleton = img.previousElementSibling;
                img.src = img.dataset.src;
                img.onload = () => {
                    img.classList.add('loaded');
                    if (skeleton) skeleton.style.display = 'none';
                };
                imageObserver.unobserve(img);
            }
        });
    });
    
    // Initialize lazy loading
    document.querySelectorAll('.lazy-load').forEach(img => {
        imageObserver.observe(img);
    });
    

    
    // Mobile swipe indicators
    function createIndicators() {
        if (window.innerWidth <= 768) {
            indicatorsContainer.innerHTML = '';
            visibleImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'gallery-dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => scrollToImage(index));
                indicatorsContainer.appendChild(dot);
            });
        }
    }
    
    function updateIndicators() {
        if (window.innerWidth <= 768) {
            createIndicators();
        }
    }
    
    function scrollToImage(index) {
        const item = visibleImages[index];
        if (item) {
            item.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            updateActiveDot(index);
        }
    }
    
    function updateActiveDot(index) {
        document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Lightbox functionality
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-image');
        const title = item.querySelector('.gallery-title').textContent;
        const caption = item.querySelector('.gallery-caption').textContent;
        
        item.addEventListener('click', () => {
            if (window.innerWidth > 768) {
                currentImageIndex = visibleImages.indexOf(item);
                openLightbox(img.src || img.dataset.src, `${title} - ${caption}`);
            }
        });
    });
    
    function openLightbox(src, caption) {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        const item = visibleImages[currentImageIndex];
        const img = item.querySelector('.gallery-image');
        const title = item.querySelector('.gallery-title').textContent;
        const caption = item.querySelector('.gallery-caption').textContent;
        lightboxImg.src = img.src || img.dataset.src;
        lightboxCaption.textContent = `${title} - ${caption}`;
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        const item = visibleImages[currentImageIndex];
        const img = item.querySelector('.gallery-image');
        const title = item.querySelector('.gallery-title').textContent;
        const caption = item.querySelector('.gallery-caption').textContent;
        lightboxImg.src = img.src || img.dataset.src;
        lightboxCaption.textContent = `${title} - ${caption}`;
    }
    
    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
    
    // Mobile scroll detection for indicators
    if (window.innerWidth <= 768) {
        let scrollTimeout;
        galleryGrid.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollLeft = galleryGrid.scrollLeft;
                const itemWidth = 300; // 280px + 20px gap
                const activeIndex = Math.round(scrollLeft / itemWidth);
                updateActiveDot(activeIndex);
            }, 100);
        });
    }
    
    // Initialize
    createIndicators();
    
    // Resize handler
    window.addEventListener('resize', () => {
        updateIndicators();
    });
});