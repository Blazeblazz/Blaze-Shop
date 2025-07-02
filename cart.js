// Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCartItems();
    
    // Update cart count
    updateCartCount();
    
    // Checkout button
    const checkoutBtn = document.getElementById('btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }
    
    // Apply promo code
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function() {
            const promoCode = document.getElementById('promo-code').value.trim().toUpperCase();
            const subtotal = parseInt(document.getElementById('subtotal').textContent);
            
            if (promoCode === 'BLAZE15') {
                // Apply 15% discount
                const discount = Math.round(subtotal * 0.15);
                const newSubtotal = subtotal - discount;
                
                // Update totals
                updateTotals(newSubtotal);
                
                // Show confirmation
                alert('Code promo BLAZE15 appliqué! Réduction de 15%.');
            } else if (promoCode === 'BLAZE40') {
                // Apply 40% discount for first-time customers
                const discount = Math.round(subtotal * 0.4);
                const newSubtotal = subtotal - discount;
                
                // Update totals
                updateTotals(newSubtotal);
                
                // Show confirmation
                alert('Code promo BLAZE40 appliqué! Réduction de 40% pour votre première commande.');
            } else {
                // Invalid promo code
                alert('Code promo invalide.');
            }
        });
    }
});

// Helper function to get color name
function getColorName(colorCode) {
    const colorNames = {
        'white': 'Blanc',
        'black': 'Noir',
        'brown': 'Beige foncé'
    };
    return colorNames[colorCode] || colorCode;
}

// Load cart items
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartContainer = document.querySelector('.cart-container');
    let subtotal = 0;
    
    // Check if cart is empty
    if (cartItems.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartContainer) cartContainer.style.display = 'none';
        return;
    }
    
    // Show cart container, hide empty message
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartContainer) cartContainer.style.display = 'grid';
    
    // Clear container
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        // Add each item to the container
        cartItems.forEach((item, index) => {
            const itemTotal = parseInt(item.price) * item.quantity;
            subtotal += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-top">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} MAD</div>
                    </div>
                    <div class="cart-item-middle">
                        <div class="cart-item-size">Taille: ${item.size || 'Unique'}</div>
                        ${item.color ? `<div class="cart-item-color">Couleur: ${getColorName(item.color)}</div>` : ''}
                        <div class="cart-item-quantity">
                            <span>Quantité:</span>
                            <div class="quantity-selector">
                                <button class="quantity-btn minus" data-index="${index}">-</button>
                                <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input" data-index="${index}">
                                <button class="quantity-btn plus" data-index="${index}">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="cart-item-bottom">
                        <button class="cart-item-remove" data-index="${index}">
                            <i class="fas fa-trash-alt"></i> Supprimer
                        </button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners for quantity buttons and remove buttons
        addCartItemEventListeners();
        
        // Update totals
        updateTotals(subtotal);
    }
}

// Add event listeners to cart items
function addCartItemEventListeners() {
    // Quantity minus buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateItemQuantity(index, -1);
        });
    });
    
    // Quantity plus buttons
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateItemQuantity(index, 1);
        });
    });
    
    // Quantity input fields
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const value = parseInt(this.value);
            
            if (isNaN(value) || value < 1) {
                this.value = 1;
                updateItemQuantityDirect(index, 1);
            } else if (value > 10) {
                this.value = 10;
                updateItemQuantityDirect(index, 10);
            } else {
                updateItemQuantityDirect(index, value);
            }
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeCartItem(index);
        });
    });
}

// Update item quantity
function updateItemQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        
        // Ensure quantity is within bounds
        if (cart[index].quantity < 1) cart[index].quantity = 1;
        if (cart[index].quantity > 10) cart[index].quantity = 10;
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Reload cart items
        loadCartItems();
        
        // Update cart count
        updateCartCount();
    }
}

// Update item quantity directly
function updateItemQuantityDirect(index, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = quantity;
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Reload cart items
        loadCartItems();
        
        // Update cart count
        updateCartCount();
    }
}

// Remove cart item
function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Reload cart items
        loadCartItems();
        
        // Update cart count
        updateCartCount();
    }
}

// Update totals
function updateTotals(subtotal) {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    const freeShippingMessage = document.getElementById('free-shipping-message');
    
    if (subtotalElement && totalElement) {
        // Set subtotal
        subtotalElement.textContent = `${subtotal} MAD`;
        
        // Shipping is always free
        if (shippingElement) {
            shippingElement.textContent = 'Gratuit';
        }
        
        // Update free shipping message
        if (freeShippingMessage) {
            freeShippingMessage.innerHTML = '<i class="fas fa-check-circle"></i> <span>Livraison gratuite sur toutes les commandes</span>';
            freeShippingMessage.style.color = '#4CAF50';
        }
        
        // Calculate total (same as subtotal since shipping is free)
        totalElement.textContent = `${subtotal} MAD`;
    }
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}