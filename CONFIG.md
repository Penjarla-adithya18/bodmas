# BODMAS Master - Configuration Checklist

Complete this checklist to get your BODMAS Master game fully configured and running.

## 🚀 Quick Setup (5 minutes)

### Step 1: Database Setup ✓
- [ ] MySQL server is installed and running
- [ ] Created `bodmas_game` database
- [ ] Imported `database/schema.sql`
- [ ] Verified tables exist: users, scores, questions, game_sessions
- [ ] Test: Can connect to database with credentials

**Test Command:**
```bash
mysql -u root -p bodmas_game
SHOW TABLES;  # Should show 5 tables
EXIT;
```

### Step 2: PHP Configuration ✓
- [ ] PHP 7.4+ installed
- [ ] Updated `php/db.php` with correct credentials:
  - [ ] DB_HOST: `localhost` (or your MySQL host)
  - [ ] DB_USER: `root` (or your MySQL user)
  - [ ] DB_PASS: `""` (update if you set a password)
  - [ ] DB_NAME: `bodmas_game`
- [ ] Web server (Apache/Nginx) configured
- [ ] File permissions set: 755 for dirs, 644 for files

### Step 3: File Verification ✓
- [ ] All HTML files present:
  - [ ] `index.html`
  - [ ] `game.html`
  - [ ] `leaderboard.html`
- [ ] All CSS files present:
  - [ ] `css/style.css`
  - [ ] `css/animations.css`
  - [ ] `css/game.css`
  - [ ] `css/leaderboard.css`
- [ ] All JS files present:
  - [ ] `js/bodmasEngine.js`
  - [ ] `js/game.js`
  - [ ] `js/leaderboard.js`
  - [ ] `js/api.js`
- [ ] All PHP files present:
  - [ ] `php/db.php`
  - [ ] `php/register.php`
  - [ ] `php/login.php`
  - [ ] `php/save_score.php`
  - [ ] `php/get_leaderboard.php`
  - [ ] `php/logout.php`

### Step 4: Web Server Setup ✓
Choose one:

#### Using XAMPP (Recommended)
- [ ] XAMPP installed
- [ ] Project copied to `htdocs/bodmas-master/`
- [ ] Apache service running
- [ ] MySQL service running
- [ ] Can access: `http://localhost/bodmas-master`

#### Using WAMP
- [ ] WAMP installed
- [ ] Project copied to `www/bodmas-master/`
- [ ] WAMP running
- [ ] Can access: `http://localhost/bodmas-master`

#### Using PHP Built-in Server
- [ ] PHP in PATH
- [ ] Run: `php -S localhost:8000` from project root
- [ ] Can access: `http://localhost:8000`

#### Using Nginx
- [ ] Nginx installed and running
- [ ] Virtual host configured
- [ ] PHP-FPM running
- [ ] Can access: `http://your-domain.com`

### Step 5: Test the Application ✓
- [ ] Landing page loads: `http://localhost/bodmas-master`
- [ ] Navigation menu visible
- [ ] All images/icons display
- [ ] Can click "Play Now" button
- [ ] Game page loads
- [ ] Can click tiles in game
- [ ] Can click "Explore Ranks" button
- [ ] Leaderboard page loads
- [ ] Mock data displays in leaderboard table

## 🔧 Advanced Configuration

### Database Optimization
```sql
-- Add these for better performance
CREATE INDEX idx_user_score ON scores(user_id, score);
CREATE INDEX idx_user_level ON scores(user_id, level);
OPTIMIZE TABLE users;
OPTIMIZE TABLE scores;
```

### Session Configuration
Create `php/session.php` to customize:
```php
<?php
// Session timeout: 30 minutes
ini_set('session.gc_maxlifetime', 1800);
ini_set('session.cookie_lifetime', 1800);
session_start();
?>
```

### CORS Setup (for cross-domain API calls)
Add to `php/db.php`:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### Environment Variables (Optional but recommended)
Create `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=bodmas_game
APP_ENV=development
```

Then update `php/db.php`:
```php
$env = parse_ini_file('.env');
define('DB_HOST', $env['DB_HOST']);
// etc...
```

## 🔒 Security Hardening

### Production Checklist
- [ ] Set `display_errors = Off` in php.ini
- [ ] Enable HTTPS (SSL certificate)
- [ ] Update database credentials (strong password)
- [ ] Change MySQL root password
- [ ] Disable directory listing in `.htaccess` ✓ (already done)
- [ ] Hide `.env` file from web access
- [ ] Enable firewall rules
- [ ] Regular backups enabled
- [ ] Add CSRF tokens to forms
- [ ] Implement rate limiting
- [ ] Add API key authentication
- [ ] Use prepared statements (already done) ✓
- [ ] Validate all user input
- [ ] Sanitize output (already done) ✓

### Add HTTPS
```apache
# In .htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

## 📊 Performance Optimization

### Enable Gzip Compression
- [ ] Verify in `.htaccess` ✓ (already configured)
- [ ] Test: Visit site, check headers for `Content-Encoding: gzip`

### Minify Assets
```bash
# Install tools
npm install -g cssnano terser

# Minify CSS
cssnano css/style.css -o css/style.min.css

# Minify JS
terser js/game.js -o js/game.min.js
```

### Database Indexing
- [ ] Check indexes exist (see schema.sql) ✓
- [ ] Add more if needed based on query patterns

### Caching
```php
// In php files, add caching headers
header('Cache-Control: public, max-age=3600');
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 3600) . ' GMT');
```

## 🧪 Testing Checklist

### Functional Tests
- [ ] User can register
- [ ] User can login
- [ ] User can play game
- [ ] Score saves correctly
- [ ] Leaderboard updates
- [ ] Can navigate between pages
- [ ] Can logout

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### Responsive Design
- [ ] Desktop (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Test on actual devices

### Performance
- [ ] Page load time < 3s
- [ ] Game responsive to clicks
- [ ] No console errors
- [ ] Animations smooth (60 FPS)

## 🐛 Debugging Tips

### Check Database Connection
```php
// Add to any PHP file
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Database connected successfully!";
```

### Check Session
```php
session_start();
echo '<pre>';
print_r($_SESSION);
echo '</pre>';
```

### JavaScript Debugging
Open browser DevTools (F12):
- [ ] Check Console tab for errors
- [ ] Check Network tab for failed requests
- [ ] Check Application tab for localStorage
- [ ] Check Elements tab for DOM structure

### Enable Error Logging
In `php/db.php`:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');
```

## 📝 Configuration Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `php/db.php` | Database connection | Must configure |
| `.htaccess` | Web server config | Ready ✓ |
| `database/schema.sql` | Database schema | Must import |
| `README.md` | Project documentation | Ready ✓ |
| `SETUP.md` | Setup guide | Ready ✓ |
| `CONFIG.md` | This file | Ready ✓ |

## 🚀 Next Steps After Configuration

1. **Customization**
   - [ ] Change colors in `css/style.css`
   - [ ] Add your logo/branding
   - [ ] Customize game difficulty
   - [ ] Add more questions to database

2. **Features**
   - [ ] Implement additional game modes
   - [ ] Add user profile pages
   - [ ] Create achievement system
   - [ ] Add sound effects

3. **Deployment**
   - [ ] Set up hosting account
   - [ ] Configure domain
   - [ ] Upload files via FTP
   - [ ] Update `php/db.php` for production
   - [ ] Enable HTTPS
   - [ ] Set up backups

4. **Monitoring**
   - [ ] Set up error logging
   - [ ] Monitor database performance
   - [ ] Track user metrics
   - [ ] Monitor server resources

## 💾 Backup Strategy

### Regular Backups (Recommended)
```bash
# Backup database
mysqldump -u root -p bodmas_game > bodmas_backup.sql

# Backup files
tar -czf bodmas_files.tar.gz /path/to/project

# Combined backup
tar -czf bodmas_complete_$(date +%Y%m%d).tar.gz /path/to/project bodmas_backup.sql
```

### Automated Backup (Cron)
```bash
# Add to crontab
0 2 * * * /usr/bin/mysqldump -u root -p bodmas_game > /backups/bodmas_$(date +\%Y\%m\%d).sql
0 3 * * * tar -czf /backups/bodmas_files_$(date +\%Y\%m\%d).tar.gz /path/to/project
```

## ✅ Final Verification

Before going live:
- [ ] All configuration complete
- [ ] Database accessible
- [ ] All files in place
- [ ] Tests passing
- [ ] Backups enabled
- [ ] Security hardened
- [ ] Performance optimized
- [ ] Error logging enabled
- [ ] HTTPS enabled (production)
- [ ] Ready to launch! 🚀

---

**Last Updated**: 2024
**Configuration Status**: Ready for Production
**Support**: See SETUP.md and README.md for troubleshooting
