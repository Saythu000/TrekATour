<?php
require_once 'config.php';

$pdo = getDBConnection();

$category = $_GET['category'] ?? '';

if (empty($category)) {
    echo json_encode([]);
    exit;
}

// Get trips by category
$stmt = $pdo->prepare("SELECT * FROM trips WHERE category = ? AND is_active = 1 ORDER BY created_at DESC");
$stmt->execute([$category]);
$trips = $stmt->fetchAll();

$formattedTrips = array_map('formatTripData', $trips);

echo json_encode($formattedTrips);
?>
