# ⚡ BODMAS Master - Quick Start (5 Minutes)

## 🎯 Get Running in 5 Minutes

### Step 1: Database (2 minutes)

**Option A: phpMyAdmin (Easiest)**
1. Open `http://localhost/phpmyadmin`
2. Click "New Database"
3. Type: `bodmas_game` → Click "Create"
4. Click "Import" tab
5. Upload: `database/schema.sql`
6. Click "Import"
✅ Done!

**Option B: Command Line**
```bash
mysql -u root -p < database/schema.sql
```

**Option C: Manual SQL**
1. Open MySQL client
2. Copy-paste content from `database/schema.sql`
3. Execute

### Step 2: Web Server (1 minute)

**Using XAMPP (Recommended)**
```
1. Copy project to: C:\xampp\htdocs\bodmas-master\
2. Start XAMPP → Start Apache & MySQL
3. Open: http://localhost/bodmas-master
```

**Using PHP Server**
```bash
cd bodmas-master
php -S localhost:8000
# Open: http://localhost:8000
```

**Using Terminal**
```bash
# Just copy files to your web root
# Update php/db.php with your credentials
# Start your web server
```

### Step 3: Verify Configuration (2 minutes)

**Check Database:**
1. Open `php/db.php`
2. Verify these settings:
```php
DB_HOST = 'localhost'    // ← Your MySQL host
DB_USER = 'root'         // ← Your MySQL user
DB_PASS = ''             // ← Your MySQL password
DB_NAME = 'bodmas_game'  // ← Database name
```

**Check Web Access:**
- Open: `http://localhost/bodmas-master` (or your URL)
- Should see: Landing page with BODMAS Master logo
- Click buttons should work
- No error messages

### Step 4: Play! (Instant)

1. Click "Play Now"
2. Solve the expression by clicking operators
3. Watch points accumulate!
4. Click "Explore Ranks" to see leaderboard

✅ **You're Done!** 🎉

---

## 🎮 How to Play

```
Expression: 2 + 3 * 4
           
Step 1: Click * (multiply has priority)
       Result: 2 + 12
       
Step 2: Click + (then addition)
       Result: 14
       
✓ Complete! Score: 150 points
```

---

## 🔧 Customization (Optional)

### Change Colors
Edit `css/style.css` line 5:
```css
:root {
    --primary-purple: #a855f7;    /* Change this */
    --accent-cyan: #06b6d4;       /* Change this */
    --accent-green: #22c55e;      /* Change this */
}
```

### Change Game Difficulty
Edit `js/game.js` line ~85:
```javascript
getDifficulty() {
    if (this.level <= 3) return 'easy';      // Easy up to level 3
    if (this.level <= 6) return 'medium';    // Medium 4-6
    return 'hard';                           // Hard 7+
}
```

### Add More Questions
Edit `database/schema.sql` find "Sample Questions" section and add:
```sql
INSERT INTO questions (expression, difficulty, answer) 
VALUES ('5 * (2 + 3)', 'medium', 25);
```

---

## ✅ Troubleshooting

### "Connection refused" / "Database error"
**Fix:** Check `php/db.php`
```php
// Make sure these match your setup
DB_HOST = 'localhost'  // Try: 127.0.0.1
DB_USER = 'root'       // Try: your username
DB_PASS = ''           // Try: your password
```

### Page shows "Cannot GET /index.html"
**Fix:** Wrong web server
- Use XAMPP → Start Apache
- Or: `php -S localhost:8000`
- Or: Verify your web server is running

### No tiles appear in game
**Fix:** Clear browser cache
- Press: Ctrl+Shift+Del (or Cmd+Shift+Del on Mac)
- Clear all cache
- Refresh page

### Scores not saving
**Fix:** Session issue
- Make sure browser accepts cookies
- Clear cookies and try again
- Check php/db.php credentials

---

## 📁 File Checklist

Before playing, verify these files exist:

**HTML Pages:**
- [ ] `index.html`
- [ ] `game.html`
- [ ] `leaderboard.html`

**CSS Files:**
- [ ] `css/style.css`
- [ ] `css/animations.css`
- [ ] `css/game.css`
- [ ] `css/leaderboard.css`

**JavaScript Files:**
- [ ] `js/bodmasEngine.js`
- [ ] `js/game.js`
- [ ] `js/leaderboard.js`
- [ ] `js/api.js`

**PHP Files:**
- [ ] `php/db.php` ← Edit this!
- [ ] `php/register.php`
- [ ] `php/login.php`
- [ ] `php/save_score.php`
- [ ] `php/get_leaderboard.php`
- [ ] `php/logout.php`

**Database:**
- [ ] `database/schema.sql` ← Import this!

---

## 🚀 Next Steps

### Customize (10 minutes)
1. Edit `css/style.css` - change colors
2. Edit `js/game.js` - change difficulty
3. Add questions to database

### Deploy (30 minutes)
1. Get hosting account (Hostinger, Bluehost, etc.)
2. Upload files via FTP
3. Create database via control panel
4. Update `php/db.php`
5. Access via your domain

### Add Features (Variable)
- [ ] User registration form
- [ ] Login/logout UI
- [ ] Sound effects
- [ ] Dark mode toggle
- [ ] Mobile app

---

## 🎓 Understanding the Game

### The Math Engine

The **BODMAS Engine** (`js/bodmasEngine.js`) follows this order:

```
B = Brackets ( )
O = Orders (powers, roots)
D/M = Division / Multiplication (left to right)
A/S = Addition / Subtraction (left to right)
```

Example:
```
Expression: 2 + 3 * 4 - (5 - 1)

Order of operations:
1. (5 - 1) = 4      [Brackets first]
2. 3 * 4 = 12       [Multiplication before addition]
3. 2 + 12 = 14      [Addition left to right]
4. 14 - 4 = 10      [Subtraction last]

Final answer: 10
```

Your job: **Click the operators in the correct order!**

---

## 💡 Tips for Better Scores

1. **Remember BODMAS**: Brackets → Multiplication/Division → Addition/Subtraction
2. **Be Accurate**: Mistakes reduce score
3. **Be Fast**: Faster solve = higher score
4. **Use Hints**: You get 3 free hints per level
5. **Watch Patterns**: Easy problems have 1-3 steps, hard ones have more

---

## 📊 File Sizes

```
CSS Total:        ~1.5 MB (4 files)
JavaScript Total: ~1.2 MB (4 files)
PHP Total:        ~0.5 MB (6 files)
HTML Total:       ~0.3 MB (3 files)
Database SQL:     ~0.15 MB (1 file)
───────────────────────────
Total:           ~3.7 MB
```

All files load instantly! ⚡

---

## 🎯 Success Checklist

After setup, you should be able to:

- [ ] See landing page
- [ ] Click "Play Now"
- [ ] See game board
- [ ] Click tiles
- [ ] See score increase
- [ ] Complete a puzzle
- [ ] See final score
- [ ] Click "Explore Ranks"
- [ ] See leaderboard
- [ ] Go back home

If all ✓, **you're ready to play!** 🚀

---

## 📞 Getting Help

### If something doesn't work:

1. **Check SETUP.md** - Full setup guide
2. **Check CONFIG.md** - Configuration checklist
3. **Check console** - Open DevTools (F12)
4. **Check errors** - Look in php/db.php for connection errors
5. **Google it** - Most issues have solutions online

### Common Issues:

| Problem | Solution |
|---------|----------|
| Can't connect to database | Check credentials in php/db.php |
| Page won't load | Start your web server (XAMPP/PHP) |
| No tiles appear | Clear cache (Ctrl+Shift+Del) |
| Scores don't save | Enable cookies, check permissions |
| Game looks broken | Update browser, clear cache |

---

## 🎉 You're All Set!

```
┌─────────────────────────┐
│  BODMAS Master Ready!   │
│  • Database: ✓         │
│  • Files: ✓           │
│  • Server: ✓          │
│  • Config: ✓          │
│                       │
│  🎮 Start Playing!    │
└─────────────────────────┘
```

**Next:** Open your browser and visit the URL!

**Questions?** Read:
- README.md - Overview
- SETUP.md - Detailed guide
- CONFIG.md - Configuration help

---

**Happy Gaming!** 🎮✨

*Master the Math. Own the Order.*
