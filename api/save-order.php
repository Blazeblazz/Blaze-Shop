<?php
// api/save-order.php
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

function log_error($msg) {
    $logfile = __DIR__ . '/../data/orders/error.log';
    file_put_contents($logfile, date('Y-m-d H:i:s') . " - " . $msg . "\n", FILE_APPEND);
}

$dir = __DIR__ . '/../data/orders/';
if (!is_dir($dir)) {
    if (!mkdir($dir, 0777, true)) {
        log_error('Failed to create orders directory: ' . $dir);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create orders directory']);
        exit;
    }
}

$filePath = $dir . $orderId . '.json';
if (file_put_contents($filePath, json_encode($order, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
    log_error('Failed to save order file: ' . $filePath);
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save order file']);
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
$message .= "\nVoir le dossier: data/orders/" . $orderId . ".json";

if (!mail($to, $subject, $message)) {
    log_error('Order saved but failed to send email for: ' . $orderId);
    http_response_code(500);
    echo json_encode(['error' => 'Order saved, but failed to send email notification']);
    exit;
}

echo json_encode(['success' => true, 'orderId' => $orderId]);
