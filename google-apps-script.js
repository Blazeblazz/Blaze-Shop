// Google Apps Script to handle order submissions to Google Sheets
// Copy this code to your Google Apps Script project

// Configuration - update with your actual spreadsheet ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Orders';

// Process incoming requests
function doPost(e) {
  try {
    // Parse the incoming data - either from URL parameter or post body
    let data;
    if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error('No data received');
    }
    
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
function doGet(e) {
  // If test parameter is provided, add a test order
  if (e.parameter && e.parameter.test === 'true') {
    const testData = {
      orderNumber: 'TEST-' + new Date().getTime(),
      date: new Date().toISOString(),
      name: 'Test Customer',
      phone: '0612345678',
      city: 'Test City',
      product: 'Test Product',
      variant: 'Test Variant',
      quantity: 1,
      total: 299
    };
    
    // Process the test order
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = spreadsheet.getSheetByName(SHEET_NAME);
      
      if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
        sheet.appendRow([
          'Order Number', 'Date', 'Name', 'Phone', 'City', 
          'Product', 'Variant', 'Quantity', 'Total (MAD)', 'Status'
        ]);
        sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
      }
      
      const formattedDate = Utilities.formatDate(new Date(testData.date), 'GMT', 'yyyy-MM-dd HH:mm:ss');
      
      sheet.appendRow([
        testData.orderNumber,
        formattedDate,
        testData.name,
        testData.phone,
        testData.city,
        testData.product,
        testData.variant,
        testData.quantity,
        testData.total,
        'Test'
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        result: 'success',
        message: 'Test order added successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        result: 'error',
        message: error.message
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Default response
  return ContentService.createTextOutput(JSON.stringify({
    result: 'success',
    message: 'The Google Apps Script is working correctly',
    usage: 'Add ?test=true to test adding an order'
  })).setMimeType(ContentService.MimeType.JSON);
}