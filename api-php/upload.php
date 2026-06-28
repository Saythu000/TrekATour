<?php
require_once 'config.php';

// Allow CORS (already in config.php but doesn't hurt)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error', 'debug' => $_FILES]);
    exit;
}

$file = $_FILES['image'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileSize = $file['size'];

// Get file extension
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

// Allowed extensions
$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

if (!in_array($fileExt, $allowed)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, WEBP, GIF allowed']);
    exit;
}

// Check file size (max 10MB)
if ($fileSize > 10 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large. Max 10MB']);
    exit;
}

// Create unique filename
$newFileName = uniqid('upload_', true) . '.' . $fileExt;

// Upload directory (relative to public_html)
// Hostinger usually has public_html as the root for DOCUMENT_ROOT
$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';

// Create directory if it doesn't exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$destination = $uploadDir . $newFileName;

// Move uploaded file
if (move_uploaded_file($fileTmpName, $destination)) {
    // Return the public URL
    // Use relative path for maximum compatibility, or full URL
    $publicUrl = '/uploads/' . $newFileName;
    
    echo json_encode([
        'success' => true,
        'url' => $publicUrl,
        'filename' => $newFileName
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file to ' . $uploadDir]);
}
?>
