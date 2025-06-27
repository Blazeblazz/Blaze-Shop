// Google Apps Script that handles both GET and POST requests
// Copy this code to your Google Apps Script project

// Spreadsheet ID - replace with your actual spreadsheet ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Orders';

// Web app entry points
function doGet(e) {
  try {
    // Get parameters from the URL
    const params = e.parameter;
    
    // Check if we have the required parameters
    if (!params.name || !params.phone) {
      return ContentService.createTextOutput('Missing required parameters');
    }
    
    // Process the order from URL parameters
    const orderData = {
      orderNumber: params.orderNumber || ('BLZ-' + new Date().getTime()),
      date: params.date || new Date().toISOString(),
      name: params.name,
      phone: params.phone,
      city: params.city || '',
      products: params.products || '',
      total: params.total || '0'
    };
    
    // Add to spreadsheet
    addOrderToSheet(orderData);
    
    // Return success
    return ContentService.createTextOutput('Order received via GET');
    
  } catch (error) {
    // Log the error
    console.error('Error processing GET order: ' + error.message);
    
    // Return error message
    return ContentService.createTextOutput('Error: ' + error.message);
  }
}

function doPost(e) {
  try {
    let orderData;
    
    // Try to parse JSON from the request body
    try {
      const postData = e.postData.contents;
      orderData = JSON.parse(postData);
    } catch (parseError) {
      // If JSON parsing fails, try to use URL parameters
      const params = e.parameter;
      
      if (!params.name && !params.phone) {
        return ContentService.createTextOutput('Invalid request format');
      }
      
      orderData = {
        orderNumber: params.orderNumber || ('BLZ-' + new Date().getTime()),
        date: params.date || new Date().toISOString(),
        name: params.name,
        phone: params.phone,
        city: params.city || '',
        products: params.products || '',
        total: params.total || '0'
      };
    }
    
    // Add to spreadsheet
    addOrderToSheet(orderData);
    
    // Return success
    return ContentService.createTextOutput('Order received via POST');
    
  } catch (error) {
    // Log the error
    console.error('Error processing POST order: ' + error.message);
    
    // Return error message
    return ContentService.createTextOutput('Error: ' + error.message);
  }
}

// Add the order to the spreadsheet
function addOrderToSheet(orderData) {
  // Open the spreadsheet
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Get or create the sheet
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    
    // Add headers
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
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f3f3f3');
    
    // Freeze header row
    sheet.setFrozenRows(1);
  }
  
  // Format the date
  let orderDate;
  try {
    orderDate = new Date(orderData.date);
  } catch (e) {
    orderDate = new Date();
  }
  const formattedDate = Utilities.formatDate(orderDate, 'GMT', 'yyyy-MM-dd HH:mm:ss');
  
  // Add the order to the sheet
  sheet.appendRow([
    orderData.orderNumber,
    formattedDate,
    orderData.name,
    orderData.phone,
    orderData.city,
    orderData.products,
    orderData.total,
    'New'
  ]);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, 8);
  
  return true;
}