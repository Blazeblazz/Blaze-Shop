// Logo updater script
document.addEventListener('DOMContentLoaded', function() {
    // Find all logo elements
    const logoElements = document.querySelectorAll('.logo');
    
    // Update each logo
    logoElements.forEach(logo => {
        // Check if logo already has content
        if (logo.querySelector('a') && !logo.querySelector('img')) {
            // Keep the existing content but ensure it's consistent
            const link = logo.querySelector('a');
            if (!link.getAttribute('href')) {
                link.setAttribute('href', 'index.html');
            }
        } else {
            // Clear existing content
            logo.innerHTML = '';
            
            // Create link to homepage
            const link = document.createElement('a');
            link.href = 'index.html';
            
            // Create logo content
            const icon = document.createElement('i');
            icon.className = 'fas fa-fire';
            
            const text = document.createElement('span');
            text.textContent = 'BLAZE';
            
            // Append elements
            link.appendChild(icon);
            link.appendChild(text);
            logo.appendChild(link);
        }
    });
});