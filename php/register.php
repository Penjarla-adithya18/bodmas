<?php
/**
 * User Registration Endpoint
 * POST /php/register.php
 * Body: { username, password, email }
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
if (!$input || !isset($input['username'], $input['password'], $input['email'])) {
    sendResponse(['error' => 'Missing required fields'], 400);
}

$username = sanitize($input['username']);
$password = isset($input['password']) ? (string)$input['password'] : '';
$email = sanitize($input['email']);

if (!$conn) {
    sendResponse([
        'error' => 'Database is unavailable',
        'details' => getDbError(),
        'hint' => 'Set MySQL credentials in php/db.php and enable mysqli in PHP.'
    ], 503);
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(['error' => 'Invalid email format'], 400);
}

// Validate password strength
if (strlen($password) < 6) {
    sendResponse(['error' => 'Password must be at least 6 characters'], 400);
}

// Check if username already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    sendResponse(['error' => 'Username already exists'], 400);
}
$stmt->close();

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    sendResponse(['error' => 'Email already registered'], 400);
}
$stmt->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert user
$stmt = $conn->prepare("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
$stmt->bind_param("sss", $username, $email, $hashedPassword);

if ($stmt->execute()) {
    $userId = $conn->insert_id;
    
    // Start session
    session_start();
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;
    
    sendResponse([
        'success' => true,
        'message' => 'Registration successful',
        'user' => [
            'id' => $userId,
            'username' => $username,
            'email' => $email
        ]
    ], 201);
} else {
    sendResponse(['error' => 'Registration failed'], 500);
}

$stmt->close();
$conn->close();
?>
