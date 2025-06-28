// IMPORTANT: Replace this URL with your actual Google Apps Script Web App URL from Step 3 in SIMPLE_SETUP.md
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyFLncrJBphTBEQdcYsenUAd4VIfiSCdTesbg1-581w8QLK0Eyq-kIjDJRayPo_ESyf/exec';

const ORDER_STORAGE = {
    async saveOrder(orderData) {
        // 1. Save to localStorage (as a backup)
        this.saveToLocalStorage(orderData);

        // 2. Prepare data for Google Sheet
        const sheetData = {
            orderNumber: orderData.id,
            date: orderData.date,
            customerName: orderData.customer.name,
            phone: orderData.customer.phone,
            city: orderData.customer.city,
            products: orderData.items,
            total: orderData.total,
            status: orderData.status
        };

        // 3. Send data to Google Sheet
        try {
            await fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', // 'no-cors' is used to prevent CORS errors with simple Apps Script deployments
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sheetData)
            });
            console.log('Order submission attempted. Check your Google Sheet.');
        } catch (error) {
            console.error('Failed to send order to Google Sheet:', error);
        }

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