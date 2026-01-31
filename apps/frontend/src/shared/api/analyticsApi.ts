import {
  AnalyticsQueryParams,
  ApiResponse,
  AggregatedDataPoint,
} from '@analytics-dashboard/shared-types';
import { apiClient } from './client';

/**
 * Fetch aggregated analytics data from the backend
 */
export async function fetchAnalyticsData(
  params: AnalyticsQueryParams
): Promise<ApiResponse<AggregatedDataPoint[]>> {
  const response = await apiClient.get<ApiResponse<AggregatedDataPoint[]>>('/api/data', {
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
      aggregationLevel: params.aggregationLevel,
    },
  });

  return response.data;
}
