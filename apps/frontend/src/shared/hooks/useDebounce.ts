import { useState, useEffect } from 'react';
import { config } from '@shared/constants/config';

/**
 * useDebounce hook
 * Delays updating a value until after a specified delay has passed
 * since the last change. Useful for preventing excessive API calls.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (defaults to config.debounceDelay)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = config.debounceDelay): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
