import { useState, useEffect } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2'; // Add Chart.js import
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); // Register Chart.js components

function App() {
  const [issue, setIssue] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);

  // Fetch a new issue
  const fetchIssue = async () => {
    const res = await fetch('/api/issue');
    const data = await res.json();
    setIssue(data);
    setStartTime(Date.now());
    setStepIndex(0);
  };

  // Resolve the issue
  const resolveIssue = async () => {
    if (!issue || !startTime) return;
    const resolutionTime = Math.floor((Date.now() - startTime) / 1000); // Seconds
    await fetch('/api/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issueId: issue.id, resolutionTime }),
    });
    setIssue(null);
    fetchAnalytics();
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    const res = await fetch('/api/analytics');
    const data = await res.json();
    setAnalytics(data);
  };

  // Next troubleshooting step
  const nextStep = () => {
    if (stepIndex < issue.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      resolveIssue();
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Chart logic: Calculate OS frequency
  const osFrequency = analytics.reduce((acc, { issueId }) => {
    const os = issues.find(i => i.id === issueId)?.os || 'Unknown';
    acc[os] = (acc[os] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(osFrequency),
    datasets: [{ label: 'Issue Frequency', data: Object.values(osFrequency), backgroundColor: '#007bff' }],
  };

  return (
    <div className="App">
      <h1>Desktop Support Simulator</h1>

      {/* Issue Section */}
      <div className="section">
        <h2>Current Issue</h2>
        {!issue ? (
          <button onClick={fetchIssue}>Generate New Issue</button>
        ) : (
          <div>
            <p><strong>OS:</strong> {issue.os}</p>
            <p><strong>Issue:</strong> {issue.description}</p>
            <p><strong>Severity:</strong> {issue.severity}</p>
            <p><strong>Step {stepIndex + 1}:</strong> {issue.steps[stepIndex]}</p>
            <button onClick={nextStep}>
              {stepIndex === issue.steps.length - 1 ? 'Resolve' : 'Next Step'}
            </button>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="section">
        <h2>Analytics Dashboard</h2>
        {analytics.length === 0 ? (
          <p>No issues resolved yet.</p>
        ) : (
          <ul>
            {analytics.map((entry, idx) => (
              <li key={idx}>
                Issue #{entry.issueId} resolved in {entry.resolutionTime} seconds on{' '}
                {new Date(entry.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* New Chart Section */}
      <div className="section">
        <h2>Issue Frequency by OS</h2>
        {analytics.length === 0 ? (
          <p>No data available for chart yet.</p>
        ) : (
          <Bar data={chartData} />
        )}
      </div>
    </div>
  );
}

// Define issues locally (since backend reference isn’t available in frontend)
const issues = [
  { id: 1, os: 'Windows', description: 'OS crashed - Blue Screen of Death', steps: ['Restart PC', 'Update drivers', 'Run system diagnostics'], severity: 'critical' },
  { id: 2, os: 'Mac', description: 'Printer not responding', steps: ['Check printer connection', 'Restart printer', 'Reinstall driver'], severity: 'medium' },
  { id: 3, os: 'iOS', description: 'Network drop on iPad', steps: ['Toggle Wi-Fi', 'Restart device', 'Reset network settings'], severity: 'low' },
];

export default App;