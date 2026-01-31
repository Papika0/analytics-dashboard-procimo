import { QueryProvider } from './providers/QueryProvider';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import AnalyticsDashboard from '@pages/AnalyticsDashboard';

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AnalyticsDashboard />
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
