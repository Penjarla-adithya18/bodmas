<?php
/**
 * User Login Endpoint
 * POST /php/login.php
 * Body: { username, password }
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
if (!$input || !isset($input['username'], $input['password'])) {
    sendResponse(['error' => 'Missing username or password'], 400);
}

$username = sanitize($input['username']);
$password = isset($input['password']) ? (string)$input['password'] : '';

if (!$conn) {
    sendResponse([
        'error' => 'Database is unavailable',
        'details' => getDbError(),
        'hint' => 'Set MySQL credentials in php/db.php and enable mysqli in PHP.'
    ], 503);
}

// Fetch user from database by username or email.
$stmt = $conn->prepare("SELECT id, username, email, password FROM users WHERE username = ? OR email = ?");
$stmt->bind_param("ss", $username, $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendResponse(['error' => 'Invalid username or password'], 401);
}

$user = $result->fetch_assoc();
$stmt->close();

// Verify password
if (!password_verify($password, $user['password'])) {
    sendResponse(['error' => 'Invalid username or password'], 401);
}

// Start session
session_start();
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];

// Update last login
$stmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
$stmt->bind_param("i", $user['id']);
$stmt->execute();
$stmt->close();

sendResponse([
    'success' => true,
    'message' => 'Login successful',
    'user' => [
        'id' => $user['id'],
        'username' => $user['username'],
        'email' => $user['email']
    ]
], 200);

$conn->close();
?>
