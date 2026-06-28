<?php
require_once 'config.php';

$pdo = getDBConnection();

// Get all content from recommendations_content table
$stmt = $pdo->prepare("SELECT * FROM recommendations_content ORDER BY updated_at DESC LIMIT 1");
$stmt->execute();
$content = $stmt->fetch();

if ($content) {
    echo json_encode($content);
} else {
    echo json_encode([
        'title' => 'Recommended Trips',
        'description' => 'Explore our handpicked selection of amazing trips'
    ]);
}
?>
