// Orders API for handling orders with server-side storage
const OrdersAPI = {
    // Save an order
    saveOrder: function(order) {
        try {
            // Add mobile flag
            order.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            order.deviceType = order.isMobile ? 'mobile' : 'desktop';
            
            // Save to local storage as backup
            this.saveToLocalStorage(order);
            
            // Get the correct API URL
            const apiUrl = window.location.href.includes('/admin/') ? '../api/save-order.php' : 'api/save-order.php';
            console.log('Saving order to:', apiUrl);
            
            // Save to server
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            })
            .then(response => {
                console.log('Order save response status:', response.status);
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Order saved to server:', data.orderId);
                    // Update the order number in the UI
                    if (document.getElementById('order-number')) {
                        document.getElementById('order-number').textContent = data.orderId;
                    }
                } else {
                    console.error('Error saving order to server:', data.error);
                }
            })
            .catch(error => {
                console.error('Error saving order to server:', error);
            });
            
            return true;
        } catch (error) {
            console.error('Error saving order:', error);
            return false;
        }
    },
    
    // Get all orders
    getOrders: function() {
        return new Promise((resolve, reject) => {
            // Get the correct API URL
            const apiUrl = window.location.href.includes('/admin/') ? '../api/get-orders.php' : 'api/get-orders.php';
            
            // Try to get from server first
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Log debug info if available
                    if (data.debug) {
                        console.log('Orders API Debug:', data.debug);
                    }
                    
                    if (data.orders) {
                        // Save to local storage as backup
                        localStorage.setItem('orders', JSON.stringify(data.orders));
                        resolve(data.orders);
                    } else {
                        // Fallback to local storage
                        const localOrders = this.getFromLocalStorage();
                        resolve(localOrders);
                    }
                })
                .catch(error => {
                    console.error('Error getting orders from server:', error);
                    // Fallback to local storage
                    const localOrders = this.getFromLocalStorage();
                    resolve(localOrders);
                });
        });
    },
    
    // Update order status
    updateOrderStatus: function(orderId, newStatus) {
        return new Promise((resolve, reject) => {
            // Get the correct API URL
            const apiUrl = window.location.href.includes('/admin/') ? '../api/update-order.php' : 'api/update-order.php';
            
            // Update on server
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: orderId,
                    status: newStatus
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Order status updated on server');
                    resolve(true);
                } else {
                    console.error('Error updating order status on server:', data.error);
                    resolve(false);
                }
            })
            .catch(error => {
                console.error('Error updating order status on server:', error);
                resolve(false);
            });
        });
    },
    
    // Save to local storage (backup)
    saveToLocalStorage: function(order) {
        try {
            // Get existing orders
            const orders = this.getFromLocalStorage();
            
            // Add new order
            orders.push(order);
            
            // Save to localStorage
            localStorage.setItem('orders', JSON.stringify(orders));
            
            return true;
        } catch (error) {
            console.error('Error saving to local storage:', error);
            return false;
        }
    },
    
    // Get from local storage
    getFromLocalStorage: function() {
        try {
            return JSON.parse(localStorage.getItem('orders')) || [];
        } catch (error) {
            console.error('Error getting from local storage:', error);
            return [];
        }
    }
};

// Make available globally
window.OrdersAPI = OrdersAPI;