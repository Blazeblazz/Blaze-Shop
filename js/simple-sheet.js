// Simple Google Sheet Order Integration
function sendOrderToSheet(order) {
  try {
    // Create URL with order data as parameters (update with your new Google Apps Script URL)
    let url = 'https://script.google.com/macros/s/AKfycbwjHXdTGQHO11bY9VcIsHWCpSBHqNMcaaHlCQoymUAP54I4ziaVzj1j18yWKcnaaY00mQ/exec';

    // For each product in the order, send a separate row (Name, City, Phone, Product Name, Variant, Quantity, Price, OrderNumber, Date)
    order.items.forEach(item => {
      let rowUrl = url;
      rowUrl += '?name=' + encodeURIComponent(order.customer.fullname);
      rowUrl += '&city=' + encodeURIComponent(order.customer.city);
      rowUrl += '&phone=' + encodeURIComponent(order.customer.phone);
      rowUrl += '&product=' + encodeURIComponent(item.name);
      rowUrl += '&variant=' + encodeURIComponent(item.variant || 'Standard');
      rowUrl += '&quantity=' + encodeURIComponent(item.quantity);
      rowUrl += '&price=' + encodeURIComponent(item.price);
      rowUrl += '&orderNumber=' + encodeURIComponent(order.orderNumber);
      rowUrl += '&date=' + encodeURIComponent(new Date().toISOString());
      // Send as image request (silent)
      const img = document.createElement('img');
      img.style.display = 'none';
      img.src = rowUrl;
      document.body.appendChild(img);
      setTimeout(() => {
        if (img.parentNode) document.body.removeChild(img);
      }, 5000);
    });
    console.log('Order sent to Google Sheet (one row per product)');
    return true;
  } catch (error) {
    console.error('Failed to send order to Google Sheet:', error);
    return false;
  }
}

function sendOrderToBackend(order) {
  return fetch('api/save-order.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  .then(res => res.json())
  .catch(() => ({ success: false }));
}