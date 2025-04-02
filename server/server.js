const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Simulated issues
const issues = [
  { id: 1, os: 'Windows', description: 'OS crashed - Blue Screen of Death', steps: ['Restart PC', 'Update drivers', 'Run system diagnostics'] },
  { id: 2, os: 'Mac', description: 'Printer not responding', steps: ['Check printer connection', 'Restart printer', 'Reinstall driver'] },
  { id: 3, os: 'iOS', description: 'Network drop on iPad', steps: ['Toggle Wi-Fi', 'Restart device', 'Reset network settings'] },
];

// JSON file to store analytics
const analyticsFile = path.join(__dirname, 'analytics.json');
if (!fs.existsSync(analyticsFile)) {
  fs.writeFileSync(analyticsFile, JSON.stringify([]));
}

// Get random issue
app.get('/api/issue', (req, res) => {
  const randomIssue = issues[Math.floor(Math.random() * issues.length)];
  res.json(randomIssue);
});

// Log resolution
app.post('/api/resolve', (req, res) => {
  const { issueId, resolutionTime } = req.body;
  const analytics = JSON.parse(fs.readFileSync(analyticsFile));
  analytics.push({ issueId, resolutionTime, timestamp: new Date() });
  fs.writeFileSync(analyticsFile, JSON.stringify(analytics));
  res.sendStatus(200);
});

// Get analytics
app.get('/api/analytics', (req, res) => {
  const analytics = JSON.parse(fs.readFileSync(analyticsFile));
  res.json(analytics);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));