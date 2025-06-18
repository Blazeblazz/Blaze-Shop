// Pack offer functionality
document.addEventListener('DOMContentLoaded', function() {
    // Products data
    const products = [
        {
            id: 1,
            name: "Lost-in-Casablanca",
            price: 129,
            image: "images/Products/Lost-in-Casablanca.webp",
            variants: ["White", "Beige"]
        },
        {
            id: 2,
            name: "Red Rug",
            price: 129,
            image: "images/Products/Red-Rug.webp",
            variants: ["White", "Black", "Beige"]
        },
        {
            id: 3,
            name: "Turtle Rush",
            price: 129,
            image: "images/Products/Turtle-Rush-White.webp",
            variants: ["Black", "White", "Beige"]
        },
        {
            id: 4,
            name: "Whispering Wildflowers",
            price: 129,
            image: "images/Products/Whispering-Wildflowers.webp",
            variants: ["Black", "White"]
        },
        {
            id: 5,
            name: "Rise",
            price: 129,
            image: "images/Products/RISE.webp",
            variants: ["White"]
        },
        {
            id: 6,
            name: "Rush",
            price: 129,
            image: "images/Products/Rush.webp",
            variants: ["White", "Black"]
        }
    ];
    
    let selectedProducts = [];
    const MAX_SELECTION = 3;
    const productGrid = document.getElementById('product-grid');
    
    // Helper function for color codes
    function getColorCode(color) {
        return {White:'#ffffff', Black:'#000000', Beige:'#f5f5dc'}[color] || '#cccccc';
    }
    
    // Render products
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;
        
        // Create variant options HTML
        const variantOptions = product.variants.map((variant, i) => 
            `<div class="variant-option ${i===0?'active':''}" 
                  data-variant="${variant}" 
                  style="background-color:${getColorCode(variant)}" 
                  title="${variant}"></div>`
        ).join('');
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">${product.price} MAD</div>
            <div class="variant-selector">
                <label>Couleur:</label>
                <div class="variant-options" data-product-id="${product.id}">${variantOptions}</div>
            </div>
            <button class="select-btn">Sélectionner</button>
        `;
        
        productGrid.appendChild(card);
        
        // Add event listeners
        card.querySelectorAll('.variant-option').forEach(opt => {
            opt.addEventListener('click', e => {
                e.stopPropagation();
                card.querySelectorAll('.variant-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
            });
        });
        
        card.querySelector('.select-btn').addEventListener('click', e => {
            e.stopPropagation();
            const variant = card.querySelector('.variant-option.active').dataset.variant;
            toggleSelection({...product, selectedVariant: variant}, card);
        });
    });
    
    // Toggle product selection
    function toggleSelection(product, card) {
        const isSelected = card.classList.contains('selected');
        const btn = card.querySelector('.select-btn');
        
        if (isSelected) {
            card.classList.remove('selected');
            selectedProducts = selectedProducts.filter(p => p.id !== product.id);
            btn.textContent = 'Sélectionner';
        } else if (selectedProducts.length < MAX_SELECTION) {
            card.classList.add('selected');
            selectedProducts.push(product);
            btn.textContent = 'Désélectionner';
        } else {
            alert('Vous avez déjà sélectionné 3 t-shirts. Veuillez en désélectionner un avant d\'en ajouter un nouveau.');
            return;
        }
        
        updateSelectionDisplay();
    }
    
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
                            <span>Couleur: </span>
                            <span class="variant-badge" style="background-color:${getColorCode(product.selectedVariant)}"></span>
                            <span>${product.selectedVariant}</span>
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
                    document.querySelector(`.product-card[data-id="${productId}"] .select-btn`).textContent = 'Sélectionner';
                    
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