# BODMAS Master - Setup Guide

A complete full-stack mathematical puzzle game built with HTML, CSS, JavaScript, and PHP.

## Project Structure

```
bodmas-master/
├── index.html                 # Landing page
├── game.html                  # Game page
├── leaderboard.html          # Leaderboard page
│
├── css/
│   ├── style.css             # Global styles
│   ├── animations.css        # Animation definitions
│   └── game.css              # Game-specific styles
│   └── leaderboard.css       # Leaderboard styles
│
├── js/
│   ├── bodmasEngine.js       # Core game logic (BODMAS solver)
│   ├── game.js               # Game controller
│   ├── leaderboard.js        # Leaderboard controller
│   └── api.js                # API helper functions
│
├── php/
│   ├── db.php                # Database configuration
│   ├── register.php          # User registration endpoint
│   ├── login.php             # User login endpoint
│   ├── save_score.php        # Save game score endpoint
│   ├── get_leaderboard.php   # Get leaderboard data
│   └── logout.php            # User logout endpoint
│
├── database/
│   └── schema.sql            # MySQL database schema
│
└── SETUP.md                  # This file
```

## Requirements

- **PHP**: 7.4 or higher
- **MySQL**: 5.7 or higher
- **Web Server**: Apache, Nginx, or built-in PHP server
- **Browser**: Modern browser with ES6+ support

## Installation & Setup

### 1. Database Setup

**Option A: Using phpMyAdmin (Recommended for beginners)**
1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Create a new database called `bodmas_game`
3. Go to the "Import" tab
4. Select the `database/schema.sql` file
5. Click "Import"

**Option B: Using MySQL Command Line**
```bash
mysql -u root -p < database/schema.sql
```

**Option C: Manual SQL Execution**
1. Connect to MySQL: `mysql -u root -p`
2. Execute the SQL from `database/schema.sql`

### 2. Configure Database Connection

Edit `php/db.php` and update the database credentials if needed:

```php
define('DB_HOST', 'localhost');  // Your MySQL host
define('DB_USER', 'root');        // Your MySQL username
define('DB_PASS', '');            // Your MySQL password
define('DB_NAME', 'bodmas_game'); // Your database name
```

### 3. Local Development Setup

**Using XAMPP (Windows/Mac/Linux)**
1. Download and install XAMPP
2. Copy the `bodmas-master` folder to `htdocs` folder
3. Start Apache and MySQL from XAMPP Control Panel
4. Open `http://localhost/bodmas-master` in your browser

**Using WAMP (Windows)**
1. Copy the `bodmas-master` folder to `www` folder
2. Start WAMP
3. Open `http://localhost/bodmas-master`

**Using LAMP (Linux)**
1. Copy the folder to `/var/www/html/`
2. Ensure proper permissions: `chmod -R 755 bodmas-master`
3. Start Apache and MySQL
4. Open `http://localhost/bodmas-master`

**Using PHP Built-in Server**
```bash
cd bodmas-master
php -S localhost:8000
```
Then open `http://localhost:8000`

### 4. First Run

1. Open `http://localhost/bodmas-master` (or your configured URL)
2. The landing page should display
3. Click "Play Now" to start a game
4. Click "Explore Ranks" to see the leaderboard

## Features

### Game Engine
- **BODMAS/PEMDAS Compliance**: Correctly solves mathematical expressions following the order of operations
- **Multiple Difficulty Levels**: Easy, Medium, Hard (difficulty scales with player level)
- **Step Validation**: Checks each player action against the correct BODMAS order
- **Scoring System**: Points based on speed and accuracy

### Game Modes (Ready to Implement)
- **Classic Mode**: Solve the expression step by step
- **Timed Mode**: Race against the clock
- **Endless Mode**: Infinite problems with increasing difficulty
- **Puzzle Mode**: Rearrange shuffled operators

### Leaderboard
- **Global Rankings**: Top players worldwide
- **Time Filters**: All-time, weekly, daily rankings
- **Personal Statistics**: Track your progress
- **Accuracy Tracking**: Monitor your mistake patterns

### User System
- **Registration & Login**: Secure authentication with password hashing
- **Session Management**: Persistent user sessions
- **Score Tracking**: All game scores saved to database
- **Profile System**: (Ready to implement) User profiles and achievements

## API Endpoints

### Authentication
- `POST /php/register.php` - Register new user
- `POST /php/login.php` - Login user
- `POST /php/logout.php` - Logout user

### Game Data
- `POST /php/save_score.php` - Save game score
- `GET /php/get_leaderboard.php` - Get leaderboard data
- `GET /php/get_question.php` - Get random question (ready to implement)

## Game Logic

### BODMAS Engine (`js/bodmasEngine.js`)

The core of the game is the BODMAS Engine which:
1. **Generates Expressions**: Creates random mathematical expressions based on difficulty
2. **Validates Steps**: Checks if the player selected the correct next operation
3. **Solves Steps**: Evaluates the selected operation and updates the expression
4. **Tracks History**: Records all steps taken to solve the expression

### Key Methods
- `generateExpression(level)` - Create new puzzle
- `getNextOperation()` - Find correct next step
- `validateStep(index)` - Check if selected step is correct
- `solveStep(index)` - Execute a step
- `isSolved()` - Check if puzzle is complete

## Deployment

### On Shared Hosting (InfinityFree, 000webhost, etc.)

1. Create FTP account
2. Upload all files to public_html folder
3. Import database schema using hosting control panel
4. Update database credentials in `php/db.php`
5. Access via your domain

### On Vercel (Frontend only - requires separate backend)
```bash
npm init -y
npm install --save-dev vercel
vercel
```

### On Heroku with PHP Support
```bash
# Create Procfile
echo "web: vendor/bin/heroku-php-apache2 public/" > Procfile

# Deploy
git push heroku main
```

## Customization

### Change Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-purple: #a855f7;
    --accent-cyan: #06b6d4;
    --accent-green: #22c55e;
    /* ... etc */
}
```

### Add More Questions
Edit `database/schema.sql` and add to the `questions` table, or use:
```sql
INSERT INTO questions (expression, difficulty, answer) 
VALUES ('2 * 3 + 4', 'medium', 10);
```

### Change Difficulty Settings
Edit `js/game.js` in the `getDifficulty()` method

### Adjust Scoring
Edit `js/bodmasEngine.js` in the `calculateScore()` method

## Troubleshooting

### Database Connection Error
- Check if MySQL is running
- Verify credentials in `php/db.php`
- Ensure `bodmas_game` database exists
- Check `CREATE` permissions

### Scores Not Saving
- Verify user is logged in (or allow guest scores)
- Check `php/save_score.php` for errors
- Ensure `scores` table exists
- Check file permissions (644 for files, 755 for directories)

### Game Not Loading
- Check browser console for JavaScript errors
- Verify all CSS files are linked correctly
- Clear browser cache
- Check if JavaScript is enabled

### Tiles Not Appearing
- Clear browser cache
- Check if `bodmasEngine.js` is loaded
- Verify DOM elements exist in HTML
- Check browser console for errors

## Performance Optimization

1. **Minify CSS/JS**: Use `cssnano` and `terser`
2. **Enable Compression**: Add gzip to web server
3. **Database Indexes**: Already included in schema
4. **Caching**: Implement query caching in PHP
5. **Lazy Loading**: Load images on demand

## Security

- **Password Hashing**: Using bcrypt (`PASSWORD_BCRYPT`)
- **SQL Injection Prevention**: Using prepared statements
- **XSS Protection**: Using `htmlspecialchars()`
- **CSRF Protection**: (Recommended to add tokens)
- **Session Security**: Implement secure session handling
- **HTTPS**: Use SSL certificate on production

### Production Checklist
- [ ] Use HTTPS
- [ ] Hide error messages
- [ ] Enable `display_errors = Off` in PHP
- [ ] Set strong database passwords
- [ ] Keep software updated
- [ ] Regular backups
- [ ] Use environment variables for sensitive data

## Future Enhancements

- [ ] Multiplayer mode (real-time)
- [ ] Achievement system
- [ ] Daily challenges
- [ ] Mobile app version
- [ ] AI difficulty scaling
- [ ] Sound effects and music
- [ ] Dark/Light theme toggle
- [ ] Replay system
- [ ] Social features (friends, messages)
- [ ] Tournaments and events

## Support & Contribution

For issues or suggestions, please:
1. Check the troubleshooting section above
2. Review the code comments
3. Test in a fresh browser session
4. Clear cache and reload

## License

This project is open source and available for educational and personal use.

## Credits

Built with HTML5, CSS3, JavaScript ES6+, and PHP 7.4+

---

**Happy Playing!** 🎮✨
