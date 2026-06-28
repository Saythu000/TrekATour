<?php
require_once 'config.php';

$pdo = getDBConnection();

// Get recommended trips
$stmt = $pdo->prepare("
    SELECT * FROM trips 
    WHERE is_active = 1 AND is_recommended = 1 
    ORDER BY recommendation_order ASC, created_at DESC
");
$stmt->execute();
$trips = $stmt->fetchAll();

$formattedTrips = array_map('formatTripData', $trips);

echo json_encode($formattedTrips);
?>
