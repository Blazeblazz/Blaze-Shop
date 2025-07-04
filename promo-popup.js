// Promotional Popup
document.addEventListener('DOMContentLoaded', function() {
    // Check if popup was previously closed
    if (localStorage.getItem('promoPopupClosed') === 'true') return;

    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'promo-popup';
    popup.innerHTML = `
        <div class="promo-popup-header">
            <h3 class="promo-popup-title">Offre Exclusive</h3>
            <button class="promo-popup-close" aria-label="Fermer"><i class="fas fa-times"></i></button>
        </div>
        <div class="promo-popup-content">
            <p>Obtenez <strong>40% de réduction</strong> sur votre première commande</p>
            <div class="promo-code">
                <span class="promo-code-value">BLAZE40</span>
                <button class="copy-btn" title="Copier le code" aria-label="Copier le code"><i class="fas fa-copy"></i></button>
            </div>
            <p><small>Valable jusqu'au 31 décembre 2025</small></p>
        </div>
        <a href="#products" class="promo-popup-cta">Acheter Maintenant</a>
    `;

    // Add to body (hidden initially)
    document.body.appendChild(popup);

    // Show popup after 5 seconds
    setTimeout(() => popup.classList.add('show'), 5000);

    // Close button functionality
    popup.querySelector('.promo-popup-close').addEventListener('click', () => {
        popup.classList.remove('show');
        localStorage.setItem('promoPopupClosed', 'true');
        setTimeout(() => popup.remove(), 500);
    });

    // Copy button functionality
    const copyBtn = popup.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        const codeValue = popup.querySelector('.promo-code-value').textContent;
        navigator.clipboard.writeText(codeValue).then(() => {
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
            }, 2000);
        });
    });
});
