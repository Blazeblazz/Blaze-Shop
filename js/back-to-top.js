// Add back to top button for mobile
document.addEventListener('DOMContentLoaded', function() {
  // Create the button
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Retour en haut');
  backToTopBtn.style.position = 'fixed';
  backToTopBtn.style.bottom = '20px';
  backToTopBtn.style.right = '20px';
  backToTopBtn.style.backgroundColor = '#ff3c00';
  backToTopBtn.style.color = 'white';
  backToTopBtn.style.width = '40px';
  backToTopBtn.style.height = '40px';
  backToTopBtn.style.borderRadius = '50%';
  backToTopBtn.style.border = 'none';
  backToTopBtn.style.fontSize = '20px';
  backToTopBtn.style.display = 'none';
  backToTopBtn.style.zIndex = '99';
  backToTopBtn.style.cursor = 'pointer';
  backToTopBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
  
  document.body.appendChild(backToTopBtn);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = 'block';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });
  
  // Scroll to top when clicked
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});