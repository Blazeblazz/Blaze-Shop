/**
 * Pack Discount System
 * Automatically applies 20% discount when 3 t-shirts are added to cart
 */
document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const DISCOUNT_THRESHOLD = 3; // Number of items needed for discount
    const DISCOUNT_PERCENTAGE = 20; // 20% discount
    
    // Check if we're on a page with product selection
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    // Add pack discount banner
    addDiscountBanner();
    
    // Initialize cart if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Update UI based on current cart
    updatePackDiscountUI();
    
    // Add event listeners to "Add to Cart" buttons
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Get product info
            const productItem = this.closest('.product-item') || this.closest('.product-detail');
            if (!productItem) return;
            
            const productId = parseInt(productItem.dataset.id);
            const productName = productItem.querySelector('.work-title') ? 
                productItem.querySelector('.work-title').textContent : 
                document.querySelector('.product-title').textContent;
            
            const productPrice = 129; // Fixed price for all t-shirts
            
            // Get product image
            const productImage = productItem.querySelector('img') ? 
                productItem.querySelector('img').src : 
                document.querySelector('.main-image img').src;
            
            // Get selected variant if available
            let variant = "White"; // Default
            const variantSelector = productItem.querySelector('.variant-selector');
            if (variantSelector) {
                const selectedVariant = variantSelector.querySelector('.variant-option.selected');
                if (selectedVariant) {
                    variant = selectedVariant.dataset.variant;
                }
            }
            
            // Add to cart
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1,
                variant: variant
            });
            
            // Show confirmation
            showAddedToCartMessage(productName);
            
            // Update UI
            updatePackDiscountUI();
            
            e.preventDefault();
        });
    });
    
    /**
     * Add item to cart
     */
    function addToCart(item) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => 
            cartItem.id === item.id && cartItem.variant === item.variant
        );
        
        if (existingItemIndex !== -1) {
            // Update quantity
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            cart.push(item);
        }
        
        // Save cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in header
        updateCartCount();
    }
    
    /**
     * Update cart count in header
     */
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            
            // Show/hide based on count
            if (totalItems > 0) {
                cartCountElement.style.display = 'flex';
            } else {
                cartCountElement.style.display = 'none';
            }
        }
    }
    
    /**
     * Show added to cart message
     */
    function showAddedToCartMessage(productName) {
        // Create message element if it doesn't exist
        let messageElement = document.getElementById('cart-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'cart-message';
            messageElement.style.position = 'fixed';
            messageElement.style.bottom = '20px';
            messageElement.style.right = '20px';
            messageElement.style.backgroundColor = '#ff3c00';
            messageElement.style.color = 'white';
            messageElement.style.padding = '15px 20px';
            messageElement.style.borderRadius = '4px';
            messageElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            messageElement.style.zIndex = '1000';
            messageElement.style.transform = 'translateY(100px)';
            messageElement.style.transition = 'transform 0.3s ease';
            document.body.appendChild(messageElement);
        }
        
        // Update message content
        messageElement.innerHTML = `
            <div style="display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <div>
                    <div><strong>${productName}</strong> ajouté au panier</div>
                    <div style="font-size: 0.9em; margin-top: 5px;">
                        ${checkPackDiscount()}
                    </div>
                </div>
            </div>
        `;
        
        // Show message
        setTimeout(() => {
            messageElement.style.transform = 'translateY(0)';
        }, 10);
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageElement.style.transform = 'translateY(100px)';
        }, 3000);
    }
    
    /**
     * Check if pack discount applies and return message
     */
    function checkPackDiscount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (totalItems >= DISCOUNT_THRESHOLD) {
            return `<span style="color: #FFFF00;">Réduction de ${DISCOUNT_PERCENTAGE}% appliquée!</span>`;
        } else if (totalItems > 0) {
            const remaining = DISCOUNT_THRESHOLD - totalItems;
            return `Ajoutez ${remaining} t-shirt${remaining > 1 ? 's' : ''} de plus pour obtenir -${DISCOUNT_PERCENTAGE}%`;
        }
        
        return '';
    }
    
    /**
     * Add discount banner to the page
     */
    function addDiscountBanner() {
        const banner = document.createElement('div');
        banner.className = 'pack-discount-banner';
        banner.innerHTML = `
            <div style="background-color: #151515; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <div style="font-weight: 600; color: #ff3c00; margin-bottom: 5px;">OFFRE SPÉCIALE</div>
                <div style="font-size: 1.2rem; margin-bottom: 5px;">Achetez 3 t-shirts et économisez 20%</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Réduction appliquée automatiquement dans votre panier</div>
                <div id="pack-progress" style="margin-top: 10px;"></div>
            </div>
        `;
        
        // Insert after product grid heading
        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.parentNode.insertBefore(banner, sectionTitle.nextSibling);
        }
    }
    
    /**
     * Update pack discount UI
     */
    function updatePackDiscountUI() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update progress bar
        const progressElement = document.getElementById('pack-progress');
        if (progressElement) {
            const percentage = Math.min(100, (totalItems / DISCOUNT_THRESHOLD) * 100);
            
            progressElement.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                    <span>Progression:</span>
                    <span>${totalItems}/${DISCOUNT_THRESHOLD} t-shirts</span>
                </div>
                <div style="height: 8px; background-color: #333; border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: ${percentage}%; background-color: #ff3c00; transition: width 0.3s ease;"></div>
                </div>
                ${totalItems >= DISCOUNT_THRESHOLD ? 
                    '<div style="color: #ff3c00; margin-top: 5px; font-weight: 600;">Réduction de 20% appliquée!</div>' : 
                    ''}
            `;
        }
    }
});

/**
 * Apply pack discount to cart totals
 * This function should be called when calculating cart totals
 */
function applyPackDiscount(cart) {
    const DISCOUNT_THRESHOLD = 3;
    const DISCOUNT_PERCENTAGE = 20;
    
    // Count total items
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Check if discount applies
    if (totalItems >= DISCOUNT_THRESHOLD) {
        // Calculate discount
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discountAmount = subtotal * (DISCOUNT_PERCENTAGE / 100);
        
        return {
            subtotal: subtotal,
            discount: discountAmount,
            total: subtotal - discountAmount,
            discountApplied: true,
            discountPercentage: DISCOUNT_PERCENTAGE
        };
    }
    
    // No discount
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return {
        subtotal: subtotal,
        discount: 0,
        total: subtotal,
        discountApplied: false,
        discountPercentage: 0
    };
}