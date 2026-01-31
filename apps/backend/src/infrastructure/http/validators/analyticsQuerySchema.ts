import { z } from 'zod';
import { AggregationLevel } from '@analytics-dashboard/shared-types';
import { DateUtils } from '@shared/utils/dateUtils';

/**
 * Zod schema for analytics query parameters validation
 * Provides runtime type safety and detailed error messages
 */
export const analyticsQuerySchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
      .refine((date) => DateUtils.isValidDateString(date), {
        message: 'Start date must be a valid date',
      }),

    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
      .refine((date) => DateUtils.isValidDateString(date), {
        message: 'End date must be a valid date',
      }),

    aggregationLevel: z.nativeEnum(AggregationLevel, {
      errorMap: () => ({
        message: `Aggregation level must be one of: ${Object.values(AggregationLevel).join(', ')}`,
      }),
    }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: 'Start date must be before or equal to end date',
      path: ['startDate'],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const days = DateUtils.daysBetween(start, end);
      return days <= 730; // 2 years max
    },
    {
      message: 'Date range cannot exceed 2 years',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      const end = new Date(data.endDate);
      return end <= new Date();
    },
    {
      message: 'End date cannot be in the future',
      path: ['endDate'],
    }
  );

export type ValidatedAnalyticsQuery = z.infer<typeof analyticsQuerySchema>;
