<?php
require_once 'config.php';

$pdo = getDBConnection();

// Get slug from URL
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$slug = basename($uri);

if (empty($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Trip slug required']);
    exit;
}

// Get trip by slug or ID
$stmt = $pdo->prepare("SELECT * FROM trips WHERE slug = ? OR id = ? LIMIT 1");
$stmt->execute([$slug, $slug]);
$trip = $stmt->fetch();

if (!$trip) {
    http_response_code(404);
    echo json_encode(['error' => 'Trip not found']);
    exit;
}

echo json_encode(formatTripData($trip));
?>
