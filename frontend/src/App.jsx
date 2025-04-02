import { useState, useEffect } from 'react';
import './App.css';

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
    </div>
  );
}

export default App;