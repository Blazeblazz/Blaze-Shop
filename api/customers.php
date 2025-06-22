<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['phone'])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Phone number required']));
}

$phone = trim($data['phone']);
$name = isset($data['name']) ? trim($data['name']) : '';
$status = isset($data['status']) ? $data['status'] : 'pending';
$products = isset($data['products']) ? json_encode($data['products']) : '[]';

try {
    $pdo = new PDO('sqlite:../data/customers.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT NOT NULL,
        name TEXT,
        status TEXT DEFAULT 'pending',
        products TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    $stmt = $pdo->prepare("INSERT OR REPLACE INTO customers (phone, name, status, products, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)");
    $stmt->execute([$phone, $name, $status, $products]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>