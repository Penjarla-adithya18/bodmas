/**
 * API Helper - Client-side API communication
 */

const API = {
    baseURL: 'php/',

    /**
     * Generic fetch wrapper
     */
    async fetch(endpoint, options = {}) {
        try {
            const response = await fetch(this.baseURL + endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                let payload = null;
                try {
                    payload = await response.json();
                } catch (_e) {
                    payload = null;
                }

                const message = payload && (payload.error || payload.details || payload.hint)
                    ? `${payload.error || 'Request failed'}${payload.details ? `: ${payload.details}` : ''}`
                    : `HTTP ${response.status}`;

                throw new Error(message);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Authentication APIs
     */
    auth: {
        register: async (username, password, email) => {
            return API.fetch('register.php', {
                method: 'POST',
                body: JSON.stringify({ username, password, email })
            });
        },

        login: async (username, password) => {
            return API.fetch('login.php', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
        },

        logout: async () => {
            return API.fetch('logout.php', {
                method: 'POST'
            });
        }
    },

    /**
     * Score APIs
     */
    score: {
        save: async (level, score, time, mistakes) => {
            return API.fetch('save_score.php', {
                method: 'POST',
                body: JSON.stringify({ level, score, time, mistakes })
            });
        },

        getLeaderboard: async (filter = 'all') => {
            return API.fetch(`get_leaderboard.php?filter=${filter}`);
        },

        getUserStats: async (userId) => {
            return API.fetch(`get_user_stats.php?userId=${userId}`);
        }
    },

    /**
     * Question APIs
     */
    question: {
        getRandomQuestion: async (difficulty = 'easy') => {
            return API.fetch(`get_question.php?difficulty=${difficulty}`);
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
