// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get order items from sessionStorage instead of cart
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
    const customerInfoForm = document.getElementById('customer-info-form');
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
    
    // Populate order summary
    function populateOrderSummary() {
        // Display order items
        const orderItemsContainer = document.querySelector('.order-items');
        orderItemsContainer.innerHTML = '';
        
        orderItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            
            // Add variant info if available
            const variantInfo = item.variant ? 
                `<div class="order-item-variant">
                    <span>Couleur: </span>
                    <span class="variant-badge" style="background-color: ${getColorCode(item.variant)}"></span>
                    <span>${item.variant}</span>
                 </div>` : '';
            
            itemElement.innerHTML = `
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <div class="order-item-title">${item.name}</div>
                    <div class="order-item-price">${item.price} MAD</div>
                    <div class="order-item-quantity">Quantité: ${item.quantity}</div>
                    ${variantInfo}
                </div>
            `;
            orderItemsContainer.appendChild(itemElement);
        });
        
        // Update order totals
        document.getElementById('subtotal-amount').textContent = `${subtotal} MAD`;
        document.getElementById('total-amount').textContent = `${finalTotal} MAD`;
        
        // Display customer info summary
        const customerInfoSummary = document.getElementById('summary-customer-info');
        customerInfoSummary.innerHTML = '';
        
        const fullname = document.getElementById('fullname').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const city = document.getElementById('city').value.trim();
        
        const infoItems = [
            { label: 'Nom', value: fullname },
            { label: 'Téléphone', value: phone },
            { label: 'Ville', value: city }
        ];
        
        infoItems.forEach(item => {
            const infoElement = document.createElement('div');
            infoElement.className = 'customer-info-item';
            infoElement.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
            customerInfoSummary.appendChild(infoElement);
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
            subtotal: subtotal,
            shipping: 0,
            total: finalTotal,
            paymentMethod: 'cod',
            status: 'pending',
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        };
        
        // Add device type explicitly
        order.deviceType = order.isMobile ? 'mobile' : 'desktop';
        
        console.log('Processing order:', order);
        
        // Always save to localStorage first
        saveOrderToLocalStorage(order);
        
        // Save to stored-orders.js if available
        if (window.addOrder) {
            window.addOrder(order);
        }
        
        // Direct approach to store order in test file
        try {
            // Create a simple order object with just the essential info
            const simpleOrder = {
                name: order.customer.fullname,
                phone: order.customer.phone,
                city: order.customer.city,
                product: order.items[0].name,
                variant: order.items[0].variant || 'Standard',
                date: new Date().toISOString()
            };
            
            // Send directly to a simple PHP script
            fetch('store-order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(simpleOrder)
            })
            .then(response => {
                console.log('Order storage response:', response.status);
            })
            .catch(error => {
                console.error('Error storing order:', error);
            });
            
            // Also try the regular API paths as fallback
            submitOrderToPath('api/save-order.php', order)
                .catch(error => submitOrderToPath('/api/save-order.php', order))
                .catch(error => submitOrderToPath('/save-order.php', order))
                .catch(error => console.error('API submission failed:', error));
        } catch (error) {
            console.error('Error in order process:', error);
        }
        
        // Helper function to submit order to different paths
        function submitOrderToPath(path, orderData) {
            return fetch(path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
            .then(response => {
                console.log(`Order save response from ${path}:`, response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Order saved successfully:', data.orderId);
                    return data;
                } else {
                    console.error('Error in server response:', data.error);
                    throw new Error(data.error || 'Unknown server error');
                }
            });
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
    
    // Fallback: Save order to localStorage
    function saveOrderToLocalStorage(order) {
        try {
            // Get existing orders
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            
            // Add new order
            orders.push(order);
            
            // Save to localStorage
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Also save to sessionStorage (more reliable on mobile)
            sessionStorage.setItem('orders', JSON.stringify(orders));
            
            console.log('Order saved to localStorage');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            
            // Try sessionStorage only
            try {
                const sessionOrders = JSON.parse(sessionStorage.getItem('orders')) || [];
                sessionOrders.push(order);
                sessionStorage.setItem('orders', JSON.stringify(sessionOrders));
                console.log('Order saved to sessionStorage');
            } catch (e) {
                console.error('Error saving to sessionStorage:', e);
            }
        }
    }
});