import { useQuery } from '@tanstack/react-query';
import {
  AggregatedDataPoint,
  ApiResponse,
  ResponseMetadata,
} from '@analytics-dashboard/shared-types';
import { fetchAnalyticsData } from '@shared/api/analyticsApi';
import { ApiError } from '@shared/api/errors';
import type { ChartFilters } from './useChartFilters';

export interface UseAnalyticsDataReturn {
  data: AggregatedDataPoint[] | undefined;
  metadata: ResponseMetadata | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: ApiError | null;
  refetch: () => void;
}

/**
 * useAnalyticsData hook
 * Fetches aggregated analytics data using React Query
 */
export function useAnalyticsData(filters: ChartFilters): UseAnalyticsDataReturn {
  const { startDate, endDate, aggregationLevel } = filters;

  const isValidFilters = Boolean(
    startDate && endDate && aggregationLevel && new Date(startDate) <= new Date(endDate)
  );

  const query = useQuery<ApiResponse<AggregatedDataPoint[]>, ApiError>({
    queryKey: ['analytics', startDate, endDate, aggregationLevel] as const,
    queryFn: () =>
      fetchAnalyticsData({
        startDate,
        endDate,
        aggregationLevel,
      }),
    enabled: isValidFilters,
  });

  return {
    data: query.data?.data,
    metadata: query.data?.metadata,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
