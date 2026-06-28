<?php
require_once 'config.php';

$pdo = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

try {
    // Ensure bookings table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(36) PRIMARY KEY,
      trip_id VARCHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      number_of_people INT NOT NULL,
      selected_date DATE,
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_trip_id (trip_id),
      INDEX idx_email (email),
      INDEX idx_status (status)
    )");

    $stmt = $pdo->prepare("
        INSERT INTO bookings (
            id, trip_id, name, email, phone, 
            number_of_people, selected_date, message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $id = $data['id'] ?? uniqid('bk_', true);
    
    $stmt->execute([
        $id,
        $data['trip_id'],
        $data['name'],
        $data['email'],
        $data['phone'],
        $data['number_of_people'],
        $data['selected_date'] ?? null,
        $data['message'] ?? null
    ]);

    echo json_encode(['success' => true, 'id' => $id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
