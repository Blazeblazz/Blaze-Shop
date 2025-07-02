// Add detail buttons to all product cards
document.addEventListener('DOMContentLoaded', function() {
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');
    
    // Process each product card
    productCards.forEach(card => {
        // Get product info
        const productName = card.querySelector('h3').textContent;
        const productInfo = card.querySelector('.product-info');
        
        // Check if product info actions already exists
        if (productInfo && !productInfo.querySelector('.product-info-actions')) {
            // Wrap existing content in a div
            const existingContent = productInfo.innerHTML;
            
            // Create new structure
            productInfo.innerHTML = `
                <div>
                    ${existingContent}
                </div>
                <div class="product-info-actions">
                    <a href="product-detail.html?product=${encodeURIComponent(productName)}" class="btn-detail">Détails</a>
                </div>
            `;
        }
    });
});