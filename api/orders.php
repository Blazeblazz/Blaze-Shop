<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$ordersFile = '../data/orders.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save order
    $input = json_decode(file_get_contents('php://input'), true);
    
    $orders = [];
    if (file_exists($ordersFile)) {
        $orders = json_decode(file_get_contents($ordersFile), true) ?: [];
    }
    
    $orders[] = $input;
    file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT));
    
    echo json_encode(['success' => true]);
} else {
    // Get orders
    if (file_exists($ordersFile)) {
        echo file_get_contents($ordersFile);
    } else {
        echo '[]';
    }
}
?>