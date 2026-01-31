# Analytics Dashboard

A full-stack analytics dashboard application for visualizing aggregated sales data with server-side caching and client-side performance optimizations.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, Zod, node-cache
- **Frontend:** React 18, TypeScript, Vite, TanStack Query, Recharts
- **Shared:** TypeScript types package (monorepo)
- **Containerization:** Docker, Docker Compose

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional)

### Local Development

```bash
# Install dependencies
npm install

# Start both backend and frontend
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

## Project Structure

```
analytics-dashboard-procimo/
├── apps/
│   ├── backend/          # Express API server
│   └── frontend/         # React SPA
├── packages/
│   └── shared-types/     # Shared TypeScript types
├── docker-compose.yml
└── package.json          # Workspace root
```

## API Endpoints

### GET /api/data

Retrieves aggregated analytics data.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | Yes | Start date (YYYY-MM-DD) |
| endDate | string | Yes | End date (YYYY-MM-DD) |
| aggregationLevel | string | Yes | `daily`, `weekly`, or `monthly` |

**Example:**

```bash
curl "http://localhost:3000/api/data?startDate=2024-01-01&endDate=2024-03-31&aggregationLevel=monthly"
```

### GET /health

Returns server health status including cache statistics.

---

## Implementation Details

### Mock Dataset Structure

The backend generates **5,000+ sales events** spanning **12 months** of historical data. Each event contains:

```typescript
interface SalesEvent {
  id: string; // UUID
  timestamp: Date; // Event timestamp
  value: number; // Sales amount (50-500 base range)
}
```

**Data Generation Patterns:**

- **Weekend effect:** 70% of normal weekday sales
- **Seasonal variation:** Q4 highest (holiday season), summer lowest
- **Random variance:** ±30% daily fluctuation
- **Occasional spikes:** 5% chance of 2-5x multiplier

The `AggregationService` groups events by the requested level (daily/weekly/monthly), sums the values, and returns sorted results. For weekly aggregation, ISO week boundaries are used; for monthly, calendar month boundaries.

### Cache Key Construction

The backend implements a **cache-aside pattern** using `node-cache` with a 5-minute TTL. Cache keys are deterministically generated from all query parameters to ensure identical requests hit the cache:

```
analytics:{startDate}:{endDate}:{aggregationLevel}
```

**Example keys:**

- `analytics:2024-01-01:2024-03-31:daily`
- `analytics:2024-01-01:2024-12-31:monthly`

The `CacheKeyGenerator` class normalizes dates (strips time components) and lowercases the aggregation level to prevent duplicate cache entries for semantically identical queries. Before performing the CPU-intensive aggregation, the server checks the cache and returns immediately if a matching key exists.

### Frontend Debouncing

The frontend implements **300ms debouncing** to prevent flooding the backend with expensive aggregation requests during rapid filter changes. This is achieved through a custom `useDebounce` hook:

```typescript
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

The `useChartFilters` hook wraps the raw filter state and exposes both immediate `filters` (for UI responsiveness) and `debouncedFilters` (for API calls). The `useAnalyticsData` hook only triggers fetches when `debouncedFilters` change, ensuring:

1. Users see immediate UI feedback when changing filters
2. API requests only fire after 300ms of user inactivity
3. Intermediate filter states don't trigger unnecessary backend work

TanStack Query is used for data fetching with loading/error state management. Client-side caching is currently disabled (`gcTime: 0`) but can be re-enabled in `QueryProvider.tsx` by uncommenting the caching options.

---

## Available Scripts

| Script             | Description                                         |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Start both backend and frontend in development mode |
| `npm run backend`  | Start backend only                                  |
| `npm run frontend` | Start frontend only                                 |
| `npm run build`    | Build all packages                                  |
| `npm run lint`     | Lint all packages                                   |
| `npm run test`     | Run tests                                           |

## Environment Variables

### Backend

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode
- `ALLOWED_ORIGINS` - CORS allowed origins

### Frontend

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000)
- `VITE_DEBOUNCE_DELAY` - Debounce delay in ms (default: 300)
