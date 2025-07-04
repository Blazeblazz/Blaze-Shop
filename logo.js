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
        
        // Create sparkle element
        const sparkle = document.createElement('span');
        sparkle.className = 'logo-sparkle';
        sparkle.innerHTML = '✨';
        
        // Create logo text
        const text = document.createElement('span');
        text.className = 'logo-text';
        text.textContent = 'BLAZE';
        
        // Append elements
        link.appendChild(sparkle);
        link.appendChild(text);
        logo.appendChild(link);
    });
});