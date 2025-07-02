// Logo updater script
document.addEventListener('DOMContentLoaded', function() {
    // Find all logo elements
    const logoElements = document.querySelectorAll('.logo');
    
    // Update each logo
    logoElements.forEach(logo => {
        // Clear existing content
        logo.innerHTML = '';
        
        // Create link to homepage
        const link = document.createElement('a');
        link.href = 'index.html';
        
        // Create logo image
        const img = document.createElement('img');
        img.src = 'images/logo.svg';
        img.alt = 'BLAZE';
        img.className = 'logo-image';
        
        // Append elements
        link.appendChild(img);
        logo.appendChild(link);
    });
});