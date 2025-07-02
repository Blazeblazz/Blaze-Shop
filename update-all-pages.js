// Script to update all HTML files with logo CSS and JS
const fs = require('fs');
const path = require('path');

// Get all HTML files
const htmlFiles = [
    'cart.html',
    'checkout.html',
    'faq.html',
    'index.html',
    'product-detail.html',
    'shipping.html',
    'sizes.html',
    'terms.html'
];

// Process each file
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    // Read file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${file}:`, err);
            return;
        }
        
        // Add logo.css if not present
        if (!data.includes('logo.css')) {
            data = data.replace(
                /<link[^>]*rel="stylesheet"[^>]*>/,
                match => match + '\n    <link rel="stylesheet" href="logo.css">'
            );
        }
        
        // Add logo.js if not present
        if (!data.includes('logo.js')) {
            data = data.replace(
                /<script[^>]*src="[^"]*"[^>]*><\/script>\s*<\/body>/,
                match => '<script src="logo.js"></script>\n    ' + match
            );
        }
        
        // Write updated content
        fs.writeFile(filePath, data, 'utf8', err => {
            if (err) {
                console.error(`Error writing ${file}:`, err);
                return;
            }
            console.log(`Updated ${file}`);
        });
    });
});