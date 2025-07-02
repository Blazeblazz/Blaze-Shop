// Direct checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Find all product cards
    const productCards = document.querySelectorAll('.product-card');
    
    // Process each product card
    productCards.forEach(card => {
        // Get product info
        const productName = card.querySelector('h3')?.textContent;
        if (!productName) return;
        
        const priceElement = card.querySelector('.price');
        if (!priceElement) return;
        
        const productPrice = priceElement.textContent.split(' ')[0];
        const productImage = card.querySelector('img')?.getAttribute('src');
        
        // Create Commander button
        const productActions = card.querySelector('.product-actions');
        if (productActions) {
            // Remove existing buttons
            productActions.innerHTML = '';
            
            // Create Commander button (direct checkout)
            const commanderBtn = document.createElement('a');
            commanderBtn.href = `product-detail.html?product=${encodeURIComponent(productName)}`;
            commanderBtn.className = 'btn-commander';
            commanderBtn.textContent = 'Commander';
            commanderBtn.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            // Create Quick View button
            const quickViewBtn = document.createElement('button');
            quickViewBtn.className = 'btn-quick-view';
            quickViewBtn.textContent = 'Quick View';
            quickViewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                window.location.href = `product-detail.html?product=${encodeURIComponent(productName)}`;
            });
            
            // Add buttons to product actions
            productActions.appendChild(quickViewBtn);
            productActions.appendChild(commanderBtn);
        }
    });
});