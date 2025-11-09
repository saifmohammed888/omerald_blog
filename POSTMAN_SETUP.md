# Postman Collection Setup Guide

## Import the Collection

1. **Open Postman**
2. Click **Import** button (top left)
3. Select the `postman_collection.json` file
4. The collection will be imported with all endpoints

## Environment Variables

The collection uses a `base_url` variable. To set it up:

1. Click on **Environments** in the left sidebar
2. Click **+** to create a new environment
3. Name it "Omerald Blog Local"
4. Add a variable:
   - **Variable**: `base_url`
   - **Initial Value**: `http://localhost:3000`
   - **Current Value**: `http://localhost:3000`
5. Click **Save**
6. Select this environment from the dropdown (top right)

## Available Endpoints

### Health Check
- **GET** `/api/health` - Check database connection and status

### Articles
- **GET** `/api/articles` - Get all articles (with pagination, filtering, search)
- **GET** `/api/articles/:id` - Get article by ID
- **GET** `/api/articles/:slug?bySlug=true` - Get article by slug

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `status` - Filter by status (1=Approved, 2=Submitted, 3=Draft, 4=Rejected)
- `search` - Search in title, short_description, description
- `topic` - Filter by topic slug or ID
- `sortBy` - Sort field (created_at, updated_at, title, id)
- `sortOrder` - Sort order (asc, desc)

### Topics
- **GET** `/api/topics` - Get all health topics
- **GET** `/api/topics?includeCount=false` - Get topics without article counts
- **GET** `/api/topics/:id` - Get topic by ID
- **GET** `/api/topics/:slug?bySlug=true` - Get topic by slug
- **GET** `/api/topics/:id?includeArticles=true` - Get topic with related articles

**Query Parameters:**
- `includeCount` - Include article counts (default: true)
- `bySlug` - Get by slug instead of ID (default: false)
- `includeArticles` - Include related articles (default: false)
- `page` - Page number for articles (if includeArticles=true)
- `limit` - Articles per page (if includeArticles=true)

## Example Requests

### Get First 10 Approved Articles
```
GET http://localhost:3000/api/articles?status=1&limit=10
```

### Search for Articles
```
GET http://localhost:3000/api/articles?search=diabetes&status=1
```

### Get Articles by Topic
```
GET http://localhost:3000/api/articles?topic=diabetes&status=1
```

### Get Article by Slug
```
GET http://localhost:3000/api/articles/how-to-be-safe-from-covid-19?bySlug=true
```

## Testing Tips

1. **Start with Health Check** - Verify database connection first
2. **Test Articles Endpoint** - Make sure articles are being returned
3. **Test Topics Endpoint** - Verify topics are accessible
4. **Try Different Filters** - Test search, status filters, pagination

## Response Format

### Articles Response
```json
{
  "articles": [...],
  "total": 1676,
  "page": 1,
  "limit": 10,
  "totalPages": 168
}
```

### Topics Response
```json
[
  {
    "id": 4,
    "name": "Blood Pressure",
    "slug": "blood-pressure",
    "description": "...",
    "articleCount": 0,
    "created_at": "...",
    "updated_at": "..."
  }
]
```

## Troubleshooting

### 500 Errors
- Check if database is connected (use health endpoint)
- Verify `.env.local` file exists with correct credentials
- Check server logs for detailed error messages

### No Articles Returned
- Verify articles exist in database: `npm run check:data`
- Check article status (use status=1 for approved articles)
- Verify database connection

### Connection Refused
- Make sure dev server is running: `npm run dev`
- Check if port 3000 is available
- Verify base_url in Postman environment

