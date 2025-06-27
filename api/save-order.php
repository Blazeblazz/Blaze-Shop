<?php
require_once __DIR__ . '/orders-db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST requests are allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['customer']) || !isset($data['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid order data']);
    exit;
}

$orderId = 'BLZ-' . date('YmdHis') . '-' . rand(100,999);
$order = [
    'orderId' => $orderId,
    'timestamp' => date('Y-m-d H:i:s'),
    'status' => 'pending',
    'customer' => $data['customer'],
    'items' => $data['items'],
    'total' => $data['total'],
    'paymentMethod' => 'cod',
    'source' => 'website',
];

try {
    save_order_db($order);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save order in database: ' . $e->getMessage()]);
    exit;
}

// Email notification
$to = 'contactusblazz@gmail.com'; // CHANGE THIS TO YOUR EMAIL
$subject = 'Nouvelle commande reçue: ' . $orderId;
$message = "Nouvelle commande reçue :\n\n" .
    "Nom: " . $order['customer']['fullname'] . "\n" .
    "Ville: " . $order['customer']['city'] . "\n" .
    "Téléphone: " . $order['customer']['phone'] . "\n" .
    "Total: " . $order['total'] . " MAD\n" .
    "\nProduits:\n";
foreach ($order['items'] as $item) {
    $message .= "- " . $item['name'] .
        (isset($item['variant']) ? " (" . $item['variant'] . ")" : "") .
        " x" . $item['quantity'] . " - " . $item['price'] . " MAD\n";
}
$message .= "\nVoir la commande dans l'admin.";

@mail($to, $subject, $message);

echo json_encode(['success' => true, 'orderId' => $orderId]);
