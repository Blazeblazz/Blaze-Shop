// Customer data tracking for retargeting
function trackCustomer(phone, name = '', status = 'pending', products = []) {
    const customerData = {
        phone: phone,
        name: name,
        status: status,
        products: products,
        timestamp: new Date().toISOString()
    };
    
    // Send to backend
    fetch('api/customers.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Customer tracked:', data.id);
        }
    })
    .catch(error => {
        console.error('Tracking error:', error);
    });
}

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    // Track checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            const phone = document.getElementById('phone')?.value;
            const name = document.getElementById('name')?.value;
            const products = JSON.parse(sessionStorage.getItem('directOrder') || '[]');
            
            if (phone) {
                trackCustomer(phone, name, 'pending', products);
            }
        });
    }
    
    // Track product detail page visits
    const orderButton = document.getElementById('order-now');
    if (orderButton) {
        orderButton.addEventListener('click', function() {
            // Track interest before redirect
            const productId = new URLSearchParams(window.location.search).get('id');
            if (productId) {
                trackCustomer('', '', 'interested', [{ id: productId }]);
            }
        });
    }
});

// Export for use in other scripts
window.trackCustomer = trackCustomer;