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
  const googleSheetUrl = "https://script.google.com/macros/s/AKfycbyWxvevCiViGanBKaj8zG8r65ikPy75kxVhUifz1AE4kzwKK9iSmFEkVsIHzvNNeEa2-Q/exec";
  
  // Send data to Google Sheet
  fetch(googleSheetUrl + "?data=" + encodeURIComponent(JSON.stringify(orderData)), {
    method: "POST",
    mode: "no-cors" // Important for cross-origin requests to Google Scripts
  })
  .then(() => {
    console.log("Order submitted to Google Sheet");
  })
  .catch(error => {
    console.error("Error submitting to Google Sheet:", error);
  });
}