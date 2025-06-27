// Simple Google Apps Script for Order Management
// Copy this code to your Google Apps Script project

function doGet(e) {
  try {
    // Get parameters from the request
    const params = e.parameter;
    
    // Check if we have the required parameters
    if (!params.name || !params.phone || !params.products) {
      return ContentService.createTextOutput('Missing required parameters');
    }
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Orders');
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet('Orders');
      sheet.appendRow([
        'Order Number', 
        'Date', 
        'Customer Name', 
        'Phone', 
        'City', 
        'Products', 
        'Total (MAD)', 
        'Status'
      ]);
      
      // Format header
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    }
    
    // Format the date
    let orderDate = new Date();
    if (params.date) {
      try {
        orderDate = new Date(params.date);
      } catch (e) {
        // Use current date if parsing fails
      }
    }
    const formattedDate = Utilities.formatDate(orderDate, 'GMT', 'yyyy-MM-dd HH:mm:ss');
    
    // Add the order to the sheet
    sheet.appendRow([
      params.orderNumber || ('BLZ-' + new Date().getTime()),
      formattedDate,
      params.name,
      params.phone,
      params.city || '',
      params.products,
      params.total || '0',
      'New'
    ]);
    
    // Return success
    return ContentService.createTextOutput('Order received');
    
  } catch (error) {
    // Log the error
    console.error('Error processing order: ' + error.message);
    
    // Return error message
    return ContentService.createTextOutput('Error: ' + error.message);
  }
}