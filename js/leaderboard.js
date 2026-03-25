/**
 * Leaderboard Controller - Manages leaderboard display and filtering
 */

class LeaderboardController {
    constructor() {
        this.currentFilter = 'all';
        this.leaderboardData = [];
        this.userStats = null;

        this.initializeElements();
        this.attachEventListeners();
        this.loadLeaderboard();
        this.loadUserStats();
    }

    initializeElements() {
        this.leaderboardBody = document.getElementById('leaderboardBody');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.totalScore = document.getElementById('totalScore');
        this.highestLevel = document.getElementById('highestLevel');
        this.gamesPlayed = document.getElementById('gamesPlayed');
        this.avgAccuracy = document.getElementById('avgAccuracy');
    }

    attachEventListeners() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
    }

    loadLeaderboard() {
        // Fetch from backend or use mock data
        fetch('php/get_leaderboard.php')
            .then(res => res.json())
            .then(data => {
                this.leaderboardData = data;
                this.displayLeaderboard();
            })
            .catch(() => {
                // Use mock data if backend unavailable
                this.leaderboardData = this.getMockLeaderboard();
                this.displayLeaderboard();
            });
    }

    displayLeaderboard() {
        this.leaderboardBody.innerHTML = '';
        let filteredData = this.filterLeaderboard();

        if (filteredData.length === 0) {
            this.leaderboardBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No data available</td></tr>';
            return;
        }

        filteredData.slice(0, 50).forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="rank-badge ${this.getRankClass(index + 1)}">
                        ${index + 1}
                    </span>
                </td>
                <td>
                    <div class="player-info">
                        <div class="player-avatar">${player.name.charAt(0).toUpperCase()}</div>
                        <div>
                            <div class="player-name">${player.name}</div>
                            <div class="player-region">${player.region || 'Global'}</div>
                        </div>
                    </div>
                </td>
                <td><span class="score-value">${player.score.toLocaleString()}</span></td>
                <td><span class="level-badge">Level ${player.level}</span></td>
                <td><span class="accuracy ${this.getAccuracyClass(player.accuracy)}">${player.accuracy.toFixed(1)}%</span></td>
                <td><span class="time-value">${player.bestTime}s</span></td>
            `;
            this.leaderboardBody.appendChild(row);
        });
    }

    filterLeaderboard() {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        return this.leaderboardData.filter(player => {
            const playerDate = new Date(player.lastPlayedDate);

            switch (this.currentFilter) {
                case 'week':
                    return playerDate > oneWeekAgo;
                case 'day':
                    return playerDate > oneDayAgo;
                default:
                    return true;
            }
        }).sort((a, b) => b.score - a.score);
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.displayLeaderboard();
    }

    getRankClass(rank) {
        if (rank === 1) return 'top-1';
        if (rank === 2) return 'top-2';
        if (rank === 3) return 'top-3';
        return '';
    }

    getAccuracyClass(accuracy) {
        if (accuracy >= 90) return 'high';
        if (accuracy >= 70) return 'medium';
        return 'low';
    }

    loadUserStats() {
        // Load from localStorage
        const scores = JSON.parse(localStorage.getItem('bodmasScores') || '[]');

        if (scores.length === 0) {
            this.updateUserStats({
                totalScore: 0,
                highestLevel: 0,
                gamesPlayed: 0,
                avgAccuracy: 0
            });
            return;
        }

        let totalScore = 0;
        let highestLevel = 0;
        let totalAccuracy = 0;

        scores.forEach(game => {
            totalScore += game.score || 0;
            highestLevel = Math.max(highestLevel, game.level || 0);
            totalAccuracy += 100 - (game.mistakes || 0) * 5;
        });

        const avgAccuracy = Math.min(100, totalAccuracy / scores.length);

        this.updateUserStats({
            totalScore: totalScore,
            highestLevel: highestLevel,
            gamesPlayed: scores.length,
            avgAccuracy: avgAccuracy.toFixed(1)
        });
    }

    updateUserStats(stats) {
        this.totalScore.textContent = stats.totalScore.toLocaleString();
        this.highestLevel.textContent = stats.highestLevel;
        this.gamesPlayed.textContent = stats.gamesPlayed;
        this.avgAccuracy.textContent = stats.avgAccuracy + '%';
    }

    getMockLeaderboard() {
        const names = [
            'MathMaster', 'AlgebraKing', 'NumberNinja', 'EquationEvo',
            'CalculusKing', 'LogicLeader', 'GeometryGenius', 'StatsStar',
            'FormulaFox', 'ProblemPro', 'SolverSupreme', 'MathMaven',
            'TokenTitan', 'OperatorOracle', 'BracketBoss', 'ExpressionExpert',
            'CompuChamp', 'DemonicDerived', 'IntegralIce', 'DerivativesDream'
        ];

        return names.map((name, i) => ({
            name: name,
            score: Math.floor(Math.random() * 10000) + 5000,
            level: Math.floor(Math.random() * 20) + 5,
            accuracy: Math.floor(Math.random() * 30) + 70,
            bestTime: Math.floor(Math.random() * 120) + 10,
            region: ['USA', 'UK', 'India', 'Canada', 'Australia'][Math.floor(Math.random() * 5)],
            lastPlayedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        })).sort((a, b) => b.score - a.score);
    }
}

// Initialize leaderboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new LeaderboardController();
});
