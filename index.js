const express = require('express');
const fs = require('fs');

const app = express();
const port = 8080;

// Read DB once (sync for simplicity)
const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

// GET all users
app.get('/', (req, res) => {
  res.json(db.users);
});

// GET user by id
app.get('/user/:id', (req, res) => {
  const id = Number(req.params.id);

  const user = db.users.find(item => item.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});