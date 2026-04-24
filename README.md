# Breadcrumbs - Error Tracking Backend

**A modern backend API for real-time browser error capture and analysis**

Breadcrumbs is an error monitoring system that collects breadcrumb events and error reports from web applications, enabling developers to quickly identify and resolve issues.

## 🎯 What This Application Does

- **Real-time Error Collection**: Automatically receives JavaScript errors from browsers
- **Event Tracking**: Captures sequence of events (breadcrumbs) leading to errors
- **Structured Storage**: Persists data in MongoDB for later analysis
- **RESTful API**: Simple endpoint for frontend SDK integration

## 🏗️ Architecture & Tech Stack

- **Backend**: Node.js + TypeScript (type-safe)
- **Web Framework**: Fastify (high performance)
- **Database**: MongoDB (flexible and scalable)
- **Modular Architecture**: Clean structure with separation of concerns

## 📁 Project Structure

```text
src/
├── app.ts          # Main Fastify configuration
├── server.ts       # Server entry point
├── config/
│   └── database.ts # MongoDB configuration
├── modules/
│   └── log/
│       ├── log.routes.ts    # API routes
│       ├── log.controller.ts # Controller logic
│       ├── log.service.ts    # Business logic
│       └── log.model.ts      # MongoDB schema
└── shared/
    ├── errors/     # Error handling
    └── middlewares/ # Global middlewares
```

## 📋 Prerequisites

- **Node.js 22+** (recommended)
- **MongoDB** (running locally or via Docker)
- **Git** for repository cloning

## 🚀 How to Run the Application

### 1. Clone the Repository

```bash
git clone <repository-url>
cd breadcrumbs-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database

**Option A: Docker (Recommended)**

```bash
docker compose up -d
```

This starts MongoDB on `localhost:27017` using the settings in `docker-compose.yml`.

**Option B: Local MongoDB**
Make sure you have MongoDB running locally on the default port 27017.

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

The `.env` file should contain:

```bash

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

**Important**: You need to create a Clerk account at [clerk.com](https://clerk.com) to get your authentication keys.

### 5. Start Development Server

```bash
npm run dev
```

The server will be available at `http://localhost:3000`

### 6. Useful Commands

```bash
# Check TypeScript types
npm run typecheck

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Installation Verification

To test if everything is working:

1. **Check if MongoDB is running:**

   ```bash
   docker ps  # if using Docker
   # or
   mongosh --eval "db.adminCommand('ismaster')"  # if local MongoDB
   ```

2. **Check if API is responding:**

   ```bash
   curl http://localhost:3000/api/v1/log
   ```

3. **Test the main endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/log \
   -H "Content-Type: application/json" \
   -d '{"error":{"message":"Test error","stack":"Error: Test error"},"events":[{"type":"click","timestamp":1710000000000,"data":{"element":"button"}}]}'
   ```

## 📡 API Documentation

### `POST /api/v1/log`

**Main endpoint for receiving browser errors and events**

Receives an error payload with breadcrumb events and stores it in MongoDB (`logs` collection).

**Request Format:**

```json
{
  "error": {
    "message": "JavaScript error captured",
    "stack": "Error: JavaScript error captured\n    at..."
  },
  "events": [
    {
      "type": "click",
      "timestamp": 1710000000000,
      "data": {
        "element": "button",
        "id": "submit-btn"
      }
    },
    {
      "type": "navigation",
      "timestamp": 1710000001000,
      "data": {
        "url": "/dashboard"
      }
    }
  ]
}
```

**Success Response:**

```json
{ "ok": true }
```

**Supported Event Types:**

- `click` - Click interactions
- `navigation` - Route changes
- `input` - Form data entry
- `error` - Other captured errors
- `custom` - Custom events

## 🎯 Use Cases

- **Enterprise Web Applications**: Production error monitoring
- **E-commerce**: Tracking failures affecting conversions
- **SaaS**: Remote debugging for customers

## 🛠️ Technologies Used

- **Fastify**: Performance-optimized web framework
- **TypeScript**: Type safety and better DX
- **MongoDB**: Flexible NoSQL database for structured data
- **Mongoose**: MongoDB ODM with validation
- **Clerk**: Authentication (integrated via @clerk/fastify)

---

**Developed with ❤️ to facilitate debugging of modern web applications**
