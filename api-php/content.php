<?php
require_once 'config.php';

$pdo = getDBConnection();

$pageType = $_GET['pageType'] ?? '';
$contentKey = $_GET['contentKey'] ?? '';

if (empty($pageType) || empty($contentKey)) {
    http_response_code(400);
    echo json_encode(['error' => 'pageType and contentKey are required']);
    exit;
}

// Get site content
$stmt = $pdo->prepare("SELECT content_value FROM site_content WHERE page_type = ? AND content_key = ? LIMIT 1");
$stmt->execute([$pageType, $contentKey]);
$row = $stmt->fetch();

if ($row) {
    $value = $row['content_value'];
    if (is_string($value)) {
        echo $value; // It's already JSON in the database
    } else {
        echo json_encode($value);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Content not found']);
}
?>
