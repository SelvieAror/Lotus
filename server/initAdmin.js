require('dotenv').config(); // Load environment variables if needed
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, 'database.db'),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error('Could not connect to SQLite database:', err.message);
      process.exit(1);
    } else {
      console.log('Connected to SQLite database.');
    }
  }
);

const adminEmail = 'admin@gmail.com';
const adminName  = 'Admin User';
const adminPasswordPlain = 'admin123'; // Change this to your desired admin password

// Hash the password before storing it
bcrypt.hash(adminPasswordPlain, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  
  // Insert admin only if not already present
  const sql = `INSERT OR IGNORE INTO users (name, email, password, role)
                VALUES (?, ?, ?, 'admin')`;
  db.run(sql, [adminName, adminEmail, hashedPassword], function (err) {
    if (err) {
      console.error('Error inserting admin user:', err.message);
      process.exit(1);
    }
    if (this.changes > 0) {
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
    db.close();
  });
});
