// Simple navigation toggle
document.querySelector('.nav-toggle').addEventListener('click', function() {
    document.body.classList.toggle('nav-active');
    
    // Force menu to be fully opaque black when active
    if (document.body.classList.contains('nav-active')) {
        document.querySelector('.nav-menu').style.backgroundColor = '#000000';
        document.querySelector('.nav-menu').style.opacity = '1';
    }
});

// Close menu when clicking links
document.querySelectorAll('.nav-menu-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.body.classList.remove('nav-active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Replace cart buttons with contact links
document.addEventListener('DOMContentLoaded', function() {
    // Convert all cart buttons to contact links
    document.querySelectorAll('.btn-small').forEach(button => {
        button.textContent = 'Contactez-nous';
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Scroll to contact section
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Special offers buttons
    document.querySelectorAll('.offer-item .btn').forEach(button => {
        button.addEventListener('click', function() {
            const offerTitle = this.parentElement.querySelector('h3').textContent;
            // Redirect to contact section
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});