/**
 * Pack Discount System - Upsell Version
 * Shows upsell messages to encourage adding more items to reach discount threshold
 */
document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const DISCOUNT_THRESHOLD = 3; // Number of items needed for discount
    const DISCOUNT_PERCENTAGE = 20; // 20% discount
    
    // Initialize cart if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Get current cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Add upsell banner based on cart contents
    addUpsellBanner(totalItems);
    
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
            
            // Show confirmation with upsell
            showAddedToCartMessage(productName);
            
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
        
        // Update upsell banner
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        addUpsellBanner(totalItems);
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
     * Show added to cart message with upsell
     */
    function showAddedToCartMessage(productName) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Create message element if it doesn't exist
        let messageElement = document.getElementById('cart-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'cart-message';
            messageElement.style.position = 'fixed';
            messageElement.style.bottom = '20px';
            messageElement.style.right = '20px';
            messageElement.style.backgroundColor = '#151515';
            messageElement.style.color = 'white';
            messageElement.style.padding = '15px 20px';
            messageElement.style.borderRadius = '8px';
            messageElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            messageElement.style.zIndex = '1000';
            messageElement.style.transform = 'translateY(100px)';
            messageElement.style.transition = 'transform 0.3s ease';
            messageElement.style.maxWidth = '350px';
            document.body.appendChild(messageElement);
        }
        
        // Get upsell message
        const upsellMessage = getUpsellMessage(totalItems);
        
        // Update message content
        messageElement.innerHTML = `
            <div style="display: flex; align-items: flex-start;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px; min-width: 24px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <div>
                    <div style="margin-bottom: 5px;"><strong>${productName}</strong> ajouté au panier</div>
                    <div style="font-size: 0.9em; color: ${totalItems >= DISCOUNT_THRESHOLD ? '#FF0000' : '#aaa'};">
                        ${upsellMessage}
                    </div>
                    ${totalItems > 0 && totalItems < DISCOUNT_THRESHOLD ? 
                        `<a href="#produits" style="color: #FF0000; text-decoration: none; display: inline-block; margin-top: 8px; font-weight: 500;">Ajouter plus de t-shirts</a>` : 
                        totalItems >= DISCOUNT_THRESHOLD ? 
                        `<a href="checkout.html" style="color: #FF0000; text-decoration: none; display: inline-block; margin-top: 8px; font-weight: 500;">Passer à la caisse</a>` : ''}
                </div>
            </div>
        `;
        
        // Show message
        setTimeout(() => {
            messageElement.style.transform = 'translateY(0)';
        }, 10);
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageElement.style.transform = 'translateY(100px)';
        }, 5000);
    }
    
    /**
     * Get upsell message based on cart items
     */
    function getUpsellMessage(totalItems) {
        if (totalItems >= DISCOUNT_THRESHOLD) {
            return `Félicitations! Réduction de ${DISCOUNT_PERCENTAGE}% appliquée!`;
        } else if (totalItems === 0) {
            return `Ajoutez ${DISCOUNT_THRESHOLD} t-shirts pour obtenir -${DISCOUNT_PERCENTAGE}%`;
        } else {
            const remaining = DISCOUNT_THRESHOLD - totalItems;
            return `Plus que ${remaining} t-shirt${remaining > 1 ? 's' : ''} pour obtenir -${DISCOUNT_PERCENTAGE}%!`;
        }
    }
    
    /**
     * Add upsell banner to the page
     */
    function addUpsellBanner(totalItems) {
        // Remove existing banner if any
        const existingBanner = document.getElementById('upsell-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        // Create banner element
        const banner = document.createElement('div');
        banner.id = 'upsell-banner';
        banner.style.backgroundColor = '#151515';
        banner.style.padding = '15px';
        banner.style.borderRadius = '8px';
        banner.style.margin = '20px 0';
        banner.style.textAlign = 'center';
        banner.style.position = 'relative';
        banner.style.overflow = 'hidden';
        
        // Add progress bar background
        const progressBackground = document.createElement('div');
        progressBackground.style.position = 'absolute';
        progressBackground.style.bottom = '0';
        progressBackground.style.left = '0';
        progressBackground.style.width = '100%';
        progressBackground.style.height = '4px';
        progressBackground.style.backgroundColor = '#333';
        banner.appendChild(progressBackground);
        
        // Add progress bar fill
        const progressFill = document.createElement('div');
        progressFill.style.position = 'absolute';
        progressFill.style.bottom = '0';
        progressFill.style.left = '0';
        progressFill.style.height = '4px';
        progressFill.style.backgroundColor = '#FF0000';
        progressFill.style.width = `${Math.min(100, (totalItems / DISCOUNT_THRESHOLD) * 100)}%`;
        progressFill.style.transition = 'width 0.3s ease';
        banner.appendChild(progressFill);
        
        // Add content based on cart items
        if (totalItems >= DISCOUNT_THRESHOLD) {
            // Discount achieved
            banner.innerHTML += `
                <div style="font-weight: 600; color: #FF0000; margin-bottom: 5px;">RÉDUCTION APPLIQUÉE!</div>
                <div style="font-size: 1.2rem; margin-bottom: 5px;">Vous bénéficiez de ${DISCOUNT_PERCENTAGE}% de réduction</div>
                <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 10px;">Réduction appliquée automatiquement dans votre panier</div>
                <a href="checkout.html" class="btn" style="display: inline-block; margin-top: 5px;">Passer à la caisse</a>
            `;
        } else if (totalItems === 0) {
            // Empty cart
            banner.innerHTML += `
                <div style="font-weight: 600; color: #FF0000; margin-bottom: 5px;">OFFRE SPÉCIALE</div>
                <div style="font-size: 1.2rem; margin-bottom: 5px;">Achetez ${DISCOUNT_THRESHOLD} t-shirts et économisez ${DISCOUNT_PERCENTAGE}%</div>
                <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 10px;">Réduction appliquée automatiquement dans votre panier</div>
            `;
        } else {
            // Partial progress
            const remaining = DISCOUNT_THRESHOLD - totalItems;
            banner.innerHTML += `
                <div style="font-weight: 600; color: #FF0000; margin-bottom: 5px;">PRESQUE LÀ!</div>
                <div style="font-size: 1.2rem; margin-bottom: 5px;">Plus que ${remaining} t-shirt${remaining > 1 ? 's' : ''} pour obtenir -${DISCOUNT_PERCENTAGE}%</div>
                <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 10px;">Ajoutez ${remaining} t-shirt${remaining > 1 ? 's' : ''} de plus à votre panier pour bénéficier de la réduction</div>
            `;
        }
        
        // Insert banner at appropriate location
        const insertLocation = document.querySelector('.product-grid') || 
                              document.querySelector('.product-detail') ||
                              document.querySelector('section');
        
        if (insertLocation) {
            if (insertLocation.classList.contains('product-grid')) {
                // On product listing page
                insertLocation.parentNode.insertBefore(banner, insertLocation);
            } else if (insertLocation.classList.contains('product-detail')) {
                // On product detail page
                const productActions = document.querySelector('.product-actions');
                if (productActions) {
                    productActions.parentNode.insertBefore(banner, productActions);
                } else {
                    insertLocation.appendChild(banner);
                }
            } else {
                // Fallback
                insertLocation.appendChild(banner);
            }
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