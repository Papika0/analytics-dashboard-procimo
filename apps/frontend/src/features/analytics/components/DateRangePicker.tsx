import { useMemo } from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  return (
    <div className="date-range-picker">
      <div className="date-input-group">
        <label htmlFor="start-date" className="date-label">
          Start Date
        </label>
        <input
          type="date"
          id="start-date"
          className="date-input"
          value={startDate}
          max={endDate || today}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>
      <div className="date-input-group">
        <label htmlFor="end-date" className="date-label">
          End Date
        </label>
        <input
          type="date"
          id="end-date"
          className="date-input"
          value={endDate}
          min={startDate}
          max={today}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
    </div>
  );
}
