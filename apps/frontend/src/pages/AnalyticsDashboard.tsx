import { useChartFilters } from '@features/analytics/hooks/useChartFilters';
import { useAnalyticsData } from '@features/analytics/hooks/useAnalyticsData';
import { FilterBar } from '@features/analytics/components/FilterBar';
import { MetadataBar } from '@features/analytics/components/MetadataBar';
import { AnalyticsChart } from '@features/analytics/components/AnalyticsChart';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { ErrorMessage } from '@shared/components/ErrorMessage';
import '@features/analytics/styles/analytics.css';

function AnalyticsDashboard() {
  const { filters, debouncedFilters, setStartDate, setEndDate, setAggregationLevel, isDebouncing } =
    useChartFilters();

  const { data, metadata, isLoading, isFetching, error, refetch } =
    useAnalyticsData(debouncedFilters);

  /**
   * Render error content with proper error details
   */
  const renderError = () => {
    if (!error) return null;

    const title = error.getTitle?.() || 'Failed to load data';
    const message = error.message || 'An unexpected error occurred';
    const details = error.getFormattedDetails?.() || [];

    return (
      <ErrorMessage
        title={title}
        message={message}
        details={details.length > 0 ? details : undefined}
        onRetry={refetch}
      />
    );
  };

  return (
    <div className="analytics-dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Analytics Dashboard</h1>
        <p className="dashboard-description">Sales data visualization and analytics</p>
      </header>

      <main className="dashboard-content">
        <FilterBar
          startDate={filters.startDate}
          endDate={filters.endDate}
          aggregationLevel={filters.aggregationLevel}
          isDebouncing={isDebouncing}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onAggregationChange={setAggregationLevel}
        />

        <MetadataBar metadata={metadata} isFetching={isFetching} />

        <section className="dashboard-chart-section">
          {isLoading ? (
            <LoadingSpinner size="large" message="Loading analytics data..." />
          ) : error ? (
            renderError()
          ) : (
            <AnalyticsChart data={data || []} />
          )}
        </section>
      </main>
    </div>
  );
}

export default AnalyticsDashboard;
