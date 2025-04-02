const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const issues = [
  { id: 1, os: 'Windows', description: 'OS crashed - Blue Screen of Death', steps: ['Restart PC', 'Update drivers', 'Run system diagnostics'], severity: 'critical' },
  { id: 2, os: 'Mac', description: 'Printer not responding', steps: ['Check printer connection', 'Restart printer', 'Reinstall driver'], severity: 'medium' },
  { id: 3, os: 'iOS', description: 'Network drop on iPad', steps: ['Toggle Wi-Fi', 'Restart device', 'Reset network settings'], severity: 'low' },
  { id: 4, os: 'Windows', description: 'Azure VDI login failure', steps: ['Check credentials', 'Verify VPN', 'Contact IT admin'], severity: 'high' },
];

const analyticsFile = path.join(__dirname, 'analytics.json');
if (!fs.existsSync(analyticsFile)) {
  fs.writeFileSync(analyticsFile, JSON.stringify([]));
}

app.get('/api/issue', (req, res) => {
  const randomIssue = issues[Math.floor(Math.random() * issues.length)];
  res.json(randomIssue);
});

app.post('/api/resolve', (req, res) => {
  const { issueId, resolutionTime, stepTimes } = req.body; // Add stepTimes
  const analytics = JSON.parse(fs.readFileSync(analyticsFile));
  analytics.push({ issueId, resolutionTime, stepTimes, timestamp: new Date() });
  fs.writeFileSync(analyticsFile, JSON.stringify(analytics));
  res.sendStatus(200);
});

app.get('/api/analytics', (req, res) => {
  const analytics = JSON.parse(fs.readFileSync(analyticsFile));
  res.json(analytics);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));