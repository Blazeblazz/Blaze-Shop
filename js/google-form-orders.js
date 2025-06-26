// Google Form Orders Integration
function submitOrderToGoogleForm(order) {
  // Create simple order data
  const name = order.customer.fullname;
  const phone = order.customer.phone;
  const city = order.customer.city;
  const product = order.items.map(item => item.name).join(", ");
  const variant = order.items.map(item => item.variant || "Standard").join(", ");
  const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = order.total;
  const orderNumber = order.orderNumber || "BLZ-" + new Date().getTime();
  
  // Replace this URL with your actual Google Form submission URL
  // You can find this by inspecting the form HTML and looking for the "action" attribute
  const googleFormUrl = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
  
  // Replace these with your actual form field names
  // You can find these by inspecting the form HTML and looking for the "name" attributes
  const formData = new FormData();
  formData.append("entry.123456789", name);        // Name field
  formData.append("entry.234567890", phone);       // Phone field
  formData.append("entry.345678901", city);        // City field
  formData.append("entry.456789012", product);     // Product field
  formData.append("entry.567890123", variant);     // Variant field
  formData.append("entry.678901234", quantity);    // Quantity field
  formData.append("entry.789012345", total);       // Total field
  formData.append("entry.890123456", orderNumber); // Order number field
  
  // Create a hidden iframe to submit the form
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  
  // Create a form inside the iframe
  const form = document.createElement("form");
  form.method = "POST";
  form.action = googleFormUrl;
  form.target = "_blank";
  
  // Add form data as hidden inputs
  for (const [key, value] of formData.entries()) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }
  
  // Add the form to the iframe and submit it
  iframe.contentDocument.body.appendChild(form);
  form.submit();
  
  // Remove the iframe after submission
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
  
  console.log("Order submitted to Google Form");
}