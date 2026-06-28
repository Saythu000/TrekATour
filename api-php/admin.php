<?php
require_once 'config.php';

/**
 * Trek A Tour - Refactored Admin Controller
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api-php#', '', $uri);

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Request Data Helper
function getPayload() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?: [];
}

// Response Helper
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// --- ROUTING DISPATCHER ---

$routes = [
    '/admin/login' => ['POST' => 'handleLogin'],
    '/admin/content' => ['POST' => 'handleSetContent'],
    '/admin/recommendations-content' => ['POST' => 'handleUpdateRecommendationsContent'],
    '/admin/trips/reorder-recommendations' => ['POST' => 'handleReorderRecommendations'],
    '/admin/trips/recommendation' => ['POST' => 'handleUpdateTripRecommendation'],
    '/admin/trips/update-featured' => ['POST' => 'handleUpdateFeaturedTrips'],
    '/admin/trips' => [
        'POST' => 'handleCreateTrip',
        'GET' => 'handleGetAllTrips' // NEW: Get all trips for admin (including inactive)
    ]
];

if (isset($routes[$path]) && isset($routes[$path][$method])) {
    $function = $routes[$path][$method];
    $function();
} 
elseif (preg_match('#^/admin/trips/([^/]+)$#', $path, $matches)) {
    $id = $matches[1];
    if ($method === 'POST' || $method === 'PUT') handleUpdateTrip($id);
    if ($method === 'DELETE') handleDeleteTrip($id);
} 
else {
    jsonResponse(['error' => 'Endpoint not found', 'path' => $path, 'method' => $method], 404);
}

// --- HANDLER FUNCTIONS ---

function handleGetAllTrips() {
    $pdo = getDBConnection();
    // Admin needs ALL trips (not just active ones)
    $stmt = $pdo->query("SELECT * FROM trips ORDER BY created_at DESC");
    $trips = $stmt->fetchAll();
    $formattedTrips = array_map('formatTripData', $trips);
    jsonResponse($formattedTrips);
}

function handleLogin() {
    $d = getPayload();
    $email = strtolower($d['email'] ?? '');
    $password = $d['password'] ?? '';
    if (!$email || !$password) jsonResponse(['error' => 'Missing credentials'], 400);
    $pdo = getDBConnection();
    $s = $pdo->prepare("SELECT email FROM admin_users WHERE email = ? AND password = ?");
    $s->execute([$email, $password]);
    $u = $s->fetch();
    if (!$u) jsonResponse(['error' => 'Invalid credentials'], 401);
    jsonResponse(['success' => true, 'email' => $u['email']]);
}

function handleCreateTrip() {
    $d = getPayload();
    $pdo = getDBConnection();
    $id = $d['id'] ?? uniqid('trip_', true);
    $sql = "INSERT INTO trips (id, title, slug, category, duration, base_price, original_price, short_desc, image_url, difficulty, available_dates, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id, $d['title'] ?? '', $d['slug'] ?? '', $d['category'] ?? '', 
        $d['duration'] ?? '', $d['base_price'] ?? 0, $d['original_price'] ?? null, 
        $d['short_desc'] ?? '', $d['image_url'] ?? null, $d['difficulty'] ?? 'Moderate', 
        json_encode($d['available_dates'] ?? []), 1
    ]);
    jsonResponse(['success' => true, 'id' => $id]);
}

function handleUpdateTrip($id) {
    $d = getPayload();
    if (empty($d)) jsonResponse(['error' => 'No data provided'], 400);
    $pdo = getDBConnection();
    $fields = []; $vals = [];
    $allowed = ['title', 'slug', 'category', 'duration', 'base_price', 'original_price', 'short_desc', 'image_url', 'difficulty', 'is_active', 'is_featured', 'is_recommended', 'recommendation_order', 'overview_content', 'transportation', 'cancellation_policy', 'refund_policy'];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $d)) {
            $fields[] = "$f = ?";
            $vals[] = is_bool($d[$f]) ? ($d[$f]?1:0) : $d[$f];
        }
    }
    $json = ['available_dates', 'itinerary', 'inclusions', 'exclusions', 'essentials', 'things_to_remember'];
    foreach ($json as $f) {
        if (array_key_exists($f, $d)) {
            $fields[] = "$f = ?";
            $vals[] = is_array($d[$f]) ? json_encode($d[$f]) : $d[$f];
        }
    }
    if (empty($fields)) jsonResponse(['error' => 'No valid fields'], 400);
    $vals[] = $id;
    $pdo->prepare("UPDATE trips SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = ?")->execute($vals);
    jsonResponse(['success' => true]);
}

function handleDeleteTrip($id) {
    getDBConnection()->prepare("DELETE FROM trips WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true]);
}

function handleUpdateFeaturedTrips() {
    $d = getPayload();
    $ids = $d['tripIds'] ?? [];
    $pdo = getDBConnection();
    $pdo->beginTransaction();
    try {
        $pdo->exec("UPDATE trips SET is_featured = 0");
        if (!empty($ids)) {
            $stmt = $pdo->prepare("UPDATE trips SET is_featured = 1 WHERE id = ?");
            foreach ($ids as $id) if($id) $stmt->execute([$id]);
        }
        $pdo->commit();
        jsonResponse(['success' => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        jsonResponse(['error' => $e->getMessage()], 500);
    }
}

function handleReorderRecommendations() {
    $d = getPayload();
    $ids = $d['tripIds'] ?? [];
    $pdo = getDBConnection();
    $pdo->beginTransaction();
    try {
        $pdo->exec("UPDATE trips SET is_recommended = 0");
        $stmt = $pdo->prepare("UPDATE trips SET is_recommended = 1, recommendation_order = ? WHERE id = ?");
        foreach ($ids as $idx => $id) if($id) $stmt->execute([$idx + 1, $id]);
        $pdo->commit();
        jsonResponse(['success' => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        jsonResponse(['error' => $e->getMessage()], 500);
    }
}

function handleSetContent() {
    $d = getPayload();
    $pdo = getDBConnection();
    $pdo->prepare("INSERT INTO site_content (page_type, content_key, content_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)")
        ->execute([$d['page_type'], $d['content_key'], json_encode($d['content_value'])]);
    jsonResponse(['success' => true]);
}

function handleUpdateRecommendationsContent() {
    $d = getPayload();
    getDBConnection()->prepare("INSERT INTO recommendations_content (id, title, description) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)")
        ->execute([$d['title'], $d['description']]);
    jsonResponse(['success' => true]);
}

function handleUpdateTripRecommendation() {
    $d = getPayload();
    getDBConnection()->prepare("UPDATE trips SET is_recommended = ?, recommendation_order = ? WHERE id = ?")
        ->execute([isset($d['is_recommended'])?($d['is_recommended']?1:0):0, $d['recommendation_order']??null, $d['id']]);
    jsonResponse(['success' => true]);
}
?>
