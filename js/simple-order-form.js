// Simple order submission to Google Form
function submitOrderToGoogleSheet(order) {
  // Create a hidden form
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSdQQXnVTxZTLLt7UHdMZBGXww_UVAygZ9q-OVBHNGFXcRQPrA/formResponse';
  form.target = '_blank';
  form.style.display = 'none';
  
  // Add customer name
  addField(form, 'entry.1166974658', order.customer.fullname);
  
  // Add phone number
  addField(form, 'entry.1718486731', order.customer.phone);
  
  // Add city
  addField(form, 'entry.1373276665', order.customer.city);
  
  // Add product info
  addField(form, 'entry.1373276665', getProductInfo(order));
  
  // Submit the form
  document.body.appendChild(form);
  form.submit();
  setTimeout(() => document.body.removeChild(form), 1000);
  
  // Helper function to add a field to the form
  function addField(form, name, value) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  
  // Helper function to format product info
  function getProductInfo(order) {
    return order.items.map(item => 
      `${item.name} (${item.variant || 'Standard'}) x${item.quantity} - ${item.price} MAD`
    ).join(' | ');
  }
}