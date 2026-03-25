<?php
/**
 * Get Leaderboard Data Endpoint
 * GET /php/get_leaderboard.php?filter=all&limit=50
 */

header('Content-Type: application/json');
require_once 'db.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

// Get parameters
$filter = isset($_GET['filter']) ? sanitize($_GET['filter']) : 'all';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;

// Validate limit
if ($limit > 1000) $limit = 1000;
if ($limit < 1) $limit = 50;

// Build query based on filter
$dateFilter = '';
switch ($filter) {
    case 'day':
        $dateFilter = "AND scores.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)";
        break;
    case 'week':
        $dateFilter = "AND scores.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        break;
    case 'month':
        $dateFilter = "AND scores.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        break;
    // 'all' - no filter
}

// Query to get top scores with user info
$query = "
    SELECT 
        u.id,
        u.username,
        COALESCE(SUM(s.score), 0) as total_score,
        MAX(s.level) as highest_level,
        COUNT(s.id) as games_played,
        ROUND(AVG(100 - (s.mistakes * 5)), 1) as accuracy,
        MIN(s.time_taken) as best_time,
        MAX(s.created_at) as last_played_date
    FROM users u
    LEFT JOIN scores s ON u.id = s.user_id $dateFilter
    WHERE u.id IS NOT NULL
    GROUP BY u.id
    ORDER BY total_score DESC, highest_level DESC
    LIMIT $limit
";

$result = $conn->query($query);

if (!$result) {
    error_log('Leaderboard query error: ' . $conn->error);
    sendResponse(['error' => 'Failed to fetch leaderboard'], 500);
}

$leaderboard = [];
while ($row = $result->fetch_assoc()) {
    // Ensure accuracy is between 0-100
    $accuracy = max(0, min(100, floatval($row['accuracy'])));
    
    $leaderboard[] = [
        'id' => intval($row['id']),
        'name' => $row['username'],
        'score' => intval($row['total_score']),
        'level' => intval($row['highest_level']),
        'accuracy' => $accuracy,
        'bestTime' => intval($row['best_time'] ?? 0),
        'gamesPlayed' => intval($row['games_played']),
        'lastPlayedDate' => $row['last_played_date'] ?? date('Y-m-d H:i:s'),
        'region' => 'Global'
    ];
}

// If no users with scores, get active users anyway
if (empty($leaderboard)) {
    $query = "
        SELECT 
            id,
            username,
            created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT $limit
    ";
    
    $result = $conn->query($query);
    
    while ($row = $result->fetch_assoc()) {
        $leaderboard[] = [
            'id' => intval($row['id']),
            'name' => $row['username'],
            'score' => 0,
            'level' => 0,
            'accuracy' => 0,
            'bestTime' => 0,
            'gamesPlayed' => 0,
            'lastPlayedDate' => $row['created_at'],
            'region' => 'Global'
        ];
    }
}

sendResponse($leaderboard, 200);

$conn->close();
?>
