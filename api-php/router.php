<?php
// Router for PHP built-in server
// Handle CORS for all requests
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Route the request
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove /api-php prefix if present (consistent with new API_URL)
$uri = preg_replace('#^/api-php#', '', $uri);

// Route to appropriate file
if ($uri === '/health' || $uri === '/health.php') {
    require 'health.php';
} elseif ($uri === '/trips' || $uri === '/trips.php') {
    require 'trips.php';
} elseif (preg_match('#^/trips/category/([^/]+)$#', $uri, $matches)) {
    $_GET['category'] = $matches[1];
    require 'category-trips.php';
} elseif ($uri === '/trips/recommended/all') {
    require 'recommended.php';
} elseif (preg_match('#^/trips/([a-zA-Z0-9\-\_\.]+)$#', $uri)) {
    // Single trip by slug or unique ID: /trips/{slug_or_id}
    require 'trip-detail.php';
} elseif ($uri === '/recommendations-content' || $uri === '/recommendations-content.php') {
    require 'recommendations-content.php';
} elseif (preg_match('#^/content/([^/]+)/([^/]+)$#', $uri, $matches)) {
    $_GET['pageType'] = $matches[1];
    $_GET['contentKey'] = $matches[2];
    require 'content.php';
} elseif ($uri === '/bookings' || $uri === '/bookings.php') {
    require 'bookings.php';
} elseif ($uri === '/reviews' || $uri === '/reviews.php') {
    require 'reviews.php';
} elseif ($uri === '/contact' || $uri === '/contact.php') {
    require 'contact.php';
} elseif ($uri === '/admin/reviews' || $uri === '/admin/reviews/') {
    require 'admin-reviews.php';
} elseif ($uri === '/admin/contact' || $uri === '/admin/contact/') {
    require 'admin-contact.php';
} elseif ($uri === '/upload' || $uri === '/upload.php') {
    require 'upload.php';
} elseif (strpos($uri, '/admin/') !== false) {
    require 'admin.php';
} else {
    // Return the requested file if it exists
    return false;
}
