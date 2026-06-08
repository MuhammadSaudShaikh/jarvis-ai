const db = require('../config/db');
const bcrypt = require('bcryptjs');

// User find karna by username
function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// User find karna by ID
function findUserById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, username, created_at FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Naya user create karna
async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, username });
      }
    );
  });
}

// Password verify karna (login ke waqt)
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  findUserByUsername,
  findUserById,
  createUser,
  verifyPassword
};