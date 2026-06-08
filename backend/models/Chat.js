const db = require('../config/db');

// Message save karna (specific user ke liye)
async function saveMessage(userId, role, content) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)',
      [userId, role, content],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// Chat history lena (specific user ki)
async function getChatHistory(userId, limit = 50) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT role, content, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp ASC LIMIT ?',
      [userId, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// History clear karna (specific user ki)
async function clearHistory(userId) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM messages WHERE user_id = ?', [userId], function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

module.exports = {
  saveMessage,
  getChatHistory,
  clearHistory
};