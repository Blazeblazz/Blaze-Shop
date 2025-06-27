<?php
require_once __DIR__ . '/orders-db.php';
header('Content-Type: application/json');
echo json_encode(get_all_orders_db());
