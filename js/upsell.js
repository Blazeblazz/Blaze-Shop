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
    }
    
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
    
    // Event listeners for slider controls
    prevButton.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            // Loop to the end
            currentSlide = upsellProducts.length - 1;
        }
        updateSliderPosition();
    });
    
    nextButton.addEventListener('click', function() {
        if (currentSlide < upsellProducts.length - 1) {
            currentSlide++;
        } else {
            // Loop to the beginning
            currentSlide = 0;
        }
        updateSliderPosition();
    });
    
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
        
        // Store in session storage
        sessionStorage.setItem('directOrder', JSON.stringify(orderItems));
        
        // Redirect to checkout
        window.location.href = 'checkout.html';
    });
    
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