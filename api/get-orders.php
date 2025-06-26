<?php
// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if it's a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only GET requests are allowed']);
    exit;
}

// Path to orders directory
$ordersDir = '../data/orders';

// Create data directory if it doesn't exist
$dataDir = '../data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0777, true);
    @chmod($dataDir, 0777);
} else {
    @chmod($dataDir, 0777);
}

// Create orders directory if it doesn't exist
if (!file_exists($ordersDir)) {
    @mkdir($ordersDir, 0777, true);
    @chmod($ordersDir, 0777);
} else {
    @chmod($ordersDir, 0777);
}

// Try alternative paths if the standard path doesn't work
if (!is_dir($ordersDir) || !is_readable($ordersDir)) {
    // Try absolute path
    $rootPath = $_SERVER['DOCUMENT_ROOT'];
    $altOrdersDir = $rootPath . '/data/orders';
    
    if (is_dir($altOrdersDir) && is_readable($altOrdersDir)) {
        $ordersDir = $altOrdersDir;
    }
}

// If directory still doesn't exist or isn't readable, return empty orders
if (!is_dir($ordersDir) || !is_readable($ordersDir)) {
    error_log('Orders directory not accessible: ' . $ordersDir);
    echo json_encode(['orders' => [], 'error' => 'Orders directory not accessible']);
    exit;
}

// Get all JSON files in the orders directory
$files = glob($ordersDir . '/*.json');
$orders = [];

foreach ($files as $file) {
    try {
        $content = file_get_contents($file);
        $orderData = json_decode($content, true);
        if ($orderData) {
            $orders[] = $orderData;
        }
    } catch (Exception $e) {
        // Skip problematic files
        continue;
    }
}

// Sort orders by timestamp (newest first)
usort($orders, function($a, $b) {
    $timeA = isset($a['timestamp']) ? strtotime($a['timestamp']) : 0;
    $timeB = isset($b['timestamp']) ? strtotime($b['timestamp']) : 0;
    return $timeB - $timeA;
});

// Add debug information
$debug = [
    'directory' => $ordersDir,
    'files_found' => count($files),
    'orders_parsed' => count($orders),
    'current_dir' => getcwd(),
    'directory_exists' => file_exists($ordersDir) ? 'yes' : 'no'
];

// Return the orders with debug info
echo json_encode([
    'orders' => $orders,
    'debug' => $debug
]);
?>