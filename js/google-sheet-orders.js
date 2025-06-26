// Google Sheet Orders Integration
function submitOrderToGoogleSheet(order) {
  // Create a simple order object with essential information
  const orderData = {
    name: order.customer.fullname,
    phone: order.customer.phone,
    city: order.customer.city,
    product: order.items.map(item => item.name).join(", "),
    variant: order.items.map(item => item.variant || "Standard").join(", "),
    quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
    total: order.total,
    date: new Date().toISOString(),
    orderNumber: order.orderNumber
  };
  
  // Google Sheet Web App URL - replace with your actual deployed web app URL
  const googleSheetUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";
  
  // Send data to Google Sheet
  fetch(googleSheetUrl, {
    method: "POST",
    mode: "no-cors", // Important for cross-origin requests to Google Scripts
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  })
  .then(() => {
    console.log("Order submitted to Google Sheet");
  })
  .catch(error => {
    console.error("Error submitting to Google Sheet:", error);
  });
}