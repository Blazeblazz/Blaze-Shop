// Cookie Consent Banner
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already consented
    if (!localStorage.getItem('cookieConsent')) {
        // Create cookie consent banner
        const cookieBanner = document.createElement('div');
        cookieBanner.id = 'cookie-banner';
        cookieBanner.className = 'cookie-banner';
        cookieBanner.innerHTML = `
            <div class="cookie-content">
                <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant à naviguer, vous acceptez notre utilisation des cookies.</p>
                <div class="cookie-buttons">
                    <button id="cookie-accept" class="cookie-btn cookie-accept">Accepter</button>
                    <button id="cookie-decline" class="cookie-btn cookie-decline">Refuser</button>
                    <a href="politique-confidentialite.html" class="cookie-more">En savoir plus</a>
                </div>
            </div>
        `;
        
        // Add banner to the page
        document.body.appendChild(cookieBanner);
        
        // Add event listeners for buttons
        document.getElementById('cookie-accept').addEventListener('click', function() {
            acceptCookies(true);
        });
        
        document.getElementById('cookie-decline').addEventListener('click', function() {
            acceptCookies(false);
        });
    }
    
    // Function to handle cookie consent
    function acceptCookies(accepted) {
        localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
        
        // If declined, disable analytics
        if (!accepted) {
            // Disable Google Analytics
            window['ga-disable-GTM-MQS3ZX8Q'] = true;
            
            // Disable Facebook Pixel
            if (window.fbq) {
                window.fbq('consent', 'revoke');
            }
        }
        
        // Remove banner
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('cookie-banner-hidden');
            setTimeout(function() {
                banner.remove();
            }, 300);
        }
    }
});