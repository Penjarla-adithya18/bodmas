# BODMAS Master 🎮

**Master the Math. Own the Order.**

A full-stack interactive mathematical puzzle game where you solve complex BODMAS (Brackets, Orders, Division/Multiplication, Addition/Subtraction) expressions step by step. Built with HTML, CSS, JavaScript, and PHP.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![PHP](https://img.shields.io/badge/PHP-7.4%2B-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-5.7%2B-blue.svg)

## 🚀 Quick Start

### Prerequisites
- PHP 7.4+
- MySQL 5.7+
- Web server (Apache/Nginx)
- Modern web browser

### 3-Minute Setup

1. **Download & Extract**
   ```bash
   # Extract the project files
   cd bodmas-master
   ```

2. **Create Database**
   - Open phpMyAdmin or MySQL CLI
   - Run the SQL from `database/schema.sql`
   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. **Configure Database** (if needed)
   - Edit `php/db.php`
   - Update DB_HOST, DB_USER, DB_PASS, DB_NAME

4. **Start Server**
   ```bash
   # Using XAMPP: Start Apache & MySQL
   # Using PHP Built-in: php -S localhost:8000
   ```

5. **Open Browser**
   - Go to `http://localhost/bodmas-master` (or your URL)
   - Click "Play Now" and start solving! 🎯

## 📋 Features

### Core Game
✅ BODMAS/PEMDAS compliant expression solving
✅ Real-time validation of each step
✅ Multiple difficulty levels (Easy → Medium → Hard)
✅ Scoring system based on speed & accuracy
✅ Step-by-step guidance with hints

### User System
✅ User registration & secure login
✅ Session management
✅ Score tracking & history
✅ Personal statistics

### Leaderboard
✅ Global rankings
✅ Time-based filters (all-time, weekly, daily)
✅ Accuracy tracking
✅ Level progression display

### Technical
✅ Responsive design (mobile-friendly)
✅ Fast animations (60 FPS)
✅ Offline score caching
✅ RESTful API design

## 🎮 How to Play

1. **Start a Game**: Click "Play Now" from the home page
2. **Solve the Expression**: The expression appears at the top
3. **Select Operations**: Click on operators in the correct BODMAS order
4. **Watch It Solve**: See each step calculated in real-time
5. **Complete & Score**: Finish the puzzle and earn points
6. **Level Up**: Progress through increasing difficulty levels

## 🏗️ Project Structure

```
bodmas-master/
├── index.html              # Landing page
├── game.html              # Game interface
├── leaderboard.html       # Rankings page
│
├── css/
│   ├── style.css          # Global styles
│   ├── animations.css     # 20+ animations
│   ├── game.css           # Game-specific styles
│   └── leaderboard.css    # Rankings styles
│
├── js/
│   ├── bodmasEngine.js    # Core game logic
│   ├── game.js            # Game controller
│   ├── leaderboard.js     # Rankings controller
│   └── api.js             # API helpers
│
├── php/
│   ├── db.php             # Database config
│   ├── register.php       # Registration API
│   ├── login.php          # Login API
│   ├── save_score.php     # Score storage API
│   ├── get_leaderboard.php# Rankings API
│   └── logout.php         # Logout API
│
└── database/
    └── schema.sql         # MySQL schema
```

## 🔧 Configuration

### Database
Edit `php/db.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
define('DB_NAME', 'bodmas_game');
```

### Colors
Edit `css/style.css` `:root` section:
```css
--primary-purple: #a855f7;
--accent-cyan: #06b6d4;
--accent-green: #22c55e;
```

### Difficulty
Edit `js/game.js` getDifficulty() method to change level thresholds

## 📊 Game Modes (Expandable)

| Mode | Status | Description |
|------|--------|-------------|
| Classic | ✅ Active | Solve expressions step-by-step |
| Timed | 🔄 Ready | Race against the clock |
| Endless | 🔄 Ready | Infinite puzzles with scaling difficulty |
| Puzzle | 🔄 Ready | Rearrange operators correctly |
| Daily Challenge | 🔄 Ready | Limited-time daily puzzle |

## 🌐 API Reference

### POST `/php/register.php`
Register new user
```json
{
  "username": "string",
  "password": "string (min 6 chars)",
  "email": "string (valid email)"
}
```

### POST `/php/login.php`
Login user
```json
{
  "username": "string",
  "password": "string"
}
```

### POST `/php/save_score.php`
Save game score (authenticated or guest)
```json
{
  "level": 5,
  "score": 450,
  "time": 45,
  "mistakes": 2
}
```

### GET `/php/get_leaderboard.php?filter=all&limit=50`
Get rankings
- Filters: `all`, `week`, `day`, `month`

## 🛡️ Security

- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS protection (HTML escaping)
- ✅ Session management
- ⚠️ TODO: CSRF tokens, input validation

## 🚢 Deployment

### Local (XAMPP/WAMP)
1. Copy to `htdocs` or `www`
2. Import database
3. Update `php/db.php` with local credentials
4. Open in browser

### Shared Hosting
1. Upload via FTP
2. Create database via control panel
3. Import `schema.sql`
4. Update `php/db.php`
5. Access via domain

### Docker (Optional)
```dockerfile
FROM php:7.4-apache
# Add MySQL, copy files, configure
```

## 📈 Performance

- Page Load: ~500ms
- Game Load: ~200ms
- Animation FPS: 60
- Database Query Time: <50ms
- Gzip Compression: Enabled
- Cache Expires: 1 year for assets

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Check credentials in `php/db.php`, ensure MySQL is running |
| Scores not saving | Verify user auth, check file permissions (644) |
| Game not loading | Clear cache, check console for JS errors |
| Animations lag | Check browser FPS, reduce animations in `css/animations.css` |

See [SETUP.md](SETUP.md) for detailed troubleshooting.

## 🎓 Learning Resources

- BODMAS Order: https://www.mathsisfun.com/operation-order-pemdas.html
- JavaScript Game Dev: https://developer.mozilla.org/en-US/docs/Games
- PHP Best Practices: https://www.php.net/manual/en/security.php
- SQL Optimization: https://use-the-index-luke.com/

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time multiplayer
- [ ] AI difficulty scaling
- [ ] Achievement badges
- [ ] Social leaderboard (friends)
- [ ] Video tutorials
- [ ] Expression generator API
- [ ] Custom difficulty settings

## 📝 License

MIT License - Feel free to use for personal and educational purposes.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 💬 Feedback

Have suggestions? Found a bug?
- Check [SETUP.md](SETUP.md) first
- Review open issues
- Submit a detailed bug report

## 🎯 Goals

- ✅ Core game mechanics
- ✅ Backend infrastructure
- ✅ User authentication
- ✅ Leaderboard system
- 🔄 Mobile optimization
- 🔄 Multiplayer support
- 🔄 Advanced AI

---

**Made with ❤️ for math lovers everywhere**

*Master the Math. Own the Order.* 🧮✨
