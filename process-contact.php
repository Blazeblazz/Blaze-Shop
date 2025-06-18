<?php
// Set headers to prevent caching
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Initialize response array
$response = [
    'success' => false,
    'message' => ''
];

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    // Validate form data
    if (empty($name)) {
        $response['message'] = 'Le nom est requis.';
    } elseif (empty($email)) {
        $response['message'] = 'L\'email est requis.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Veuillez entrer une adresse email valide.';
    } elseif (empty($message)) {
        $response['message'] = 'Le message est requis.';
    } else {
        // All validation passed, process the form
        
        // Store message in a file
        $data = [
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'date' => date('Y-m-d H:i:s'),
            'ip' => $_SERVER['REMOTE_ADDR']
        ];
        
        // Create contacts directory if it doesn't exist
        $contactsDir = __DIR__ . '/contacts';
        if (!is_dir($contactsDir)) {
            mkdir($contactsDir, 0755, true);
        }
        
        // Generate a unique filename
        $filename = $contactsDir . '/contact_' . date('Ymd_His') . '_' . uniqid() . '.json';
        
        // Save the data to a file
        if (file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT))) {
            $response['success'] = true;
            $response['message'] = 'Merci pour votre message! Nous vous répondrons dans les plus brefs délais.';
            
            // Optional: Send email notification
            $to = 'contactusblazz@gmail.com'; // Replace with your email
            $subject = 'Nouveau message de contact - BLAZE';
            $emailBody = "Nom: $name\n";
            $emailBody .= "Email: $email\n\n";
            $emailBody .= "Message:\n$message\n";
            
            $headers = "From: $email";
            
            // Uncomment to enable email sending
            // mail($to, $subject, $emailBody, $headers);
        } else {
            $response['message'] = 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.';
        }
    }
} else {
    $response['message'] = 'Méthode non autorisée.';
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>