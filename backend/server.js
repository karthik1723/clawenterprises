const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const db = new sqlite3.Database('./database.sqlite');
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      description TEXT,
      status TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    req.user = user;
    next();
  });
};

// Register
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  stmt.run(username, hashedPassword, (err) => {
    if (err) return res.status(500).json({ message: 'User registration failed.' });
    res.status(200).json({ message: 'User registered successfully.' });
  });
  stmt.finalize();
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(404).json({ auth: false, message: 'User not found.' });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ auth: false, message: 'Invalid password.' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 }); // 24 hours
    res.status(200).json({ auth: true, token: token });
  });
});

// CRUD for Todos
app.post('/todos', authenticateToken, (req, res) => {
  const { description, status } = req.body;
  const userId = req.user.id;

  const stmt = db.prepare('INSERT INTO todos (user_id, description, status) VALUES (?, ?, ?)');
  stmt.run(userId, description, status, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to create to-do item.' });
    res.status(200).json({ message: 'To-do item created successfully.' });
  });
  stmt.finalize();
});

app.get('/todos', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all('SELECT * FROM todos WHERE user_id = ?', [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch to-do items.' });
    res.status(200).json(rows);
  });
});

app.put('/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { description, status } = req.body;
  const userId = req.user.id;

  const stmt = db.prepare('UPDATE todos SET description = ?, status = ? WHERE id = ? AND user_id = ?');
  stmt.run(description, status, id, userId, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update to-do item.' });
    res.status(200).json({ message: 'To-do item updated successfully.' });
  });
  stmt.finalize();
});

app.delete('/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
  stmt.run(id, userId, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete to-do item.' });
    res.status(200).json({ message: 'To-do item deleted successfully.' });
  });
  stmt.finalize();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
