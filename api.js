// API functions for handling orders
const API_URL = "https://api.jsonbin.io/v3/b";
const API_KEY = "$2a$10$W7Y1w05rI7FhqCSUCB/tRuDJYO2fRlTwgv2s3je3OlExS3oOz9UzG"; // Replace with your actual API key from JSONBin.io
const BIN_ID = "686583bb8561e97a50306adf"; // Your JSONBin.io bin ID

// Function to save order to JSONBin.io
async function saveOrderToServer(order) {
    try {
        // Check if bin ID is configured
        if (!BIN_ID) {
            console.warn('Bin ID not configured, falling back to localStorage');
            saveOrderToLocalStorage(order);
            return false;
        }
        
        // First, get existing data
        const data = await getOrdersFromServer();
        
        // Add new order to the list
        data.orders.push(order);
        
        // Save updated orders list
        const response = await fetch(`${API_URL}/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save order');
        }
        
        return true;
    } catch (error) {
        console.error('Error saving order:', error);
        // Fall back to localStorage if server fails
        saveOrderToLocalStorage(order);
        return false;
    }
}

// Function to get orders from JSONBin.io
async function getOrdersFromServer() {
    try {
        // Check if bin ID is configured
        if (!BIN_ID) {
            console.warn('Bin ID not configured, falling back to localStorage');
            return {orders: JSON.parse(localStorage.getItem('orders')) || []};
        }
        
        const response = await fetch(`${API_URL}/${BIN_ID}`, {
            headers: {
                'X-Master-Key': API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        
        const result = await response.json();
        const data = result.record || {orders: []};
        
        // Ensure the data structure is correct
        if (!data.orders) {
            data.orders = [];
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        // Fall back to localStorage if server fails
        return JSON.parse(localStorage.getItem('orders')) || [];
    }
}

// Function to save order to localStorage (fallback)
function saveOrderToLocalStorage(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}