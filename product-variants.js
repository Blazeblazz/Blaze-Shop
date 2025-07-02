// Product Variants Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Product color variants data
    const productVariants = {
        'RISE': ['white', 'brown'],
        'SEGRETO': ['white', 'black', 'brown'],
        'WILDFLOWERS': ['black', 'white'],
        'RUSH': ['white', 'brown', 'black'],
        'LOST IN CASABLANCA': ['white', 'brown'],
        'TRUST THE PROCESS': ['black', 'white']
    };
    
    // Color names for display
    const colorNames = {
        'white': 'Blanc',
        'black': 'Noir',
        'brown': 'Beige foncé'
    };
    
    // Product image mapping
    const productImages = {
        'RISE': 'images/products/Rise.webp',
        'SEGRETO': 'images/products/SEGRETO.webp',
        'WILDFLOWERS': 'images/products/Wild-Flowers.webp',
        'RUSH': 'images/products/Rush.webp',
        'LOST IN CASABLANCA': 'images/products/Lost in Casablanca.webp',
        'TRUST THE PROCESS': 'images/products/Trust-The-Process.webp'
    };
    
    // Get product name from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    
    // Get product name from page or URL
    let productName = document.querySelector('.product-info-detail h1')?.textContent;
    
    // If we have a product parameter, update the page content
    if (productParam) {
        productName = productParam;
        
        // Update page title
        document.title = `${productParam} - BLAZE Streetwear`;
        
        // Update product name in the page
        const productTitle = document.querySelector('.product-info-detail h1');
        if (productTitle) {
            productTitle.textContent = productParam;
        }
        
        // Update product image
        const mainImage = document.getElementById('main-product-image');
        if (mainImage && productImages[productParam]) {
            mainImage.src = productImages[productParam];
            mainImage.alt = `T-shirt ${productParam}`;
        }
        
        // Update thumbnail images
        const thumbnails = document.querySelectorAll('.thumbnail');
        if (thumbnails.length > 0 && productImages[productParam]) {
            thumbnails.forEach(thumbnail => {
                thumbnail.setAttribute('data-image', productImages[productParam]);
                const thumbnailImg = thumbnail.querySelector('img');
                if (thumbnailImg) {
                    thumbnailImg.src = productImages[productParam];
                    thumbnailImg.alt = `T-shirt ${productParam}`;
                }
            });
        }
    }
    
    // If we have a product name and it exists in our variants
    if (productName && productVariants[productName]) {
        const colorOptions = document.getElementById('color-options');
        
        // Clear existing options
        if (colorOptions) {
            colorOptions.innerHTML = '';
            
            // Add color options based on product
            productVariants[productName].forEach((color, index) => {
                const colorOption = document.createElement('label');
                colorOption.className = 'color-option';
                colorOption.innerHTML = `
                    <input type="radio" name="color" value="${color}" ${index === 0 ? 'checked' : ''}>
                    <span class="color-swatch color-${color}"></span>
                    <span class="color-name">${colorNames[color]}</span>
                `;
                colorOptions.appendChild(colorOption);
            });
            
            // Add event listeners for color changes
            const colorInputs = document.querySelectorAll('input[name="color"]');
            colorInputs.forEach(input => {
                input.addEventListener('change', function() {
                    // Here you would typically change the product image
                    console.log(`Selected color: ${this.value}`);
                    
                    // You could update the image like this:
                    // const mainImage = document.getElementById('main-product-image');
                    // mainImage.src = `images/products/${productName.replace(' ', '-')}-${this.value}.webp`;
                });
            });
        }
    }
    
    // Update product data when adding to cart
    const addToCartBtn = document.querySelector('.btn-commandez');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            // Get selected color
            const selectedColor = document.querySelector('input[name="color"]:checked')?.value || 'white';
            
            // Store the selected color for cart.js to use
            sessionStorage.setItem('selectedColor', selectedColor);
        });
    }
});