<?php
require_once 'config.php';

$pdo = getDBConnection();

// Get all contact submissions
$stmt = $pdo->prepare("SELECT * FROM contact_submissions ORDER BY created_at DESC");
$stmt->execute();
$submissions = $stmt->fetchAll();

echo json_encode($submissions);
?>
