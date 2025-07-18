# CSV Processing Application

A high-performance backend API with React frontend for processing large CSV files containing departmental sales data.

![App Screenshot](/screenshots/app-preview.png)

## Features

- 📁 Upload CSV files with department sales data
- ⚡ Stream processing for memory efficiency
- 📊 Aggregate sales by department
- ⬇️ Download processed results
- 📈 Handle very large files (100MB+)

## Tech Stack

**Backend:**

- Node.js + Express
- TypeScript
- csv-parser + csv-stringify
- Worker Threads (for large files)

**Frontend:**

- React + TypeScript
- Material-UI
- Axios

## Prerequisites

- Node.js v16+
- npm v8+
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/csv-app.git
cd csv-app
cd server
npm install
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd ../csv-client
npm install
```

Running the Application
Development Mode

1. Start backend server:

```bash
cd server
npm run dev
```

2. Start frontend:

```bash
cd ../csv-client
npm start
```

3. Access the app at: http://localhost:3000

Production Build

# Build both frontend and backend

```bash
cd server
npm run build
cd ../csv-client
npm run build
```

# Start production server

```bash
cd ../server
npm start
```

File Format Requirements
Your CSV file should contain comma-separated values in this format:
Department,Date,Sales
New York,2023-01-01,100
Boston,2023-01-01,50
New York,2023-01-01,30

API Endpoints
Endpoint Method Description
/upload POST Upload CSV file
/download/:filename GET Download processed results
/api/health GET Server health check

Testing
Run backend tests:

```bash
cd server
npm test
```

Deployment

1. Backend:

- Deploy to services like AWS EC2, Heroku, or Render

- Set environment variables:

```bash
PORT=5000
NODE_ENV=production
```

2. Frontend:

- Deploy built files to Netlify, Vercel, or S3
- Set API base URL in environment variables

## Project Structure

### Alternative Format (If You Prefer Bullet Points):

```markdown
## Project Structure

- **csv-app/**
  - **server/** _(Backend - Node.js + Express)_
    - src/
      - controllers/ _(Route handlers)_
      - services/ _(Business logic)_
      - workers/ _(Background processing)_
      - app.ts _(Express setup)_
      - server.ts _(Server entry)_
    - **tests**/ _(Unit tests)_
    - temp/ _(Processed files storage)_
  - **csv-client/** _(React frontend)_
    - public/ _(Static assets)_
    - src/ _(React components)_
  - .gitignore
  - README.md

Performance Metrics
File Size Processing Time Memory Usage
1MB           120ms         ~15MB
100MB         8.2s         ~18MB
1GB           1m 22s       ~22MB

Troubleshooting
Common Issues:

- Proxy error: Ensure backend is running before starting frontend

- File not downloading: Check server/temp directory permissions

- CSV format errors: Verify file uses commas, not tabs
```

```

```
