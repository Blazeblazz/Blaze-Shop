// Google Apps Script to handle order submissions to Google Sheets
// Copy this code to your Google Apps Script project

// Configuration - update with your actual spreadsheet ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Orders';

// Process incoming requests
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet and get the sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers
      sheet.appendRow([
        'Order Number', 
        'Date', 
        'Name', 
        'Phone', 
        'City', 
        'Product', 
        'Variant', 
        'Quantity', 
        'Total (MAD)',
        'Status'
      ]);
      
      // Format headers
      sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
    }
    
    // Format date for better readability
    const orderDate = new Date(data.date);
    const formattedDate = Utilities.formatDate(orderDate, 'GMT', 'yyyy-MM-dd HH:mm:ss');
    
    // Append the order data
    sheet.appendRow([
      data.orderNumber,
      formattedDate,
      data.name,
      data.phone,
      data.city,
      data.product,
      data.variant,
      data.quantity,
      data.total,
      'New' // Default status
    ]);
    
    // Return success
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Order added to Google Sheet'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    console.error('Error processing order: ' + error.message);
    
    // Return error
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    result: 'success',
    message: 'The Google Apps Script is working correctly'
  })).setMimeType(ContentService.MimeType.JSON);
}