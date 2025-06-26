// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
  // Load all images immediately
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  lazyImages.forEach(img => {
    // Set src to data-src value
    img.src = img.getAttribute('data-src');
    // Remove data-src attribute
    img.removeAttribute('data-src');
  });
  
  // Also initialize IntersectionObserver for future images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.getAttribute('data-src');
          image.removeAttribute('data-src');
          imageObserver.unobserve(image);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
});