// Upsell System for Product Detail Page
document.addEventListener('DOMContentLoaded', function() {
    // Get current product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentProductId = parseInt(urlParams.get('id'));
    
    // Filter out current product for upsell
    const upsellProducts = products.filter(product => product.id !== currentProductId);
    
    // DOM elements
    const upsellItems = document.getElementById('upsell-items');
    const prevButton = document.getElementById('upsell-prev');
    const nextButton = document.getElementById('upsell-next');
    const addButton = document.getElementById('upsell-add');
    
    // State
    let currentSlide = 0;
    let selectedUpsellProduct = null;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Initialize upsell slider
    function initUpsellSlider() {
        // Create upsell items
        upsellProducts.forEach(product => {
            const item = document.createElement('div');
            item.className = 'upsell-item';
            item.dataset.id = product.id;
            
            item.innerHTML = `
                <div class="upsell-image">
                    <img src="${product.image || product.images[0]}" alt="${product.name}">
                </div>
                <div class="upsell-name">${product.name}</div>
                <div class="upsell-price">${product.price} MAD</div>
            `;
            
            upsellItems.appendChild(item);
        });
        
        // Set initial position
        updateSliderPosition();
        
        // Select first product by default
        if (upsellProducts.length > 0) {
            selectedUpsellProduct = {
                ...upsellProducts[0],
                selectedVariant: upsellProducts[0].variants[0]
            };
        }
        
        // Add touch events for mobile swipe
        upsellItems.addEventListener('touchstart', handleTouchStart, false);
        upsellItems.addEventListener('touchend', handleTouchEnd, false);
    }
    
    // Touch handlers for swipe
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        // Stop auto-slide when user interacts
        stopAutoSlide();
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    function handleSwipe() {
        // Minimum swipe distance (px)
        const minSwipeDistance = 50;
        
        if (touchStartX - touchEndX > minSwipeDistance) {
            // Swipe left - next slide
            nextSlide();
        } else if (touchEndX - touchStartX > minSwipeDistance) {
            // Swipe right - previous slide
            prevSlide();
        }
        
        // Prevent default behavior to avoid page scrolling during swipe
        return false;
    }
    
    // Add touchmove handler to prevent page scrolling during swipe
    upsellItems.addEventListener('touchmove', function(e) {
        if (Math.abs(touchStartX - e.changedTouches[0].screenX) > 10) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Update slider position
    function updateSliderPosition() {
        upsellItems.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update selected product
        if (upsellProducts.length > 0) {
            selectedUpsellProduct = {
                ...upsellProducts[currentSlide],
                selectedVariant: upsellProducts[currentSlide].variants[0]
            };
        }
    }
    
    // Next slide function
    function nextSlide() {
        if (currentSlide < upsellProducts.length - 1) {
            currentSlide++;
        } else {
            // Loop to the beginning
            currentSlide = 0;
        }
        updateSliderPosition();
    }
    
    // Previous slide function
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            // Loop to the end
            currentSlide = upsellProducts.length - 1;
        }
        updateSliderPosition();
    }
    
    // Event listeners for slider controls
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // Auto-advance slider every 3 seconds for mobile
    let autoSlideInterval;
    
    function startAutoSlide() {
        if (window.innerWidth <= 768) {
            autoSlideInterval = setInterval(nextSlide, 3000);
        }
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto-slide on mobile
    startAutoSlide();
    
    // Stop auto-slide when user interacts with slider
    upsellItems.addEventListener('touchstart', stopAutoSlide);
    prevButton.addEventListener('click', stopAutoSlide);
    nextButton.addEventListener('click', stopAutoSlide);
    
    // Add upsell product to cart with discount
    addButton.addEventListener('click', function() {
        if (!selectedUpsellProduct) return;
        
        // Get main product details
        const mainProduct = products.find(p => p.id === currentProductId);
        if (!mainProduct) return;
        
        const mainVariant = document.querySelector('.variant-option.active')?.dataset.variant || mainProduct.variants[0];
        const mainQuantity = parseInt(document.getElementById('quantity').value) || 1;
        
        // Apply 10% discount to both products
        const discountedPrice = Math.round(mainProduct.price * 0.9);
        
        // Create order with both products
        const orderItems = [
            {
                id: mainProduct.id,
                name: mainProduct.name,
                price: discountedPrice,
                image: mainProduct.images[0],
                quantity: mainQuantity,
                variant: mainVariant,
                discounted: true
            },
            {
                id: selectedUpsellProduct.id,
                name: selectedUpsellProduct.name,
                price: discountedPrice,
                image: selectedUpsellProduct.images[0],
                quantity: 1,
                variant: selectedUpsellProduct.selectedVariant,
                discounted: true
            }
        ];
        
        // Show success message
        showAddedMessage();
        
        // Store in session storage
        sessionStorage.setItem('directOrder', JSON.stringify(orderItems));
        
        // Redirect to checkout after a short delay
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1000);
    });
    
    // Show added to cart message
    function showAddedMessage() {
        // Create message element if it doesn't exist
        let messageElement = document.getElementById('added-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'added-message';
            messageElement.style.position = 'fixed';
            messageElement.style.top = '50%';
            messageElement.style.left = '50%';
            messageElement.style.transform = 'translate(-50%, -50%)';
            messageElement.style.backgroundColor = '#151515';
            messageElement.style.color = 'white';
            messageElement.style.padding = '20px';
            messageElement.style.borderRadius = '8px';
            messageElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            messageElement.style.zIndex = '1000';
            messageElement.style.textAlign = 'center';
            messageElement.innerHTML = `
                <div style="color: #ff3c00; font-size: 2rem; margin-bottom: 10px;">✓</div>
                <div style="font-weight: 600; margin-bottom: 5px;">Produits ajoutés au panier</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Réduction de 10% appliquée</div>
            `;
            document.body.appendChild(messageElement);
        }
    }
    
    // Initialize
    initUpsellSlider();
    
    // Update the main order button
    const orderNowButton = document.getElementById('order-now');
    if (orderNowButton) {
        orderNowButton.addEventListener('click', function() {
            // Get main product details
            const mainProduct = products.find(p => p.id === currentProductId);
            if (!mainProduct) return;
            
            const mainVariant = document.querySelector('.variant-option.active')?.dataset.variant || mainProduct.variants[0];
            const mainQuantity = parseInt(document.getElementById('quantity').value) || 1;
            
            // Create order with just the main product (no discount)
            const orderItems = [
                {
                    id: mainProduct.id,
                    name: mainProduct.name,
                    price: mainProduct.price,
                    image: mainProduct.images[0],
                    quantity: mainQuantity,
                    variant: mainVariant
                }
            ];
            
            // Store in session storage
            sessionStorage.setItem('directOrder', JSON.stringify(orderItems));
            
            // Redirect to checkout
            window.location.href = 'checkout.html';
        });
    }
});