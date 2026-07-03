require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Smart Constituency Backend is running successfully.',
    app: 'JanAwaaz',
    status: 'ok'
  });
});

app.use('/api', apiRoutes);

const frontendPath = path.join(__dirname, '..', 'Frontend');
app.use(express.static(frontendPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, () => {
  console.log(`JanAwaaz server is running on http://${HOST}:${PORT}`);
});
