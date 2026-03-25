-- BODMAS Master Database Schema
-- Import this file into your MySQL database to set up the tables

-- Create database
CREATE DATABASE IF NOT EXISTS bodmas_game;
USE bodmas_game;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Scores Table
CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    level INT NOT NULL,
    score INT NOT NULL,
    time_taken INT DEFAULT 0,
    mistakes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_score (score),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expression VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    answer DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_difficulty (difficulty),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Game Sessions Table (for tracking active sessions)
CREATE TABLE IF NOT EXISTS game_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    level INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    final_score INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    user_id INT,
    event_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Questions (Easy)
INSERT INTO questions (expression, difficulty, answer) VALUES
('2 + 3', 'easy', 5),
('5 - 2', 'easy', 3),
('3 + 4 - 1', 'easy', 6),
('10 - 2 + 1', 'easy', 9),
('2 * 3 + 1', 'easy', 7),
('8 / 2 + 1', 'easy', 5),
('5 + 5', 'easy', 10),
('10 - 3', 'easy', 7),
('2 * 2', 'easy', 4),
('6 / 2', 'easy', 3);

-- Sample Questions (Medium)
INSERT INTO questions (expression, difficulty, answer) VALUES
('2 + 3 * 4', 'medium', 14),
('(2 + 3) * 4', 'medium', 20),
('8 / 2 + 3', 'medium', 7),
('10 - 2 * 3', 'medium', 4),
('(10 - 2) / 2', 'medium', 4),
('5 * 2 + 3', 'medium', 13),
('20 / 4 - 1', 'medium', 4),
('3 * (2 + 1)', 'medium', 9),
('15 / 3 + 2', 'medium', 7),
('6 + 2 * 3', 'medium', 12);

-- Sample Questions (Hard)
INSERT INTO questions (expression, difficulty, answer) VALUES
('2 * 3 + 4 / 2', 'hard', 8),
('(10 + 2) / (3 - 1)', 'hard', 6),
('5 * 2 - 3 + 1', 'hard', 8),
('20 / 4 / 2 + 1', 'hard', 3.5),
('3 * (4 + 2) - 2', 'hard', 16),
('8 + 2 * 3 - 1', 'hard', 13),
('(15 - 3) / (2 + 2)', 'hard', 3),
('10 * 2 / 5 + 3', 'hard', 7),
('6 / 2 + 3 * 2', 'hard', 9),
('2 * (3 + 4) - 5', 'hard', 9);

-- Create indexes for better performance
ALTER TABLE scores ADD INDEX idx_user_score (user_id, score);
ALTER TABLE scores ADD INDEX idx_user_level (user_id, level);

-- View: Top players (all time)
CREATE OR REPLACE VIEW view_top_players_all_time AS
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
LEFT JOIN scores s ON u.id = s.user_id
WHERE u.is_active = TRUE
GROUP BY u.id
ORDER BY total_score DESC, highest_level DESC;

-- View: Top players (this week)
CREATE OR REPLACE VIEW view_top_players_week AS
SELECT 
    u.id,
    u.username,
    COALESCE(SUM(s.score), 0) as total_score,
    MAX(s.level) as highest_level,
    COUNT(s.id) as games_played,
    ROUND(AVG(100 - (s.mistakes * 5)), 1) as accuracy,
    MIN(s.time_taken) as best_time
FROM users u
LEFT JOIN scores s ON u.id = s.user_id AND s.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
WHERE u.is_active = TRUE
GROUP BY u.id
ORDER BY total_score DESC, highest_level DESC;
