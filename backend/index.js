const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./auth');
const userRoutes = require('./users');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
