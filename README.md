# Next.js App

A simple Next.js application with a health API endpoint.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Routes

### Health Check

- **Endpoint**: `/api/health`
- **Method**: `GET`
- **Response**: Returns a JSON object with status, timestamp, and uptime

Example response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── next.config.js
├── package.json
└── tsconfig.json
```

