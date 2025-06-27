// Google Sheet Order Integration using Web App
function sendOrderToSheet(order) {
  try {
    // Create order data object
    const orderData = {
      orderNumber: order.orderNumber,
      date: new Date().toISOString(),
      customerName: order.customer.fullname,
      phone: order.customer.phone,
      city: order.customer.city,
      products: order.items.map(item => ({
        name: item.name,
        variant: item.variant || 'Standard',
        quantity: item.quantity,
        price: item.price
      })),
      total: order.total,
      status: 'New'
    };
    
    // Convert to JSON string
    const jsonData = JSON.stringify(orderData);
    
    // Send data to Google Apps Script Web App
    fetch('https://script.google.com/macros/s/AKfycbxrOx7bCzbLV3Ai9BV-sNDXWNaZf-HKh9dLBPb4fBccaFsKWEr6dLNs9A_Snd1oz0dZ/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: jsonData,
      mode: 'no-cors' // Important for cross-origin requests
    })
    .then(() => console.log('Order sent to Google Sheet'))
    .catch(error => console.error('Error sending order:', error));
    
    return true;
  } catch (error) {
    console.error('Failed to send order to Google Sheet:', error);
    return false;
  }
}