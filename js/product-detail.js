// Product detail functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Find product in products data
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        // Product not found, redirect to homepage
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `BLAZE | ${product.name}`;
    
    // Populate product details
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = `${product.price} MAD`;
    
    // Set rating stars (gold color is set in CSS)
    const ratingStars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    document.getElementById('product-rating').textContent = ratingStars;
    
    // Set description
    document.getElementById('product-description').textContent = product.description;
    
    // Set main image
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Create thumbnails
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${product.name} - Image ${index + 1}`;
        
        thumbnail.appendChild(img);
        thumbnailContainer.appendChild(thumbnail);
        
        // Add click event to thumbnail
        thumbnail.addEventListener('click', function() {
            // Update main image
            mainImage.src = image;
            
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Add color variants if available
    if (product.variants && product.variants.length > 0) {
        const variantContainer = document.createElement('div');
        variantContainer.className = 'variant-selector';
        
        const variantLabel = document.createElement('p');
        variantLabel.textContent = 'Couleurs disponibles:';
        variantLabel.style.marginBottom = '10px';
        variantContainer.appendChild(variantLabel);
        
        const variantOptions = document.createElement('div');
        variantOptions.className = 'variant-options';
        
        product.variants.forEach((variant, index) => {
            const variantBtn = document.createElement('div');
            variantBtn.className = 'variant-option' + (index === 0 ? ' active' : '');
            variantBtn.dataset.variant = variant;
            variantBtn.style.backgroundColor = getColorCode(variant);
            variantBtn.title = variant;
            
            variantBtn.addEventListener('click', function() {
                // Update active variant
                document.querySelectorAll('.variant-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
            });
            
            variantOptions.appendChild(variantBtn);
        });
        
        variantContainer.appendChild(variantOptions);
        
        // Add to variants container
        document.getElementById('product-variants-container').appendChild(variantContainer);
    }
    
    // Helper function to convert color names to color codes
    function getColorCode(colorName) {
        const colorMap = {
            'White': '#ffffff',
            'Black': '#000000',
            'Beige': '#f5f5dc'
        };
        return colorMap[colorName] || '#cccccc';
    }
    
    // Quantity controls
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    
    decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Order now button functionality
    const orderNowButton = document.getElementById('order-now');
    if (orderNowButton) {
        orderNowButton.addEventListener('click', function() {
            // Get main product details
            const mainProduct = products.find(p => p.id === productId);
            if (!mainProduct) return;
            
            const mainVariant = document.querySelector('.variant-option.active')?.dataset.variant || mainProduct.variants[0];
            const mainQuantity = parseInt(document.getElementById('quantity').value) || 1;
            
            // Direct checkout
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

// Products data
const products = [
    {
        id: 1,
        name: "Lost-in-Casablanca",
        price: 129,
        category: "casual",
        image: "images/Products/Lost-in-Casablanca.webp",
        rating: 5,
        description: "T-shirt inspiré par les rues animées de Casablanca, avec un design urbain unique.",
        inStock: true,
        variants: ["White", "Beige"],
        images: [
            "images/Products/Lost-in-Casablanca.webp",
            "images/Products/Lost-in-Casablanca.webp",
            "images/Products/Lost-in-Casablanca.webp"
        ]
    },
    {
        id: 2,
        name: "Red Rug",
        price: 129,
        category: "traditionnel",
        image: "images/Products/Red-Rug.webp",
        rating: 5,
        description: "T-shirt avec motif inspiré des tapis traditionnels marocains, alliant tradition et modernité.",
        inStock: true,
        variants: ["White", "Black", "Beige"],
        images: [
            "images/Products/Red-Rug.webp",
            "images/Products/Red-Rug.webp",
            "images/Products/Red-Rug.webp"
        ]
    },
    {
        id: 3,
        name: "Turtle Rush",
        price: 129,
        category: "sportif",
        image: "images/Products/Turtle-Rush-White.webp",
        rating: 5,
        description: "T-shirt sportif avec design de tortue, parfait pour les activités de plein air et le sport.",
        inStock: true,
        variants: ["Black", "White", "Beige"],
        images: [
            "images/Products/Turtle-Rush-White.webp",
            "images/Products/Turtle-Rush-White.webp",
            "images/Products/Turtle-Rush-White.webp"
        ]
    },
    {
        id: 4,
        name: "Whispering Wildflowers",
        price: 129,
        category: "casual",
        image: "images/Products/Whispering-Wildflowers.webp",
        rating: 5,
        description: "T-shirt avec motif floral élégant, idéal pour un look décontracté et stylé.",
        inStock: true,
        variants: ["Black", "White"],
        images: [
            "images/Products/Whispering-Wildflowers.webp",
            "images/Products/Whispering-Wildflowers.webp",
            "images/Products/Whispering-Wildflowers.webp"
        ]
    },
    {
        id: 5,
        name: "Rise",
        price: 129,
        category: "traditionnel",
        image: "images/Products/RISE.webp",
        rating: 5,
        description: "T-shirt avec un design inspirant et élégant, parfait pour toutes les occasions.",
        inStock: true,
        variants: ["White"],
        images: [
            "images/Products/RISE.webp",
            "images/Products/RISE.webp",
            "images/Products/RISE.webp"
        ]
    },
    {
        id: 6,
        name: "Rush",
        price: 129,
        category: "sportif",
        image: "images/Products/Rush.webp",
        rating: 5,
        description: "T-shirt sportif dynamique, idéal pour les activités physiques et le quotidien.",
        inStock: true,
        variants: ["White", "Black"],
        images: [
            "images/Products/Rush.webp",
            "images/Products/Rush.webp",
            "images/Products/Rush.webp"
        ]
    }
];