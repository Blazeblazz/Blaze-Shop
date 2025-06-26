// Stored orders data
var storedOrders = {
  orders: []
};

// Function to add a new order
function addOrder(order) {
  // Extract only the required information
  const simpleOrder = {
    name: order.customer.fullname,
    phone: order.customer.phone,
    city: order.customer.city,
    items: order.items.map(item => ({
      name: item.name,
      variant: item.variant || 'Standard',
      quantity: item.quantity
    })),
    date: order.timestamp || new Date().toISOString(),
    orderId: order.orderId || order.orderNumber
  };
  
  // Add to stored orders
  storedOrders.orders.push(simpleOrder);
  
  // Save to localStorage as backup
  try {
    localStorage.setItem('storedOrders', JSON.stringify(storedOrders));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
  
  console.log('Order added to stored-orders.js:', simpleOrder);
  return simpleOrder;
}