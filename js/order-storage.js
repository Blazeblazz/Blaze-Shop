// Order storage using Google Apps Script
const ORDER_STORAGE = {
    // Replace with your Google Apps Script Web App URL
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxvUlmDASSVU22OomQP4O024HnfehMWALR2C3ZD2N6hRk4_yashr6qQxAIFX29K4RjCIw/exec ',
    
    // Save order to Google Sheets
    async saveOrder(orderData) {
        try {
            const response = await fetch(this.SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'saveOrder',
                    data: orderData
                })
            });
            
            // Fallback to localStorage
            this.saveToLocalStorage(orderData);
            return true;
        } catch (error) {
            console.error('Failed to save to server:', error);
            this.saveToLocalStorage(orderData);
            return true;
        }
    },
    
    // Get all orders
    async getOrders() {
        try {
            const response = await fetch(this.SCRIPT_URL + '?action=getOrders');
            const data = await response.json();
            return data.orders || [];
        } catch (error) {
            console.error('Failed to load from server:', error);
            return this.getFromLocalStorage();
        }
    },
    
    // LocalStorage fallback
    saveToLocalStorage(orderData) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
    },
    
    getFromLocalStorage() {
        return JSON.parse(localStorage.getItem('orders') || '[]');
    }
};

// Google Apps Script code (copy this to Google Apps Script)
const GOOGLE_SCRIPT_CODE = `
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'saveOrder') {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const order = data.data;
      
      // Add headers if first row
      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, 8).setValues([
          ['ID', 'Date', 'Customer Name', 'City', 'Phone', 'Items', 'Total', 'Status']
        ]);
      }
      
      // Add order data
      const itemsText = order.items.map(item => 
        \`\${item.name} (\${item.variant}) x\${item.quantity} - \${item.price * item.quantity} MAD\`
      ).join('; ');
      
      sheet.appendRow([
        order.id,
        new Date(order.date),
        order.customer.name,
        order.customer.city,
        order.customer.phone,
        itemsText,
        order.total + ' MAD',
        order.status
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({success: true}));
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}

function doGet(e) {
  try {
    if (e.parameter.action === 'getOrders') {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        return ContentService.createTextOutput(JSON.stringify({orders: []}));
      }
      
      const orders = data.slice(1).map(row => ({
        id: row[0],
        date: row[1],
        customer: {
          name: row[2],
          city: row[3],
          phone: row[4]
        },
        items: row[5],
        total: row[6],
        status: row[7] || 'pending'
      }));
      
      return ContentService.createTextOutput(JSON.stringify({orders: orders}));
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}
`;