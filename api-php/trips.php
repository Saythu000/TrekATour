<?php
require_once 'config.php';

$pdo = getDBConnection();

// Get all active trips
$stmt = $pdo->prepare("SELECT * FROM trips WHERE is_active = 1 ORDER BY created_at DESC");
$stmt->execute();
$trips = $stmt->fetchAll();

$formattedTrips = array_map('formatTripData', $trips);

echo json_encode($formattedTrips);
?>
