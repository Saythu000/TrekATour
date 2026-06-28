<?php
require_once 'config.php';

$pdo = getDBConnection();

$tripId = $_GET['tripId'] ?? '';

if (empty($tripId)) {
    echo json_encode([]);
    exit;
}

// Get reviews for trip
// Note: We use the trip_reviews table from our mysql-schema.sql
$stmt = $pdo->prepare("SELECT * FROM trip_reviews WHERE trip_id = ? ORDER BY created_at DESC");
$stmt->execute([$tripId]);
$reviews = $stmt->fetchAll();

echo json_encode($reviews);
?>
