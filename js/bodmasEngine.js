/**
 * BODMAS Engine - Core Mathematical Logic
 * Handles expression parsing, validation, and solving
 */

class BODMASEngine {
    constructor() {
        this.tokens = [];
        this.history = [];
        this.score = 0;
        this.level = 1;
    }

    /**
     * Generate a random expression based on difficulty level
     */
    generateExpression(level = 'easy') {
        const levels = {
            easy: { numCount: 3, operators: ['+', '-'], brackets: false },
            medium: { numCount: 4, operators: ['+', '-', '*', '/'], brackets: true },
            hard: { numCount: 5, operators: ['+', '-', '*', '/'], brackets: true }
        };

        const config = levels[level] || levels.easy;
        let expression = [];

        for (let i = 0; i < config.numCount; i++) {
            const num = Math.floor(Math.random() * 20) + 1;
            expression.push(num.toString());

            if (i < config.numCount - 1) {
                const operator = config.operators[Math.floor(Math.random() * config.operators.length)];
                expression.push(operator);
            }
        }

        // Add brackets randomly for medium and hard
        if (config.brackets && Math.random() > 0.5) {
            const startIdx = Math.floor(Math.random() * (expression.length - 2));
            const endIdx = startIdx + 2 + Math.floor(Math.random() * 2);
            expression.splice(startIdx, 0, '(');
            expression.splice(endIdx + 1, 0, ')');
        }

        this.tokens = expression;
        return expression;
    }

    /**
     * Parse expression string to tokens
     */
    parseExpression(exprString) {
        const regex = /(\d+|[+\-*/()% ])/g;
        const matches = exprString.match(regex);
        this.tokens = matches.filter(m => m.trim() !== '');
        return this.tokens;
    }

    /**
     * Validate if a selected step is the correct next operation
     */
    validateStep(selectedIndex) {
        const nextOpIdx = this.getNextOperation();
        return selectedIndex === nextOpIdx;
    }

    /**
     * Find the next operation according to BODMAS
     * Returns the index of the operator to solve next
     */
    getNextOperation() {
        const tokens = this.tokens;

        // Priority 1: Parentheses
        const openParen = tokens.lastIndexOf('(');
        if (openParen !== -1) {
            // Find the matching close paren
            const closeParen = tokens.indexOf(')', openParen);
            if (closeParen !== -1) {
                // Find the operation inside the parentheses
                for (let i = openParen + 1; i < closeParen; i++) {
                    if (this.isOperator(tokens[i]) && this.getPriority(tokens[i]) >= 3) {
                        return i;
                    }
                }
                // If no high priority, return first operation
                for (let i = openParen + 1; i < closeParen; i++) {
                    if (this.isOperator(tokens[i])) {
                        return i;
                    }
                }
            }
        }

        // Priority 2: Multiplication and Division
        for (let i = 0; i < tokens.length; i++) {
            if ((tokens[i] === '*' || tokens[i] === '/') && !this.isInsideParentheses(i)) {
                return i;
            }
        }

        // Priority 3: Addition and Subtraction
        for (let i = 0; i < tokens.length; i++) {
            if ((tokens[i] === '+' || tokens[i] === '-') && !this.isInsideParentheses(i)) {
                return i;
            }
        }

        return -1; // Expression solved
    }

    /**
     * Check if index is inside parentheses
     */
    isInsideParentheses(index) {
        const tokens = this.tokens;
        let openCount = 0;

        for (let i = 0; i < index; i++) {
            if (tokens[i] === '(') openCount++;
            if (tokens[i] === ')') openCount--;
        }

        return openCount > 0;
    }

    /**
     * Get operator priority
     */
    getPriority(operator) {
        switch (operator) {
            case '(': case ')': return 4;
            case '*': case '/': return 3;
            case '+': case '-': return 2;
            default: return 0;
        }
    }

    /**
     * Check if token is an operator
     */
    isOperator(token) {
        return ['+', '-', '*', '/', '%'].includes(token);
    }

    /**
     * Solve a single step
     */
    solveStep(operatorIndex) {
        if (operatorIndex < 0 || operatorIndex >= this.tokens.length) {
            return false;
        }

        const left = parseFloat(this.tokens[operatorIndex - 1]);
        const operator = this.tokens[operatorIndex];
        const right = parseFloat(this.tokens[operatorIndex + 1]);

        let result;
        switch (operator) {
            case '+':
                result = left + right;
                break;
            case '-':
                result = left - right;
                break;
            case '*':
                result = left * right;
                break;
            case '/':
                if (right === 0) return false; // Avoid division by zero
                result = left / right;
                break;
            case '%':
                result = left % right;
                break;
            default:
                return false;
        }

        // Replace the operation with its result
        this.tokens.splice(operatorIndex - 1, 3, result.toString());
        this.history.push({
            operation: `${left}${operator}${right}`,
            result: result.toString(),
            tokens: [...this.tokens]
        });

        return true;
    }

    /**
     * Solve entire expression step by step (used for verification)
     */
    solveExpression() {
        const tokensCopy = [...this.tokens];
        const steps = [];

        while (true) {
            const nextOp = this.findNextOperation(tokensCopy);
            if (nextOp === -1) break;

            const left = parseFloat(tokensCopy[nextOp - 1]);
            const operator = tokensCopy[nextOp];
            const right = parseFloat(tokensCopy[nextOp + 1]);

            let result;
            switch (operator) {
                case '+': result = left + right; break;
                case '-': result = left - right; break;
                case '*': result = left * right; break;
                case '/': result = right === 0 ? 0 : left / right; break;
                default: result = 0;
            }

            steps.push({
                operation: `${left}${operator}${right}`,
                result: result
            });

            tokensCopy.splice(nextOp - 1, 3, result.toString());
        }

        return {
            steps: steps,
            result: parseFloat(tokensCopy[0])
        };
    }

    /**
     * Find next operation (similar to getNextOperation but for a copy)
     */
    findNextOperation(tokens) {
        // Parentheses
        const openParen = tokens.lastIndexOf('(');
        if (openParen !== -1) {
            const closeParen = tokens.indexOf(')', openParen);
            if (closeParen !== -1) {
                for (let i = openParen + 1; i < closeParen; i++) {
                    if (this.isOperator(tokens[i]) && this.getPriority(tokens[i]) >= 3) {
                        return i;
                    }
                }
                for (let i = openParen + 1; i < closeParen; i++) {
                    if (this.isOperator(tokens[i])) {
                        return i;
                    }
                }
            }
        }

        // Multiplication and Division
        for (let i = 0; i < tokens.length; i++) {
            if ((tokens[i] === '*' || tokens[i] === '/')) {
                return i;
            }
        }

        // Addition and Subtraction
        for (let i = 0; i < tokens.length; i++) {
            if ((tokens[i] === '+' || tokens[i] === '-')) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Check if expression is solved
     */
    isSolved() {
        return this.tokens.length === 1;
    }

    /**
     * Get current tokens
     */
    getTokens() {
        return [...this.tokens];
    }

    /**
     * Calculate score based on speed and correctness
     */
    calculateScore(timeInSeconds, mistakes = 0) {
        const baseScore = 100;
        const timeBonus = Math.max(50 - timeInSeconds, 0);
        const mistakePenalty = mistakes * 10;
        return Math.max(baseScore + timeBonus - mistakePenalty, 10);
    }

    /**
     * Reset engine for new game
     */
    reset() {
        this.tokens = [];
        this.history = [];
    }
}
