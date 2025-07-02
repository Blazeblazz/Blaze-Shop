// Stock Counter
document.addEventListener('DOMContentLoaded', function() {
    // Add stock counters to products
    const productCards = document.querySelectorAll('.product-card');
    
    // Stock data (in a real app, this would come from a database)
    const stockData = {
        'RISE': { total: 100, remaining: 7 },
        'SEGRETO': { total: 100, remaining: 23 },
        'WILDFLOWERS': { total: 100, remaining: 15 },
        'RUSH': { total: 100, remaining: 4 },
        'LOST IN CASABLANCA': { total: 100, remaining: 9 },
        'TRUST THE PROCESS': { total: 100, remaining: 31 }
    };
    
    productCards.forEach(card => {
        // Get product name
        const productName = card.querySelector('h3').textContent;
        
        // Get stock data
        const stock = stockData[productName];
        if (!stock) return;
        
        // Calculate percentage
        const percentage = (stock.remaining / stock.total) * 100;
        
        // Create stock counter element
        const stockCounter = document.createElement('div');
        stockCounter.className = 'stock-counter' + (stock.remaining < 10 ? ' low' : '');
        stockCounter.innerHTML = `
            <i class="fas fa-fire"></i> Reste ${stock.remaining}
            <div class="stock-counter-bar">
                <div class="stock-counter-progress" style="width: ${percentage}%;"></div>
            </div>
        `;
        
        // Add to product image
        const productImage = card.querySelector('.product-image');
        productImage.appendChild(stockCounter);
    });
});