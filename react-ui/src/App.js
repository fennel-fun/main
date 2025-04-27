import { Routes, Route, Link } from 'react-router-dom';
import GPTLogs from './GPTLogs';
import Ask from './Ask';

function App() {
  return (
      <div style={{ padding: '2rem' }}>
        <nav style={{ marginBottom: '2rem' }}>
          <Link to="/gpt-logs" style={{ marginRight: '1rem' }}>📊 View Logs</Link>
          <Link to="/ask">📝 Ask Fennel</Link>
        </nav>
        <Routes>
          <Route path="/gpt-logs" element={<GPTLogs />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="*" element={<Ask />} /> {/* default page */}
        </Routes>
      </div>
  );
}

export default App;
