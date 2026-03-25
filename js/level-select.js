(function () {
    const TOTAL_LEVELS = 15;

    function getUnlockedLevel() {
        const unlocked = parseInt(localStorage.getItem('bodmas_unlocked_level') || '1', 10);
        return Number.isFinite(unlocked) && unlocked > 0 ? Math.min(unlocked, TOTAL_LEVELS) : 1;
    }

    function getScores() {
        try {
            return JSON.parse(localStorage.getItem('bodmasScores') || '[]');
        } catch (_e) {
            return [];
        }
    }

    function getBestScoreByLevel(scores) {
        const map = new Map();
        scores.forEach((row) => {
            const level = Number(row.level || 0);
            const score = Number(row.score || 0);
            if (!level || level < 1 || level > TOTAL_LEVELS) return;
            const current = map.get(level) || 0;
            map.set(level, Math.max(current, score));
        });
        return map;
    }

    function starsForScore(score) {
        if (score >= 900) return 3;
        if (score >= 600) return 2;
        if (score > 0) return 1;
        return 0;
    }

    function getDifficultyLabel(level) {
        if (level <= 5) return 'Easy';
        if (level <= 10) return 'Medium';
        return 'Hard';
    }

    function renderGrid() {
        const unlockedLevel = getUnlockedLevel();
        const scores = getScores();
        const bestByLevel = getBestScoreByLevel(scores);
        const grid = document.getElementById('levelGrid');

        grid.innerHTML = '';

        for (let level = 1; level <= TOTAL_LEVELS; level++) {
            const unlocked = level <= unlockedLevel;
            const bestScore = bestByLevel.get(level) || 0;
            const stars = starsForScore(bestScore);
            const completed = bestScore > 0;
            const difficulty = getDifficultyLabel(level);

            const card = document.createElement('article');
            card.className = 'level-card ' + (unlocked ? 'unlocked' : 'locked') + (completed ? ' completed' : '');
            card.setAttribute('data-level', String(level));

            card.innerHTML = [
                '<div class="level-top">',
                '<span class="level-number">Level ' + level + '</span>',
                unlocked ? '<span class="level-lock">Open</span>' : '<span class="level-lock">Locked</span>',
                '</div>',
                '<div class="level-meta">',
                '<div>Difficulty: ' + difficulty + '</div>',
                bestScore > 0 ? ('Best Score: ' + bestScore) : 'Not completed yet',
                '<div class="level-stars">' + (stars > 0 ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '') + '</div>',
                '</div>'
            ].join('');

            if (unlocked) {
                card.addEventListener('click', () => {
                    window.location.href = 'game.html?level=' + level;
                });
            }

            grid.appendChild(card);
        }

        const completedCount = Array.from(bestByLevel.values()).filter((v) => v > 0).length;
        const totalScore = scores.reduce((sum, row) => sum + Number(row.score || 0), 0);

        document.getElementById('unlockedCount').textContent = String(unlockedLevel);
        document.getElementById('completedCount').textContent = String(completedCount);
        document.getElementById('bestTotalScore').textContent = String(totalScore);
    }

    document.addEventListener('DOMContentLoaded', renderGrid);
})();
