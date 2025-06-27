// Google Apps Script for Order Management
// Copy this code to your Google Apps Script project

// Spreadsheet ID - replace with your actual spreadsheet ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const ORDERS_SHEET_NAME = 'Orders';
const PRODUCTS_SHEET_NAME = 'Products';

// Web app entry points
function doGet() {
  return ContentService.createTextOutput('BLAZE Order Management System is running');
}

function doPost(e) {
  try {
    // Get the data from the request
    const postData = e.postData.contents;
    const orderData = JSON.parse(postData);
    
    // Process the order
    const result = processOrder(orderData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Order processed successfully',
      orderNumber: orderData.orderNumber
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    console.error('Error processing order: ' + error.message);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Process the order and add it to the spreadsheet
function processOrder(orderData) {
  // Open the spreadsheet
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Get or create the Orders sheet
  let ordersSheet = spreadsheet.getSheetByName(ORDERS_SHEET_NAME);
  if (!ordersSheet) {
    ordersSheet = createOrdersSheet(spreadsheet);
  }
  
  // Get or create the Products sheet
  let productsSheet = spreadsheet.getSheetByName(PRODUCTS_SHEET_NAME);
  if (!productsSheet) {
    productsSheet = createProductsSheet(spreadsheet);
  }
  
  // Format the date
  const orderDate = new Date(orderData.date);
  const formattedDate = Utilities.formatDate(orderDate, 'GMT', 'yyyy-MM-dd HH:mm:ss');
  
  // Format the products as a string for the main order
  const productsText = orderData.products.map(product => 
    `${product.name} (${product.variant}) x${product.quantity} - ${product.price} MAD`
  ).join(' | ');
  
  // Add the order to the Orders sheet
  ordersSheet.appendRow([
    orderData.orderNumber,
    formattedDate,
    orderData.customerName,
    orderData.phone,
    orderData.city,
    productsText,
    orderData.total,
    orderData.status || 'New',
    'Pending', // Payment status
    '' // Notes
  ]);
  
  // Add each product to the Products sheet
  orderData.products.forEach(product => {
    productsSheet.appendRow([
      orderData.orderNumber,
      formattedDate,
      product.name,
      product.variant,
      product.quantity,
      product.price,
      product.quantity * product.price
    ]);
  });
  
  // Format the sheets
  formatSheets(spreadsheet);
  
  return true;
}

// Create the Orders sheet with headers
function createOrdersSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet(ORDERS_SHEET_NAME);
  
  // Add headers
  sheet.appendRow([
    'Order Number',
    'Date',
    'Customer Name',
    'Phone',
    'City',
    'Products',
    'Total (MAD)',
    'Status',
    'Payment',
    'Notes'
  ]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, 10);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f3f3');
  
  return sheet;
}

// Create the Products sheet with headers
function createProductsSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet(PRODUCTS_SHEET_NAME);
  
  // Add headers
  sheet.appendRow([
    'Order Number',
    'Date',
    'Product Name',
    'Variant',
    'Quantity',
    'Unit Price (MAD)',
    'Subtotal (MAD)'
  ]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, 7);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f3f3');
  
  return sheet;
}

// Format the sheets for better readability
function formatSheets(spreadsheet) {
  // Format Orders sheet
  const ordersSheet = spreadsheet.getSheetByName(ORDERS_SHEET_NAME);
  if (ordersSheet) {
    // Freeze header row
    ordersSheet.setFrozenRows(1);
    
    // Auto-resize columns
    ordersSheet.autoResizeColumns(1, 10);
    
    // Add filters
    ordersSheet.getRange(1, 1, 1, 10).createFilter();
  }
  
  // Format Products sheet
  const productsSheet = spreadsheet.getSheetByName(PRODUCTS_SHEET_NAME);
  if (productsSheet) {
    // Freeze header row
    productsSheet.setFrozenRows(1);
    
    // Auto-resize columns
    productsSheet.autoResizeColumns(1, 7);
    
    // Add filters
    productsSheet.getRange(1, 1, 1, 7).createFilter();
  }
}