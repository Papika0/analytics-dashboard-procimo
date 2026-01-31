import { Router } from 'express';
import {
  AggregationLevel,
  AggregatedDataPoint,
  AnalyticsQueryParams,
} from '@analytics-dashboard/shared-types';
import { validateQuery } from '../middlewares/validateQuery';
import { analyticsQuerySchema } from '../validators/analyticsQuerySchema';
import { MockDataGenerator } from '../../data-generators/MockDataGenerator';
import { InMemoryCache } from '../../cache/InMemoryCache';
import { AggregationService } from '../../../services/aggregation.service';
import { CacheKeyGenerator } from '@shared/utils/cacheKeyGenerator';
import { DateUtils } from '@shared/utils/dateUtils';

const router = Router();

// Initialize singleton instances
const dataGenerator = MockDataGenerator.getInstance();
const cache = new InMemoryCache();

/**
 * GET /api/data
 * Main analytics endpoint
 * Implements cache-aside pattern with deterministic cache keys
 */
router.get('/data', validateQuery(analyticsQuerySchema), async (req, res, next) => {
  const startTime = Date.now();

  try {
    const query = req.query as unknown as AnalyticsQueryParams;
    const { startDate, endDate, aggregationLevel } = query;

    // Generate cache key from all query parameters
    const cacheKey = CacheKeyGenerator.generate(query);

    // Check cache first (cache-aside pattern)
    const cachedResult = cache.get<AggregatedDataPoint[]>(cacheKey);

    if (cachedResult) {
      // Cache hit - return cached data
      const executionTime = Date.now() - startTime;

      res.json({
        success: true,
        data: cachedResult,
        metadata: {
          cached: true,
          executionTimeMs: executionTime,
          dataPoints: cachedResult.length,
          dateRange: { start: startDate, end: endDate },
          aggregationLevel,
        },
      });
      return;
    }

    // Cache miss - perform aggregation
    const events = dataGenerator.getEvents();
    const parsedStartDate = DateUtils.parseDate(startDate);
    const parsedEndDate = DateUtils.parseDate(endDate);

    // Aggregate data
    const aggregatedData = AggregationService.aggregate(
      events,
      parsedStartDate,
      parsedEndDate,
      aggregationLevel as AggregationLevel
    );

    // Store in cache for future requests
    cache.set(cacheKey, aggregatedData);

    const executionTime = Date.now() - startTime;

    res.json({
      success: true,
      data: aggregatedData,
      metadata: {
        cached: false,
        executionTimeMs: executionTime,
        dataPoints: aggregatedData.length,
        dateRange: { start: startDate, end: endDate },
        aggregationLevel,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Export cache and dataGenerator for health routes
export { router as analyticsRoutes, cache, dataGenerator };
