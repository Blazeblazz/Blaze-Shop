// Pack offer functionality
document.addEventListener('DOMContentLoaded', function() {
    // Products data
    const products = [
        {
            id: 1,
            name: "Lost-in-Casablanca",
            price: 129,
            image: "images/products/Lost-in-Casablanca.webp",
            variants: ["White", "Beige"]
        },
        {
            id: 2,
            name: "Red Rug",
            price: 129,
            image: "images/products/Red-Rug.webp",
            variants: ["White", "Black", "Beige"]
        },
        {
            id: 3,
            name: "Turtle Rush",
            price: 129,
            image: "images/products/Turtle-Rush-White.webp",
            variants: ["Black", "White", "Beige"]
        },
        {
            id: 4,
            name: "Whispering Wildflowers",
            price: 129,
            image: "images/products/Whispering-Wildflowers.webp",
            variants: ["Black", "White"]
        },
        {
            id: 5,
            name: "Rise",
            price: 129,
            image: "images/products/Rise.webp",
            variants: ["White"]
        },
        {
            id: 6,
            name: "Rush",
            price: 129,
            image: "images/products/Rush.webp",
            variants: ["White", "Black"]
        }
    ];
    
    let selectedProducts = [];
    const MAX_SELECTION = 3;
    const productGrid = document.getElementById('product-grid');
    
    // Render products
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;
        
        // Create variant dropdown options
        const variantOptions = product.variants.map(variant => 
            `<option value="${variant}">${variant}</option>`
        ).join('');
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">${product.price} MAD</div>
            <div class="variant-selector">
                <label for="variant-${product.id}">Couleur:</label>
                <select id="variant-${product.id}" class="variant-select">
                    ${variantOptions}
                </select>
            </div>
        `;
        
        productGrid.appendChild(card);
        
        // Add click event to the card
        card.addEventListener('click', function() {
            if (card.classList.contains('selected')) {
                // Remove from selection
                card.classList.remove('selected');
                selectedProducts = selectedProducts.filter(p => p.id !== product.id);
            } else {
                // Add to selection if less than 3 products are selected
                if (selectedProducts.length < MAX_SELECTION) {
                    const selectedVariant = card.querySelector('.variant-select').value;
                    card.classList.add('selected');
                    selectedProducts.push({
                        ...product,
                        selectedVariant: selectedVariant
                    });
                } else {
                    alert('Vous avez déjà sélectionné 3 t-shirts. Veuillez en désélectionner un avant d\'en ajouter un nouveau.');
                    return;
                }
            }
            
            // Update selection display
            updateSelectionDisplay();
        });
        
        // Update selection when variant changes
        const variantSelect = card.querySelector('.variant-select');
        variantSelect.addEventListener('change', function(e) {
            e.stopPropagation(); // Prevent triggering card click
            
            // If this product is already selected, update its variant
            const selectedIndex = selectedProducts.findIndex(p => p.id === product.id);
            if (selectedIndex !== -1) {
                selectedProducts[selectedIndex].selectedVariant = this.value;
                updateSelectionDisplay();
            }
        });
    });
    
    // Update selection display
    function updateSelectionDisplay() {
        const container = document.getElementById('selected-items');
        const noSelection = document.getElementById('no-selection-message');
        const countElement = document.getElementById('selected-count');
        const orderButton = document.getElementById('order-pack-btn');
        const priceElement = document.getElementById('pack-total-price');
        
        countElement.textContent = selectedProducts.length;
        container.innerHTML = '';
        
        if (selectedProducts.length === 0) {
            container.appendChild(noSelection);
            orderButton.disabled = true;
            priceElement.textContent = '0 MAD';
        } else {
            selectedProducts.forEach(product => {
                const item = document.createElement('div');
                item.className = 'selected-item';
                
                item.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="selected-item-info">
                        <h4>${product.name}</h4>
                        <div class="price">${product.price} MAD</div>
                        <div class="selected-variant">
                            <span>Couleur: ${product.selectedVariant}</span>
                        </div>
                    </div>
                    <button class="remove-btn" data-id="${product.id}">×</button>
                `;
                
                container.appendChild(item);
                
                // Add remove button event
                item.querySelector('.remove-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    const productId = parseInt(this.dataset.id);
                    
                    // Remove from selected products
                    selectedProducts = selectedProducts.filter(p => p.id !== productId);
                    
                    // Remove selected class from product card
                    document.querySelector(`.product-card[data-id="${productId}"]`).classList.remove('selected');
                    
                    // Update display
                    updateSelectionDisplay();
                });
            });
            
            const packPrice = selectedProducts.length === MAX_SELECTION ? 309 : Math.round(selectedProducts.length * 103);
            priceElement.textContent = `${packPrice} MAD`;
            orderButton.disabled = selectedProducts.length !== MAX_SELECTION;
        }
    }
    
    // Order button click handler
    document.getElementById('order-pack-btn').addEventListener('click', function() {
        if (selectedProducts.length === MAX_SELECTION) {
            const orderItems = selectedProducts.map(product => ({
                id: product.id,
                name: product.name,
                price: 103,
                image: product.image,
                quantity: 1,
                variant: product.selectedVariant
            }));
            
            sessionStorage.setItem('directOrder', JSON.stringify(orderItems));
            window.location.href = 'checkout.html';
        }
    });
});