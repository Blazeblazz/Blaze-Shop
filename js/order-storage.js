// IMPORTANT: Replace this URL with your actual Google Apps Script Web App URL from Step 3 in SIMPLE_SETUP.md
const ORDER_STORAGE = {
    saveOrder(orderData) {
        // All Google Sheet functionality has been removed as requested.
        // Orders will be saved to local storage as a backup.
        console.log('Sheet integration disabled. Saving order to local storage only.');
        this.saveToLocalStorage(orderData);
        return true;
    },

    // Get all orders from localStorage
    async getOrders() {
        return this.getFromLocalStorage();
    },

    // LocalStorage storage
    saveToLocalStorage(orderData) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
    },

    getFromLocalStorage() {
        return JSON.parse(localStorage.getItem('orders') || '[]');
    }
};