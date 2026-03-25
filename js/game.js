/**
 * Game Controller - Main game logic and UI management
 */

class GameController {
    constructor() {
        this.engine = new BODMASEngine();
        this.level = 1;
        this.score = 0;
        this.mistakes = 0;
        this.startTime = null;
        this.selectedTiles = [];
        this.gameActive = false;
        this.hintsUsed = 0;

        this.initializeElements();
        this.attachEventListeners();
        this.startNewGame();
    }

    initializeElements() {
        this.expressionDisplay = document.getElementById('expression');
        this.tilesContainer = document.getElementById('tilesContainer');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.feedbackPanel = document.getElementById('feedbackPanel');
        this.feedbackText = document.getElementById('feedbackText');
        this.hintPanel = document.getElementById('hintPanel');
        this.hintText = document.getElementById('hintText');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.submitBtn = document.getElementById('submitBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.quitBtn = document.getElementById('quitBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.homeBtn = document.getElementById('homeBtn');
    }

    attachEventListeners() {
        this.submitBtn.addEventListener('click', () => this.submitSolution());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.quitBtn.addEventListener('click', () => this.quitGame());
        this.nextBtn.addEventListener('click', () => this.nextLevel());
        this.homeBtn.addEventListener('click', () => window.location.href = 'index.html');
    }

    startNewGame() {
        this.engine.reset();
        const difficulty = this.getDifficulty();
        this.engine.generateExpression(difficulty);
        this.startTime = Date.now();
        this.gameActive = true;
        this.mistakes = 0;
        this.selectedTiles = [];
        this.hintsUsed = 0;

        this.updateDisplay();
        this.renderTiles();
        this.startTimer();
        this.showFeedback('Solve the expression correctly!', 'info');
    }

    getDifficulty() {
        if (this.level <= 3) return 'easy';
        if (this.level <= 6) return 'medium';
        return 'hard';
    }

    renderTiles() {
        this.tilesContainer.innerHTML = '';
        const tokens = this.engine.getTokens();

        tokens.forEach((token, index) => {
            const tile = document.createElement('div');
            tile.className = 'tile animate-scale-in';
            tile.textContent = token;
            tile.dataset.index = index;
            tile.dataset.value = token;

            // Classify tile type
            if (this.engine.isOperator(token)) {
                tile.classList.add('operator');
            } else if (token === '(' || token === ')') {
                tile.classList.add('bracket');
            } else {
                tile.classList.add('number');
            }

            // Make tile clickable only if it's part of a valid next operation
            tile.addEventListener('click', (e) => this.handleTileClick(e, index));

            this.tilesContainer.appendChild(tile);
        });
    }

    handleTileClick(e, index) {
        if (!this.gameActive) return;

        const tile = e.target;
        const tokens = this.engine.getTokens();

        // Only allow clicking on operators
        if (!this.engine.isOperator(tokens[index])) {
            this.showFeedback('Click on an operator!', 'error');
            return;
        }

        // Check if this is the correct next step
        if (this.engine.validateStep(index)) {
            this.performStep(index);
        } else {
            this.mistakes++;
            tile.classList.add('wrong-animation');
            this.showFeedback('Wrong step! Follow BODMAS order.', 'error');
            setTimeout(() => tile.classList.remove('wrong-animation'), 400);
        }
    }

    performStep(operatorIndex) {
        const tiles = document.querySelectorAll('.tile');
        
        // Animate the tiles involved in the operation
        const operatorTile = tiles[operatorIndex];
        operatorTile.classList.add('tile-flip');

        if (this.engine.solveStep(operatorIndex)) {
            // Show success animation
            this.showFeedback('✓ Correct step!', 'success');
            
            // Check if game is complete
            if (this.engine.isSolved()) {
                setTimeout(() => this.completeLevel(), 600);
            } else {
                // Re-render tiles after a short delay
                setTimeout(() => this.renderTiles(), 400);
            }
        }
    }

    completeLevel() {
        this.gameActive = false;
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        const levelScore = this.engine.calculateScore(elapsedTime, this.mistakes);
        this.score += levelScore;

        this.showGameOverModal(levelScore, elapsedTime);
        this.saveScore(levelScore, elapsedTime);
    }

    showGameOverModal(levelScore, timeInSeconds) {
        document.getElementById('gameOverTitle').textContent = `Level ${this.level} Complete!`;
        document.getElementById('finalScore').textContent = levelScore;
        document.getElementById('finalTime').textContent = `${timeInSeconds}s`;
        document.getElementById('finalMistakes').textContent = this.mistakes;
        
        this.gameOverModal.classList.add('show');
    }

    nextLevel() {
        this.level++;
        this.gameOverModal.classList.remove('show');
        this.levelDisplay.textContent = this.level;
        this.startNewGame();
    }

    submitSolution() {
        if (!this.gameActive) return;
        this.showFeedback('Complete all steps to solve!', 'info');
    }

    resetGame() {
        if (confirm('Reset this level?')) {
            this.startNewGame();
        }
    }

    showHint() {
        if (this.hintsUsed >= 3) {
            this.showFeedback('No more hints available!', 'error');
            return;
        }

        const nextOpIdx = this.engine.getNextOperation();
        if (nextOpIdx === -1) return;

        const tokens = this.engine.getTokens();
        const operator = tokens[nextOpIdx];
        const left = tokens[nextOpIdx - 1];
        const right = tokens[nextOpIdx + 1];

        let hint = '';
        switch (operator) {
            case '*':
            case '/':
                hint = `Solve Multiplication/Division first: ${left} ${operator} ${right}`;
                break;
            case '+':
            case '-':
                hint = `Then solve Addition/Subtraction: ${left} ${operator} ${right}`;
                break;
            default:
                hint = `Try solving: ${left} ${operator} ${right}`;
        }

        this.hintText.textContent = hint;
        this.hintPanel.classList.add('show');
        this.hintsUsed++;
        this.hintBtn.disabled = true;

        setTimeout(() => {
            this.hintPanel.classList.remove('show');
            this.hintBtn.disabled = false;
        }, 5000);
    }

    quitGame() {
        if (confirm('Quit the game?')) {
            window.location.href = 'index.html';
        }
    }

    updateDisplay() {
        this.levelDisplay.textContent = this.level;
        this.scoreDisplay.textContent = this.score;
    }

    startTimer() {
        setInterval(() => {
            if (!this.gameActive) return;
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 100);
    }

    showFeedback(message, type) {
        this.feedbackPanel.classList.remove('success', 'error');
        this.feedbackPanel.classList.add('show', type);
        this.feedbackText.textContent = message;

        if (type === 'info') {
            setTimeout(() => {
                this.feedbackPanel.classList.remove('show');
            }, 3000);
        }
    }

    saveScore(score, timeInSeconds) {
        const gameData = {
            level: this.level,
            score: score,
            time: timeInSeconds,
            mistakes: this.mistakes,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage for now (will be replaced with backend in PHP)
        let scores = JSON.parse(localStorage.getItem('bodmasScores') || '[]');
        scores.push(gameData);
        localStorage.setItem('bodmasScores', JSON.stringify(scores));

        // Send to backend
        this.syncToBackend(gameData);
    }

    syncToBackend(gameData) {
        // This will be implemented with PHP backend
        fetch('php/save_score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        }).catch(err => console.log('Offline - saved locally'));
    }
}

// Global function to close hint
function closeHint() {
    document.getElementById('hintPanel').classList.remove('show');
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});
