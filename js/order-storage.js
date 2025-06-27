// Simple order storage that works immediately
const ORDER_STORAGE = {
    // Save order (localStorage + email notification)
    async saveOrder(orderData) {
        // Save to localStorage
        this.saveToLocalStorage(orderData);
        
        // Send email notification
        this.sendEmailNotification(orderData);
        
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
    },
    
    // Email notification using mailto
    sendEmailNotification(order) {
        const subject = `Nouvelle commande #${order.id}`;
        const body = `
Nouvelle commande reçue:

Client: ${order.customer.name}
Ville: ${order.customer.city}
Téléphone: ${order.customer.phone}

Produits:
${order.items.map(item => `- ${item.name} (${item.variant}) x${item.quantity} = ${item.price * item.quantity} MAD`).join('\n')}

Total: ${order.total} MAD
Date: ${new Date(order.date).toLocaleString('fr-FR')}
        `;
        
        // Auto-open email client
        const mailtoLink = `mailto:contactusblazz@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Try to open email client silently
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = mailtoLink;
        document.body.appendChild(iframe);
        setTimeout(() => document.body.removeChild(iframe), 1000);
    }
};