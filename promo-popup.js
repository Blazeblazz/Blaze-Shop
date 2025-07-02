// Promotional Popup
document.addEventListener('DOMContentLoaded', function() {
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'promo-popup';
    popup.innerHTML = `
        <div class="promo-popup-header">
            <h3 class="promo-popup-title">Offre Exclusive</h3>
            <button class="promo-popup-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="promo-popup-content">
            <p>Obtenez <strong>40% de réduction</strong> sur votre première commande</p>
            <div class="promo-code">
                <span class="promo-code-value">BLAZE40</span>
                <button class="copy-btn" title="Copier le code"><i class="fas fa-copy"></i></button>
            </div>
            <p><small>Valable jusqu'au 31 décembre 2025</small></p>
        </div>
        <a href="#products" class="promo-popup-cta">Acheter Maintenant</a>
    `;
    
    // Add to body
    document.body.appendChild(popup);
    
    // Show popup after 5 seconds
    setTimeout(function() {
        popup.classList.add('show');
    }, 5000);
    
    // Close button functionality
    const closeBtn = popup.querySelector('.promo-popup-close');
    closeBtn.addEventListener('click', function() {
        popup.classList.remove('show');
        
        // Set cookie to remember closed state
        localStorage.setItem('promoPopupClosed', 'true');
        
        // Remove after animation
        setTimeout(function() {
            popup.remove();
        }, 500);
    });
    
    // Copy button functionality
    const copyBtn = popup.querySelector('.copy-btn');
    copyBtn.addEventListener('click', function() {
        const codeValue = popup.querySelector('.promo-code-value').textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(codeValue).then(function() {
            // Show copied message
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            // Reset after 2 seconds
            setTimeout(function() {
                copyBtn.innerHTML = originalIcon;
            }, 2000);
        });
    });
    
    // Check if popup was previously closed
    if (localStorage.getItem('promoPopupClosed') === 'true') {
        popup.remove();
    }
});