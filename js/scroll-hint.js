// Add scroll hint for mobile users
document.addEventListener('DOMContentLoaded', function() {
  // Only run on mobile devices
  if (window.innerWidth <= 768) {
    const productGrids = document.querySelectorAll('.work-grid, .product-grid');
    
    productGrids.forEach(grid => {
      // Add a hint text element
      const scrollHint = document.createElement('div');
      scrollHint.className = 'scroll-hint';
      scrollHint.textContent = 'Faites défiler horizontalement pour voir plus';
      scrollHint.style.textAlign = 'center';
      scrollHint.style.fontSize = '0.8rem';
      scrollHint.style.opacity = '0.7';
      scrollHint.style.marginTop = '10px';
      
      // Insert after the grid
      grid.parentNode.insertBefore(scrollHint, grid.nextSibling);
      
      // Hide the hint after user has scrolled
      grid.addEventListener('scroll', function() {
        scrollHint.style.opacity = '0';
        setTimeout(() => {
          scrollHint.style.display = 'none';
        }, 500);
      }, { once: true });
    });
  }
});