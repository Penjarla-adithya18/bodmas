<?php
/**
 * Save Game Score Endpoint
 * POST /php/save_score.php
 * Body: { level, score, time, mistakes }
 * 
 * Note: Works with or without authentication
 */

header('Content-Type: application/json');
require_once 'db.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!$input || !isset($input['score'], $input['level'])) {
    sendResponse(['error' => 'Missing required fields'], 400);
}

$level = intval($input['level']);
$score = intval($input['score']);
$time = intval($input['time'] ?? 0);
$mistakes = intval($input['mistakes'] ?? 0);

// Get user ID from session (optional)
$userId = null;
session_start();
if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
}

// Validate values
if ($level < 1 || $score < 0 || $time < 0) {
    sendResponse(['error' => 'Invalid score data'], 400);
}

// Save to database
if ($userId) {
    $stmt = $conn->prepare("
        INSERT INTO scores (user_id, level, score, time_taken, mistakes, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmt->bind_param("iiiii", $userId, $level, $score, $time, $mistakes);
} else {
    // Save as guest (without user_id)
    $stmt = $conn->prepare("
        INSERT INTO scores (level, score, time_taken, mistakes, created_at) 
        VALUES (?, ?, ?, ?, NOW())
    ");
    $stmt->bind_param("iiii", $level, $score, $time, $mistakes);
}

if ($stmt->execute()) {
    $scoreId = $conn->insert_id;
    
    sendResponse([
        'success' => true,
        'message' => 'Score saved successfully',
        'scoreId' => $scoreId,
        'data' => [
            'level' => $level,
            'score' => $score,
            'time' => $time,
            'mistakes' => $mistakes
        ]
    ], 201);
} else {
    error_log('Save score error: ' . $stmt->error);
    sendResponse(['error' => 'Failed to save score'], 500);
}

$stmt->close();
$conn->close();
?>
