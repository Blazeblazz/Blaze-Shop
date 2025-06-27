// Improved mobile menu animation
document.addEventListener('DOMContentLoaded', function() {
  // Only apply on mobile
  if (window.innerWidth <= 768) {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    // Set initial state with opacity and transform
    navMenu.style.opacity = '0';
    navMenu.style.transform = 'translateY(-100%)';
    navMenu.style.transition = 'opacity 0.3s ease, transform 0.4s ease';
    
    // Override the toggle behavior for mobile
    navToggle.addEventListener('click', function(e) {
      if (document.body.classList.contains('nav-active')) {
        navMenu.style.opacity = '1';
        navMenu.style.transform = 'translateY(0)';
      } else {
        navMenu.style.opacity = '0';
        navMenu.style.transform = 'translateY(-100%)';
      }
    });
  }
});