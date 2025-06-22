<?php
// Simple admin panel to view customer data
try {
    $pdo = new PDO('sqlite:../data/customers.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->query("SELECT * FROM customers ORDER BY created_at DESC");
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
} catch (Exception $e) {
    $customers = [];
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Customer Data - BLAZE Admin</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #ff3c00; color: white; }
        .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .pending { background: #fff3cd; color: #856404; }
        .completed { background: #d4edda; color: #155724; }
        .interested { background: #cce5ff; color: #004085; }
        .export { background: #ff3c00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-bottom: 20px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Customer Database - BLAZE</h1>
        <a href="export.php" class="export">Export CSV</a>
        
        <table>
            <tr>
                <th>ID</th>
                <th>Phone</th>
                <th>Name</th>
                <th>Status</th>
                <th>Products</th>
                <th>Created</th>
            </tr>
            <?php foreach ($customers as $customer): ?>
            <tr>
                <td><?= $customer['id'] ?></td>
                <td><?= htmlspecialchars($customer['phone']) ?></td>
                <td><?= htmlspecialchars($customer['name']) ?></td>
                <td><span class="status <?= $customer['status'] ?>"><?= ucfirst($customer['status']) ?></span></td>
                <td><?= htmlspecialchars(substr($customer['products'], 0, 50)) ?>...</td>
                <td><?= date('Y-m-d H:i', strtotime($customer['created_at'])) ?></td>
            </tr>
            <?php endforeach; ?>
        </table>
        
        <?php if (empty($customers)): ?>
        <p>No customer data found.</p>
        <?php endif; ?>
    </div>
</body>
</html>