import { QueryProvider } from './providers/QueryProvider';
import AnalyticsDashboard from '@pages/AnalyticsDashboard';

function App() {
  return (
    <QueryProvider>
      <AnalyticsDashboard />
    </QueryProvider>
  );
}

export default App;
