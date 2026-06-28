<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];

// Ensure table exists with correct schema
function ensureReviewsTable($pdo) {
    $pdo->exec("CREATE TABLE IF NOT EXISTS trip_reviews (
        id VARCHAR(36) PRIMARY KEY,
        trip_id VARCHAR(36) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        review_text TEXT,
        review_images JSON,
        youtube_link VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(trip_id)
    )");
}

if ($method === 'POST' && strpos($path, '/admin/reviews') !== false) {
    createReview();
} elseif ($method === 'DELETE' && preg_match('#/admin/reviews/([^/]+)#', $path, $matches)) {
    deleteReview($matches[1]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}

function createReview() {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        return;
    }

    $pdo = getDBConnection();
    ensureReviewsTable($pdo);

    $id = uniqid('rev_', true);
    $reviewImages = isset($data['review_images']) ? json_encode($data['review_images']) : null;

    $stmt = $pdo->prepare("
        INSERT INTO trip_reviews (id, trip_id, user_name, rating, review_text, review_images, youtube_link)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $id,
        $data['trip_id'],
        $data['user_name'],
        $data['rating'],
        $data['review_text'],
        $reviewImages,
        $data['youtube_link'] ?? null
    ]);

    echo json_encode(['success' => true, 'id' => $id]);
}

function deleteReview($id) {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("DELETE FROM trip_reviews WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
}
?>
