<?php
require_once 'config.php';

echo json_encode([
    'status' => 'ok',
    'message' => 'Trek A Tour API is running',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
