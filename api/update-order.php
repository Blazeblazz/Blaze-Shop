<?php
// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only POST requests are allowed']);
    exit;
}

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate the data
if (!$data || !isset($data['orderId']) || !isset($data['status'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid update data']);
    exit;
}

$orderId = $data['orderId'];
$status = $data['status'];

// Path to the order file
$orderFile = '../data/orders/' . $orderId . '.json';

// Check if the order exists
if (!file_exists($orderFile)) {
    http_response_code(404); // Not Found
    echo json_encode(['error' => 'Order not found']);
    exit;
}

// Read the order data
$orderData = json_decode(file_get_contents($orderFile), true);

// Update the status
$orderData['status'] = $status;
$orderData['lastUpdated'] = date('Y-m-d H:i:s');

// Save the updated order
if (file_put_contents($orderFile, json_encode($orderData, JSON_PRETTY_PRINT))) {
    // Success
    echo json_encode([
        'success' => true,
        'message' => 'Order status updated successfully'
    ]);
} else {
    // Error
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Failed to update order']);
}
?>