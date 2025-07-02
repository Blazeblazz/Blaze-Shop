// Rotating marketing banner
document.addEventListener('DOMContentLoaded', function() {
    const marketingMessages = [
        '<i class="fas fa-shipping-fast"></i> Livraison gratuite pour les commandes de plus de 500 MAD',
        '<i class="fas fa-percentage"></i> Utilisez le code BLAZE15 pour 15% de réduction',
        '<i class="fas fa-box"></i> Édition limitée - 100 exemplaires par design',
        '<i class="fas fa-clock"></i> Expédition sous 24h pour toutes les commandes'
    ];
    
    const banner = document.querySelector('.marketing-banner');
    let currentIndex = 0;
    
    // Set initial message
    banner.innerHTML = marketingMessages[currentIndex];
    
    // Rotate messages every 5 seconds
    setInterval(function() {
        currentIndex = (currentIndex + 1) % marketingMessages.length;
        
        // Fade out
        banner.style.opacity = 0;
        
        // Change text and fade in after transition
        setTimeout(function() {
            banner.innerHTML = marketingMessages[currentIndex];
            banner.style.opacity = 1;
        }, 500);
    }, 5000);
});