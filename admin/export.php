<?php
// Export customer data as CSV
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="customers_' . date('Y-m-d') . '.csv"');

try {
    $pdo = new PDO('sqlite:../data/customers.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->query("SELECT phone, name, status, products, created_at FROM customers ORDER BY created_at DESC");
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $output = fopen('php://output', 'w');
    
    // CSV headers
    fputcsv($output, ['Phone', 'Name', 'Status', 'Products', 'Date']);
    
    // CSV data
    foreach ($customers as $customer) {
        fputcsv($output, [
            $customer['phone'],
            $customer['name'],
            $customer['status'],
            $customer['products'],
            $customer['created_at']
        ]);
    }
    
    fclose($output);
    
} catch (Exception $e) {
    echo "Error exporting data";
}
?>