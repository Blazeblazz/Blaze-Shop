// Mobile Navigation Bar
document.addEventListener('DOMContentLoaded', function() {
    // Create mobile nav element
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
        <a href="index.html" class="mobile-nav-item active">
            <i class="fas fa-home"></i>
            <span>Accueil</span>
        </a>
        <a href="#products" class="mobile-nav-item">
            <i class="fas fa-tshirt"></i>
            <span>Produits</span>
        </a>
        <a href="cart.html" class="mobile-nav-item">
            <i class="fas fa-shopping-cart"></i>
            <span>Panier</span>
        </a>
        <a href="#" class="mobile-nav-item" id="mobile-menu">
            <i class="fas fa-bars"></i>
            <span>Menu</span>
        </a>
    `;
    
    // Only add on mobile devices
    if (window.innerWidth <= 768) {
        document.body.appendChild(mobileNav);
        
        // Handle mobile menu click
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.addEventListener('click', function(e) {
                e.preventDefault();
                const mainNav = document.querySelector('.main-nav');
                if (mainNav) {
                    mainNav.classList.toggle('mobile-active');
                    document.body.classList.toggle('menu-open');
                }
            });
        }
        
        // Handle product link click
        const productLink = mobileNav.querySelector('a[href="#products"]');
        if (productLink) {
            productLink.addEventListener('click', function(e) {
                e.preventDefault();
                const productsSection = document.getElementById('products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active state
                    const navItems = document.querySelectorAll('.mobile-nav-item');
                    navItems.forEach(item => item.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        }
    }
});