// Minimal checkout functionality - no order storage
document.addEventListener('DOMContentLoaded', function() {
    // Get order items from sessionStorage
    const orderItems = JSON.parse(sessionStorage.getItem('directOrder')) || [];
    
    // If no order items, redirect to homepage
    if (orderItems.length === 0) {
        window.location.href = 'index-award.html';
        return;
    }
    
    // Calculate order totals
    let subtotal = 0;
    orderItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // Final total (no discounts)
    const finalTotal = subtotal;
    
    // Display order items in sidebar
    const sidebarItems = document.querySelector('.sidebar-items');
    orderItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'sidebar-item';
        
        // Add variant info if available
        const variantInfo = item.variant ? 
            `<div class="sidebar-item-variant">
                <span>Couleur: </span>
                <span class="variant-badge" style="background-color: ${getColorCode(item.variant)}"></span>
                <span>${item.variant}</span>
             </div>` : '';
        
        itemElement.innerHTML = `
            <div class="sidebar-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="sidebar-item-details">
                <div class="sidebar-item-title">${item.name}</div>
                <div class="sidebar-item-price">${item.price} MAD</div>
                <div class="sidebar-item-quantity">Quantité: ${item.quantity}</div>
                ${variantInfo}
            </div>
        `;
        sidebarItems.appendChild(itemElement);
    });
    
    // Helper function for color codes
    function getColorCode(color) {
        return {White:'#ffffff', Black:'#000000', Beige:'#f5f5dc'}[color] || '#cccccc';
    }
    
    // Update sidebar totals
    document.getElementById('sidebar-subtotal').textContent = `${subtotal} MAD`;
    document.getElementById('sidebar-total').textContent = `${finalTotal} MAD`;
    
    // Step 1: Customer Information Form
    const toStep2Button = document.getElementById('to-step-2');
    
    toStep2Button.addEventListener('click', function() {
        if (validateCustomerInfo()) {
            // Process order directly
            processOrder();
            
            // Skip step 2 and go directly to step 3
            showStep(3);
        }
    });
    
    // Step 2: Order Summary
    const backToStep1Button = document.getElementById('back-to-step-1');
    const toStep3Button = document.getElementById('to-step-3');
    
    backToStep1Button.addEventListener('click', function() {
        showStep(1);
    });
    
    toStep3Button.addEventListener('click', function() {
        // Process order
        processOrder();
        
        // Show step 3
        showStep(3);
    });
    
    // Form validation
    function validateCustomerInfo() {
        const fullname = document.getElementById('fullname').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const city = document.getElementById('city').value.trim();
        
        let isValid = true;
        
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.classList.remove('active');
        });
        
        // Validate fullname
        if (fullname === '') {
            showError('fullname', 'Le nom est requis');
            isValid = false;
        }
        
        // Validate phone
        if (phone === '') {
            showError('phone', 'Le numéro de téléphone est requis');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showError('phone', 'Format de téléphone invalide');
            isValid = false;
        }
        
        // Validate city
        if (city === '') {
            showError('city', 'La ville est requise');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
    
    function isValidPhone(phone) {
        // Simple Moroccan phone validation
        return /^0[5-7][0-9]{8}$/.test(phone);
    }
    
    // Show step function
    function showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.checkout-form').forEach(form => {
            form.classList.remove('active');
        });
        
        // Show selected step
        document.getElementById(`step-${stepNumber}-form`).classList.add('active');
        
        // Update step indicators
        document.querySelectorAll('.step').forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            
            if (stepNum < stepNumber) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    // Process order
    function processOrder() {
        // Generate order number
        const orderNumber = generateOrderNumber();
        
        // Display order number
        document.getElementById('order-number').textContent = orderNumber;
        
        // Create order object
        const order = {
            orderNumber: orderNumber,
            date: new Date().toISOString(),
            customer: {
                fullname: document.getElementById('fullname').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                city: document.getElementById('city').value.trim()
            },
            items: orderItems,
            total: finalTotal
        };
        
        // Send order to Google Sheet if function exists
        if (typeof sendOrderToSheet === 'function') {
            sendOrderToSheet(order);
        }
        
        // Clear direct order
        sessionStorage.removeItem('directOrder');
    }
    
    // Generate order number
    function generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        return `BLZ-${year}${month}${day}-${random}`;
    }
});