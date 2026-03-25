(function () {
    function applyTheme(theme) {
        var targetTheme = theme === 'light' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', targetTheme);
        if (targetTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            localStorage.setItem('bodmas_theme', targetTheme);
        } catch (_e) {
            // Ignore storage errors.
        }
        syncToggleLabels(targetTheme);
    }

    function getSavedTheme() {
        try {
            return localStorage.getItem('bodmas_theme');
        } catch (_e) {
            return null;
        }
    }

    function syncToggleLabels(theme) {
        var toggles = document.querySelectorAll('.theme-toggle');
        toggles.forEach(function (btn) {
            var iconEl = btn.querySelector('.theme-icon');
            if (iconEl) {
                iconEl.textContent = theme === 'light' ? '☾' : '☀';
            } else {
                btn.textContent = theme === 'light' ? '☾' : '☀';
            }
            btn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Bright Mode');
            btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        });
    }

    function initTheme() {
        var saved = getSavedTheme();
        applyTheme(saved || 'dark');

        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
                applyTheme(current === 'light' ? 'dark' : 'light');
            });
        });
    }

    document.addEventListener('DOMContentLoaded', initTheme);
})();
