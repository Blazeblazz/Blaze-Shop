// Direct Google Sheet Order Integration
function sendOrderToSheet(order) {
  try {
    // Log the order to console for debugging
    console.log('Sending order to sheet:', order);
    
    // Create a direct fetch request to the Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbz2M9s2-QrDQZWmhLydX3ITUEYYkfSiRBMGIZJUgM4QrSOS4u9s9xXPP3p9OgFtdUGAfQ/exec', {
      method: 'POST',
      mode: 'no-cors', // Important for cross-origin requests
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderNumber: order.orderNumber,
        date: new Date().toISOString(),
        name: order.customer.fullname,
        phone: order.customer.phone,
        city: order.customer.city,
        products: order.items.map(item => 
          `${item.name} (${item.variant || 'Standard'}) x${item.quantity} - ${item.price} MAD`
        ).join(' | '),
        total: order.total
      })
    })
    .then(() => {
      console.log('Order sent successfully');
      
      // Also try the image approach as backup
      sendViaImage(order);
    })
    .catch(error => {
      console.error('Error sending order via fetch:', error);
      
      // Try the image approach as fallback
      sendViaImage(order);
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send order to Google Sheet:', error);
    
    // Try the image approach as fallback
    sendViaImage(order);
    return false;
  }
}

// Fallback method using image
function sendViaImage(order) {
  try {
    // Create URL with order data as parameters
    let url = 'https://script.google.com/macros/s/AKfycbz2M9s2-QrDQZWmhLydX3ITUEYYkfSiRBMGIZJUgM4QrSOS4u9s9xXPP3p9OgFtdUGAfQ/exec';
    
    // Add order data as URL parameters
    url += '?orderNumber=' + encodeURIComponent(order.orderNumber);
    url += '&date=' + encodeURIComponent(new Date().toISOString());
    url += '&name=' + encodeURIComponent(order.customer.fullname);
    url += '&phone=' + encodeURIComponent(order.customer.phone);
    url += '&city=' + encodeURIComponent(order.customer.city);
    
    // Add product info
    const productInfo = order.items.map(item => 
      `${item.name} (${item.variant || 'Standard'}) x${item.quantity} - ${item.price} MAD`
    ).join(' | ');
    url += '&products=' + encodeURIComponent(productInfo);
    
    // Add total
    url += '&total=' + encodeURIComponent(order.total);
    
    // Create image for silent submission
    const img = document.createElement('img');
    img.style.display = 'none';
    img.src = url;
    document.body.appendChild(img);
    
    // Remove the image after a delay
    setTimeout(() => {
      if (img.parentNode) {
        document.body.removeChild(img);
      }
    }, 5000);
    
    console.log('Order sent via image method');
  } catch (error) {
    console.error('Failed to send order via image:', error);
  }
}