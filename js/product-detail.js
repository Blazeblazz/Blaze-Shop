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
    
    // Set rating stars
    const ratingStars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    document.getElementById('product-rating').textContent = ratingStars;
    
    // Set description
    document.getElementById('product-description').textContent = product.description;
    
    // Set specifications
    const specsList = document.getElementById('product-specs');
    product.specs.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
    });
    
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
        variantContainer.className = 'product-variants';
        
        const variantLabel = document.createElement('p');
        variantLabel.textContent = 'Couleurs disponibles:';
        variantLabel.style.marginBottom = '10px';
        variantContainer.appendChild(variantLabel);
        
        const variantOptions = document.createElement('div');
        variantOptions.className = 'variant-options';
        variantOptions.style.display = 'flex';
        variantOptions.style.gap = '10px';
        
        product.variants.forEach(variant => {
            const variantBtn = document.createElement('div');
            variantBtn.className = 'variant-option';
            variantBtn.style.width = '30px';
            variantBtn.style.height = '30px';
            variantBtn.style.borderRadius = '50%';
            variantBtn.style.backgroundColor = getColorCode(variant);
            variantBtn.style.cursor = 'pointer';
            variantBtn.style.border = '2px solid #ddd';
            variantBtn.title = variant;
            
            variantBtn.addEventListener('click', function() {
                // Update active variant
                document.querySelectorAll('.variant-option').forEach(opt => {
                    opt.style.border = '2px solid #ddd';
                });
                this.style.border = '2px solid #ff3c00';
            });
            
            variantOptions.appendChild(variantBtn);
        });
        
        variantContainer.appendChild(variantOptions);
        
        // Insert after specs
        specsList.parentNode.insertBefore(variantContainer, specsList.nextSibling);
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
    
    // Order now button
    document.getElementById('order-now').addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        
        // Create a direct order with this product
        const orderItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0], // Use first image from images array
            quantity: quantity
        };
        
        // Store in session storage for checkout
        sessionStorage.setItem('directOrder', JSON.stringify([orderItem]));
        
        // Redirect to checkout
        window.location.href = 'checkout.html';
    });
});

// Products data
const products = [
    {
        id: 1,
        name: "Lost-in-Casablanca",
        price: 129,
        category: "casual",
        image: "images/products/Lost-in-Casablanca.webp",
        rating: 5,
        description: "T-shirt inspiré par les rues animées de Casablanca, avec un design urbain unique.",
        inStock: true,
        variants: ["White", "Beige"],
        specs: [
            "100% coton premium",
            "Taille unique adaptable",
            "Lavable en machine",
            "Fabriqué au Maroc",
            "Design exclusif"
        ],
        images: [
            "images/products/Lost-in-Casablanca.webp",
            "images/products/Lost-in-Casablanca-2.webp",
            "images/products/Lost-in-Casablanca-3.webp"
        ]
    },
    {
        id: 2,
        name: "Red Rug",
        price: 129,
        category: "traditionnel",
        image: "images/products/Red-Rug.webp",
        rating: 5,
        description: "T-shirt avec motif inspiré des tapis traditionnels marocains, alliant tradition et modernité.",
        inStock: true,
        variants: ["White", "Black", "Beige"],
        specs: [
            "100% coton premium",
            "Taille unique adaptable",
            "Lavable en machine",
            "Fabriqué au Maroc",
            "Motifs traditionnels"
        ],
        images: [
            "images/products/Red-Rug.webp",
            "images/products/Red-Rug-2.webp",
            "images/products/Red-Rug-3.webp"
        ]
    },
    {
        id: 3,
        name: "Turtle Rush",
        price: 129,
        category: "sportif",
        image: "images/products/Turtle-Rush-White.webp",
        rating: 5,
        description: "T-shirt sportif avec design de tortue, parfait pour les activités de plein air et le sport.",
        inStock: true,
        variants: ["Black", "White", "Beige"],
        specs: [
            "Tissu respirant",
            "Taille unique adaptable",
            "Séchage rapide",
            "Fabriqué au Maroc",
            "Design exclusif"
        ],
        images: [
            "images/products/Turtle-Rush-White.webp",
            "images/products/Turtle-Rush-White-2.webp",
            "images/products/Turtle-Rush-White-3.webp"
        ]
    },
    {
        id: 4,
        name: "Whispering Wildflowers",
        price: 129,
        category: "casual",
        image: "images/products/Whispering-Wildflowers.webp",
        rating: 5,
        description: "T-shirt avec motif floral élégant, idéal pour un look décontracté et stylé.",
        inStock: true,
        variants: ["Black", "White"],
        specs: [
            "100% coton premium",
            "Taille unique adaptable",
            "Lavable en machine",
            "Fabriqué au Maroc",
            "Motif floral exclusif"
        ],
        images: [
            "images/products/Whispering-Wildflowers.webp",
            "images/products/Whispering-Wildflowers-2.webp",
            "images/products/Whispering-Wildflowers-3.webp"
        ]
    },
    {
        id: 5,
        name: "Rise",
        price: 129,
        category: "traditionnel",
        image: "images/products/Rise.webp",
        rating: 5,
        description: "T-shirt avec un design inspirant et élégant, parfait pour toutes les occasions.",
        inStock: true,
        variants: ["White"],
        specs: [
            "100% coton premium",
            "Taille unique adaptable",
            "Lavable en machine",
            "Fabriqué au Maroc",
            "Design exclusif"
        ],
        images: [
            "images/products/Rise.webp",
            "images/products/Rise-2.webp",
            "images/products/Rise-3.webp"
        ]
    },
    {
        id: 6,
        name: "Rush",
        price: 129,
        category: "sportif",
        image: "images/products/Rush.webp",
        rating: 5,
        description: "T-shirt sportif dynamique, idéal pour les activités physiques et le quotidien.",
        inStock: true,
        variants: ["White", "Black"],
        specs: [
            "Tissu respirant",
            "Taille unique adaptable",
            "Séchage rapide",
            "Fabriqué au Maroc",
            "Design sportif"
        ],
        images: [
            "images/products/Rush.webp",
            "images/products/Rush-2.webp",
            "images/products/Rush-3.webp"
        ]
    }
];