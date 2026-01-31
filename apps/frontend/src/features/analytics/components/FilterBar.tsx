import { AggregationLevel } from '@analytics-dashboard/shared-types';
import { DateRangePicker } from './DateRangePicker';
import { AggregationSelect } from './AggregationSelect';

interface FilterBarProps {
  startDate: string;
  endDate: string;
  aggregationLevel: AggregationLevel;
  isDebouncing: boolean;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onAggregationChange: (level: AggregationLevel) => void;
}

export function FilterBar({
  startDate,
  endDate,
  aggregationLevel,
  isDebouncing,
  onStartDateChange,
  onEndDateChange,
  onAggregationChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
      <AggregationSelect value={aggregationLevel} onChange={onAggregationChange} />
      {isDebouncing && (
        <div className="filter-bar-status">
          <span className="debounce-indicator" />
          <span className="debounce-text">Updating...</span>
        </div>
      )}
    </div>
  );
}
