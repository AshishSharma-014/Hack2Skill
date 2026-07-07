require('dotenv').config();
const fs = require('fs');
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

const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot, { index: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(projectRoot, 'index.html'));
});

app.get('/:page', (req, res, next) => {
  const requestedPage = req.params.page;

  if (requestedPage.includes('.')) {
    return next();
  }

  const candidatePath = path.join(projectRoot, `${requestedPage}.html`);
  if (fs.existsSync(candidatePath)) {
    return res.sendFile(candidatePath);
  }

  next();
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, () => {
  console.log(`JanAwaaz server is running on http://${HOST}:${PORT}`);
});
