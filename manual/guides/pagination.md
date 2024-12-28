# Pagination in NebulaForge API Responses

## 1. Introduction to Pagination
NebulaForge implements cursor-based pagination to manage large datasets returned by API endpoints. This mechanism ensures efficient resource retrieval while maintaining system performance across multi-cloud environments. All collection endpoints returning more than 25 items automatically enforce pagination.

## 2. Query Parameters
Control pagination behavior using these standard parameters:

| Parameter | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `limit`   | integer | 25      | Maximum items per page (1-100) |
| `offset`  | integer | 0       | Starting position index (0-based) |
| `page`    | integer | 1       | Page number alternative to `offset` |

**Example Request:**
```bash
curl -X GET "https://api.nebulaforge.io/v1/resources?limit=25&offset=50"
  -H "Authorization: Bearer <token>"
```

## 3. Response Structure
Paginated responses contain two root elements:

```json
{
  "data": [
    {/* resource objects */}
  ],
  "pagination": {
    "total_items": 142,
    "total_pages": 6,
    "current_page": 3,
    "page_size": 25,
    "has_next": true,
    "has_previous": true,
    "next_offset": 75,
    "prev_offset": 25
  }
}
```

### 3.1 Data Array
Contains the requested resource objects in JSON format. Empty when no results match the query.

### 3.2 Pagination Object
- `total_items`: Total matching resources across all pages
- `total_pages`: Calculated from total_items/page_size
- `current_page`: Current page index (when using `page` parameter)
- `page_size`: Actual items per page (may differ from requested limit)
- `has_next`/`has_previous`: Boolean navigation indicators
- `next_offset`/`prev_offset`: Recommended offset values for navigation

## 4. Navigation Best Practices
### 4.1 Sequential Access
```bash
# First page
GET /resources?limit=25&offset=0

# Next page
GET /resources?limit=25&offset=25
```

### 4.2 Page Number Access
```bash
# Direct page access
GET /resources?limit=25&page=3
```

### 4.3 Response-Driven Navigation
Use the `pagination` object values for subsequent requests rather than calculating offsets locally:

```bash
# Follow next_offset from response
GET /resources?limit={page_size}&offset={next_offset}
```

## 5. Error Conditions
- `400 Bad Request`: Invalid parameter combinations (page+offset simultaneuously)
- `400 Bad Request`: Limit exceeds maximum value (100)
- `404 Not Found`: Page number exceeds total_pages

## 6. Edge Case Handling
1. **Limit Reduction**: When remaining items are less than requested limit, returns actual item count
2. **Offset Overflow**: Returns empty data array when offset exceeds total_items
3. **Concurrent Modification**: Pagination metadata reflects state at query time, not during processing

## 7. Anti-Patterns to Avoid
❌ Parallel page requests with overlapping offsets  
❌ Client-side page number calculation from offset  
❌ Assumption of consistent page sizes between requests  
❌ Caching pagination metadata beyond 60 seconds

## 8. Performance Considerations
1. Prefer `offset`-based navigation for large datasets (>10,000 items)
2. Use cursor tokens (available in v2 API) for time-series data
3. Combine with `filter` parameters to reduce pagination burden

This pagination system enables reliable traversal of NebulaForge-generated infrastructure configurations while maintaining compatibility with AWS, Azure, and GCP resource listing patterns.