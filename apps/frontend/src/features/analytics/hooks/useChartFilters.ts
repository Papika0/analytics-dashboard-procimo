import { useState, useMemo } from 'react';
import { AggregationLevel, AnalyticsQueryParams } from '@analytics-dashboard/shared-types';
import { useDebounce } from '@shared/hooks/useDebounce';
import { format, subMonths } from 'date-fns';

export interface ChartFilters extends AnalyticsQueryParams {
  startDate: string;
  endDate: string;
  aggregationLevel: AggregationLevel;
}

export interface UseChartFiltersReturn {
  filters: ChartFilters;
  debouncedFilters: ChartFilters;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setAggregationLevel: (level: AggregationLevel) => void;
  isDebouncing: boolean;
}

/**
 * Default date range: last 3 months
 */
function getDefaultDateRange(): { startDate: string; endDate: string } {
  const today = new Date();
  const threeMonthsAgo = subMonths(today, 3);

  return {
    startDate: format(threeMonthsAgo, 'yyyy-MM-dd'),
    endDate: format(today, 'yyyy-MM-dd'),
  };
}

/**
 * useChartFilters hook
 * Manages filter state with integrated debouncing for API optimization
 */
export function useChartFilters(): UseChartFiltersReturn {
  const defaultRange = useMemo(() => getDefaultDateRange(), []);

  const [startDate, setStartDate] = useState<string>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<string>(defaultRange.endDate);
  const [aggregationLevel, setAggregationLevel] = useState<AggregationLevel>(
    AggregationLevel.DAILY
  );

  const filters: ChartFilters = useMemo(
    () => ({
      startDate,
      endDate,
      aggregationLevel,
    }),
    [startDate, endDate, aggregationLevel]
  );

  const debouncedFilters = useDebounce(filters);

  const isDebouncing = useMemo(
    () =>
      filters.startDate !== debouncedFilters.startDate ||
      filters.endDate !== debouncedFilters.endDate ||
      filters.aggregationLevel !== debouncedFilters.aggregationLevel,
    [filters, debouncedFilters]
  );

  return {
    filters,
    debouncedFilters,
    setStartDate,
    setEndDate,
    setAggregationLevel,
    isDebouncing,
  };
}
