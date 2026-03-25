<?php
/**
 * Database Configuration and Connection
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
// Set your MySQL password here (root requires password on this machine).
define('DB_PASS', '5566');
define('DB_NAME', 'bodmas');

$conn = null;
$dbError = null;

if (!function_exists('mysqli_connect')) {
    $dbError = 'MySQLi extension is not enabled';
} else {
    // Prevent uncaught mysqli exceptions from crashing the endpoint.
    mysqli_report(MYSQLI_REPORT_OFF);

    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    } catch (Throwable $e) {
        $dbError = 'Database connection failed: ' . $e->getMessage();
    }

    if ($conn && $conn->connect_error) {
        $dbError = 'Database connection failed: ' . $conn->connect_error;
        $conn = null;
    }

    if ($conn) {
        $conn->set_charset("utf8mb4");
    }
}

if ($dbError) {
    error_log($dbError);
}

function getDbError() {
    global $dbError;
    return $dbError ?: 'Unknown database error';
}

// Function to sanitize input
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Function to verify user session
function verifySession() {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    return $_SESSION['user_id'];
}

// Function to send JSON response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Enable error reporting for development (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
?>
