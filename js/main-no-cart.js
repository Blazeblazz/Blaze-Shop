// Simple navigation toggle
document.querySelector('.nav-toggle').addEventListener('click', function() {
    document.body.classList.toggle('nav-active');
    
    // Force menu to be fully opaque black when active
    if (document.body.classList.contains('nav-active')) {
        document.querySelector('.nav-menu').style.backgroundColor = '#000000';
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