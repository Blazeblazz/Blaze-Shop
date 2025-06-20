// Simple cart functionality
class Cart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
        this.updateCartCount();
    }
    
    // Load cart from localStorage
    loadFromStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                this.items = JSON.parse(savedCart);
            } catch (e) {
                console.error('Error loading cart:', e);
                this.items = [];
            }
        }
    }
    
    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    // Add item to cart
    addItem(product, quantity = 1, variant = null) {
        // Check if item already exists with same variant
        const existingItemIndex = this.items.findIndex(item => 
            item.id === product.id && item.variant === variant
        );
        
        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            this.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images ? product.images[0] : product.image,
                quantity: quantity,
                variant: variant
            });
        }
        
        this.saveToStorage();
        this.updateCartCount();
    }
    
    // Get cart count
    getCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    // Update cart count in UI
    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const count = this.getCount();
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }
}

// Initialize cart
const cart = new Cart();

// Add event listener to cart icon
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            // For now, just alert since we don't have a cart page yet
            alert('Cart functionality coming soon!');
        });
    }
});