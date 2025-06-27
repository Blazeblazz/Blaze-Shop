<?php
header('Content-Type: application/json');
$dir = __DIR__ . '/../data/orders/';
if (!is_dir($dir)) {
    echo json_encode([]);
    exit;
}
$files = array_values(array_filter(scandir($dir), function($f) {
    return preg_match('/\\.json$/', $f);
}));
echo json_encode($files);
