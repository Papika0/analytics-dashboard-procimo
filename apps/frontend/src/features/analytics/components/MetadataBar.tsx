import { ResponseMetadata } from '@analytics-dashboard/shared-types';

interface MetadataBarProps {
  metadata: ResponseMetadata | undefined;
  isFetching: boolean;
}

export function MetadataBar({ metadata, isFetching }: MetadataBarProps) {
  if (!metadata) {
    return null;
  }

  return (
    <div className="metadata-bar">
      <div className="metadata-item">
        <span className="metadata-label">Data Points</span>
        <span className="metadata-value">{metadata.dataPoints}</span>
      </div>
      <div className="metadata-item">
        <span className="metadata-label">Execution Time</span>
        <span className="metadata-value">{metadata.executionTimeMs}ms</span>
      </div>
      <div className="metadata-item">
        <span className="metadata-label">Cache Status</span>
        <span className={`metadata-value metadata-cache ${metadata.cached ? 'cached' : 'fresh'}`}>
          {metadata.cached ? 'Cached' : 'Fresh'}
        </span>
      </div>
      {isFetching && (
        <div className="metadata-item">
          <span className="metadata-fetching">Refreshing...</span>
        </div>
      )}
    </div>
  );
}
