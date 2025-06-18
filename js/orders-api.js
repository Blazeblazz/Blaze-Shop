// Simple orders API for handling orders across devices
const OrdersAPI = {
    // Save an order
    saveOrder: function(order) {
        try {
            // Add mobile flag
            order.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // Get existing orders
            const orders = this.getOrders();
            
            // Add new order
            orders.push(order);
            
            // Save to localStorage
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Also save to global storage
            this.saveToGlobalStorage(order);
            
            return true;
        } catch (error) {
            console.error('Error saving order:', error);
            return this.saveToGlobalStorage(order);
        }
    },
    
    // Get all orders
    getOrders: function() {
        try {
            // Get from localStorage
            const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
            
            // Get from global storage
            const globalOrders = this.getFromGlobalStorage();
            
            // Merge orders, avoiding duplicates
            const allOrders = [...localOrders];
            
            globalOrders.forEach(order => {
                if (!allOrders.some(o => o.orderNumber === order.orderNumber)) {
                    allOrders.push(order);
                }
            });
            
            return allOrders;
        } catch (error) {
            console.error('Error getting orders:', error);
            return this.getFromGlobalStorage();
        }
    },
    
    // Update order status
    updateOrderStatus: function(orderNumber, newStatus) {
        try {
            // Get orders
            const orders = this.getOrders();
            
            // Find and update order
            const order = orders.find(o => o.orderNumber === orderNumber);
            if (order) {
                order.status = newStatus;
                
                // Save back to localStorage
                localStorage.setItem('orders', JSON.stringify(orders));
                
                // Update in global storage
                this.updateInGlobalStorage(orderNumber, newStatus);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating order status:', error);
            return this.updateInGlobalStorage(orderNumber, newStatus);
        }
    },
    
    // Save to global storage (shared between devices)
    saveToGlobalStorage: function(order) {
        try {
            // Use a global key that's accessible from any page
            const key = 'blaze_global_orders';
            
            // Get existing global orders
            let globalOrders = [];
            try {
                const stored = localStorage.getItem(key);
                if (stored) {
                    globalOrders = JSON.parse(stored);
                }
            } catch (e) {
                globalOrders = [];
            }
            
            // Add new order if not already present
            if (!globalOrders.some(o => o.orderNumber === order.orderNumber)) {
                globalOrders.push(order);
            }
            
            // Save back to global storage
            localStorage.setItem(key, JSON.stringify(globalOrders));
            
            // Also try sessionStorage as backup
            try {
                sessionStorage.setItem(key, JSON.stringify(globalOrders));
            } catch (e) {
                console.warn('Could not save to sessionStorage');
            }
            
            return true;
        } catch (error) {
            console.error('Error saving to global storage:', error);
            return false;
        }
    },
    
    // Get from global storage
    getFromGlobalStorage: function() {
        try {
            // Use a global key that's accessible from any page
            const key = 'blaze_global_orders';
            
            // Try localStorage first
            let stored = localStorage.getItem(key);
            if (!stored) {
                // Try sessionStorage as backup
                stored = sessionStorage.getItem(key);
            }
            
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error getting from global storage:', error);
            return [];
        }
    },
    
    // Update order in global storage
    updateInGlobalStorage: function(orderNumber, newStatus) {
        try {
            // Use a global key that's accessible from any page
            const key = 'blaze_global_orders';
            
            // Get existing global orders
            let globalOrders = this.getFromGlobalStorage();
            
            // Find and update order
            const orderIndex = globalOrders.findIndex(o => o.orderNumber === orderNumber);
            if (orderIndex !== -1) {
                globalOrders[orderIndex].status = newStatus;
                
                // Save back to global storage
                localStorage.setItem(key, JSON.stringify(globalOrders));
                
                // Also try sessionStorage as backup
                try {
                    sessionStorage.setItem(key, JSON.stringify(globalOrders));
                } catch (e) {
                    console.warn('Could not save to sessionStorage');
                }
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating in global storage:', error);
            return false;
        }
    }
};

// Make available globally
window.OrdersAPI = OrdersAPI;