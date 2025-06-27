<?php
// SQLite DB connection and helpers
function get_db() {
    if (!extension_loaded('pdo_sqlite')) {
        throw new Exception('PDO_SQLITE extension is not enabled on this server.');
    }
    $dbFile = __DIR__ . '/../data/orders.db';
    $init = !file_exists($dbFile);
    try {
        $db = new PDO('sqlite:' . $dbFile);
    } catch (Exception $e) {
        throw new Exception('Failed to create or open SQLite database: ' . $e->getMessage());
    }
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    if ($init) {
        $db->exec('CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId TEXT,
            timestamp TEXT,
            status TEXT,
            customer_name TEXT,
            customer_city TEXT,
            customer_phone TEXT,
            items TEXT,
            total REAL,
            paymentMethod TEXT,
            source TEXT
        )');
    }
    return $db;
}
function save_order_db($order) {
    $db = get_db();
    $stmt = $db->prepare('INSERT INTO orders (orderId, timestamp, status, customer_name, customer_city, customer_phone, items, total, paymentMethod, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $order['orderId'],
        $order['timestamp'],
        $order['status'],
        $order['customer']['fullname'],
        $order['customer']['city'],
        $order['customer']['phone'],
        json_encode($order['items'], JSON_UNESCAPED_UNICODE),
        $order['total'],
        $order['paymentMethod'],
        $order['source']
    ]);
    return $db->lastInsertId();
}
function get_all_orders_db() {
    $db = get_db();
    $rows = $db->query('SELECT * FROM orders ORDER BY id DESC')->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as &$row) {
        $row['items'] = json_decode($row['items'], true);
    }
    return $rows;
}
