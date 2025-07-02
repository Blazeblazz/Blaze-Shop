document.addEventListener('DOMContentLoaded', function() {
    // Update Add to Cart buttons to say "Commandez"
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.textContent = 'Commandez';
    });

    // Add product links with query parameters
    const productCards = document.querySelectorAll('.product-card');
    const hotDealItems = document.querySelectorAll('.hot-deal-item');
    
    // Process product cards
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent;
        const productLinks = card.querySelectorAll('a');
        const buyButtons = card.querySelectorAll('button.btn-add-cart');
        
        // Update links
        productLinks.forEach(link => {
            if (link.getAttribute('href') === 'product-detail.html') {
                link.setAttribute('href', `product-detail.html?product=${encodeURIComponent(productName)}`);
            }
        });
        
        // Update buttons
        buyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                window.location.href = `product-detail.html?product=${encodeURIComponent(productName)}`;
            });
        });
        
        // Make entire card clickable
        card.addEventListener('click', function() {
            window.location.href = `product-detail.html?product=${encodeURIComponent(productName)}`;
        });
    });
    
    // Process hot deal items
    hotDealItems.forEach(item => {
        const productName = item.querySelector('.hot-deal-title').textContent;
        const buyLink = item.querySelector('.hot-deal-cta');
        
        if (buyLink) {
            buyLink.setAttribute('href', `product-detail.html?product=${encodeURIComponent(productName)}`);
        }
    });
    
    // Cart functionality
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }
    
    // Initialize cart count
    updateCartCount();
    
    // Add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent.split(' ')[0];
            const productImage = productCard.querySelector('img').getAttribute('src');
            
            // Add to cart
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1,
                image: productImage
            });
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Show confirmation
            alert(`${productName} ajouté au panier`);
        });
    });
    
    // Values section slider for mobile
    const valuesGrid = document.querySelector('.values-grid');
    const valueItems = document.querySelectorAll('.value-item');
    const sliderDots = document.querySelectorAll('.dot');
    
    if (valuesGrid && valueItems.length > 0 && sliderDots.length > 0) {
        let currentIndex = 0;
        
        // Function to update slider position and dots
        function updateSlider() {
            // Calculate item width including margin
            const itemWidth = valueItems[0].offsetWidth + 15;
            
            // Scroll to the selected item
            valuesGrid.scrollTo({
                left: currentIndex * itemWidth,
                behavior: 'smooth'
            });
            
            // Update active dot
            sliderDots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // No prev/next buttons to update
        }
        
        // Previous and Next buttons removed
        
        // Dot navigation
        sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentIndex = index;
                updateSlider();
            });
        });
        
        // Handle manual scrolling with debounce
        let scrollTimeout;
        valuesGrid.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                const scrollPosition = valuesGrid.scrollLeft;
                const itemWidth = valueItems[0].offsetWidth + 15;
                const newIndex = Math.round(scrollPosition / itemWidth);
                
                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < valueItems.length) {
                    currentIndex = newIndex;
                    updateSlider();
                }
            }, 100);
        });
        
        // Initialize slider
        updateSlider();
        
        // Fix for mobile touch events
        valuesGrid.addEventListener('touchend', function() {
            setTimeout(function() {
                const scrollPosition = valuesGrid.scrollLeft;
                const itemWidth = valueItems[0].offsetWidth + 15;
                const newIndex = Math.round(scrollPosition / itemWidth);
                
                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < valueItems.length) {
                    currentIndex = newIndex;
                    updateSlider();
                }
            }, 100);
        });
    }
    // Add scroll progress indicator
    const scrollProgressElement = document.createElement('div');
    scrollProgressElement.className = 'scroll-progress';
    document.body.appendChild(scrollProgressElement);

    // Header scroll effect
    const header = document.querySelector('header');
    
    // Scroll progress and header effect
    window.addEventListener('scroll', function() {
        // Update scroll progress
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        scrollProgressElement.style.width = scrollProgress + '%';
        
        // Header effect
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.main-nav');
    const menuClose = document.querySelector('.menu-close');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('mobile-active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('mobile-active');
                document.body.classList.remove('menu-open');
            });
        });
    }
    
    // Close button functionality
    if (menuClose) {
        menuClose.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('mobile-active');
            document.body.classList.remove('menu-open');
        });
    }

    // Product hover and touch effects
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    productCards.forEach(card => {
        // For mobile: show overlay on first tap, navigate on second tap
        let tapped = false;
        
        card.addEventListener('click', function(e) {
            if (isMobile) {
                const overlay = this.querySelector('.product-overlay');
                if (!tapped) {
                    e.preventDefault();
                    // Reset all other cards
                    productCards.forEach(c => {
                        if (c !== card) c.classList.remove('tapped');
                    });
                    this.classList.add('tapped');
                    tapped = true;
                    setTimeout(() => { tapped = false; }, 5000); // Reset after 5 seconds
                } else {
                    // Second tap - navigate to product page
                    const productName = this.querySelector('h3').textContent;
                    window.location.href = `product-detail.html?product=${encodeURIComponent(productName)}`;
                }
            } else {
                // Desktop behavior
                const productName = this.querySelector('h3').textContent;
                window.location.href = `product-detail.html?product=${encodeURIComponent(productName)}`;
            }
        });
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to observe for scroll animations
    const animatedElements = document.querySelectorAll('.story-content, .values-grid, .product-grid, .testimonial-grid, .contact-grid');
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Explore button functionality
    const exploreButton = document.querySelector('.btn-explore');
    
    if (exploreButton) {
        exploreButton.addEventListener('click', function() {
            // Scroll to products section
            const productsSection = document.querySelector('.products');
            if (productsSection) {
                window.scrollTo({
                    top: productsSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Scroll to brand story section
            const storySection = document.querySelector('.brand-story');
            if (storySection) {
                window.scrollTo({
                    top: storySection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        if (heroSection) {
            const scrollPosition = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            // Apply parallax effect to hero section
            heroSection.style.backgroundPosition = `center ${scrollPosition * parallaxSpeed}px`;
        }
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .product-card, .value-item, .social-icons a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            document.body.classList.add('element-hovered');
        });
        
        element.addEventListener('mouseleave', function() {
            document.body.classList.remove('element-hovered');
        });
    });
    
    // Product action buttons
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering product card click
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            window.location.href = `product-detail.html?product=${encodeURIComponent(productName)}`;
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert(`Merci de vous être inscrit avec: ${emailInput.value}`);
                emailInput.value = '';
                // Here you would typically send the email to your backend
            }
        });
    }
});