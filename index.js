const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./schema');

dotenv.config();

const app = express();
const port = 3010;

mongoose.connect(process.env.mongoURI)
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Database connection error:', err));

app.use(express.static('static'));

// POST endpoint to create user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: `Validation error: ${error.message}` });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


