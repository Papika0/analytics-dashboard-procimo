import { AggregationLevel, isValidAggregationLevel } from '@analytics-dashboard/shared-types';

interface AggregationSelectProps {
  value: AggregationLevel;
  onChange: (level: AggregationLevel) => void;
}

const AGGREGATION_OPTIONS = [
  { value: AggregationLevel.DAILY, label: 'Daily' },
  { value: AggregationLevel.WEEKLY, label: 'Weekly' },
  { value: AggregationLevel.MONTHLY, label: 'Monthly' },
];

export function AggregationSelect({ value, onChange }: AggregationSelectProps) {
  return (
    <div className="aggregation-select">
      <label htmlFor="aggregation-level" className="aggregation-label">
        Aggregation
      </label>
      <select
        id="aggregation-level"
        className="aggregation-dropdown"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          if (isValidAggregationLevel(val)) {
            onChange(val);
          }
        }}
      >
        {AGGREGATION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
