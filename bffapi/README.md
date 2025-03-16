# Expense Tracker BFF API

A Backend for Frontend (BFF) API service for the Expense Tracker application. This service provides a unified API for the web frontend by integrating with the Accounts API and BillParser API.

## Architecture

The BFF API follows a simple architecture:

1. **Web Frontend** - Communicates only with the BFF API
2. **BFF API** - Orchestrates requests between the web app and backend services
3. **Backend Services**:
   - **Accounts API** - Manages bills and expenses
   - **BillParser API** - Processes bill images using OCR

## Features

- CRUD operations for bills and expenses
- Image upload and processing for bills
- Integration with the Accounts API
- Integration with the BillParser API
- Swagger documentation
- TypeScript for improved type safety and developer experience

## Getting Started

### Prerequisites

- Node.js 16+
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables by creating a `.env` file (you can copy from `.env.example`):
   ```
   PORT=3001
   ACCOUNTS_API_URL=http://localhost:8080/api/v1
   BILL_PARSER_API_URL=http://localhost:8080
   NODE_ENV=development
   ```

### Running the API

For development:
```
npm run dev
```

For production:
```
npm run build
npm start
```

## API Documentation

Swagger documentation is available at `/api-docs` when the service is running.

### Main Endpoints

#### Bills API

- `GET /api/bills` - Get all bills
- `GET /api/bills/{id}` - Get a bill by ID
- `POST /api/bills` - Create a new bill
- `PUT /api/bills/{id}` - Update a bill
- `DELETE /api/bills/{id}` - Delete a bill

#### Bill Parser API

- `POST /api/parser/parse-bill` - Parse a bill image
- `POST /api/parser/create-bill-from-image` - Parse an image and create a bill

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | The port the API runs on | 3001 |
| ACCOUNTS_API_URL | URL for the Accounts API | http://localhost:8080/api/v1 |
| BILL_PARSER_API_URL | URL for the BillParser API | http://localhost:8080 |
| NODE_ENV | Environment (development, production) | development |

## Development

### Project Structure

```
bffapi/
├── src/
│   ├── index.ts          # Main application entry point
│   ├── routes/           # API route definitions
│   │   ├── bills.ts      # Bills API routes
│   │   └── billParser.ts # Bill Parser API routes
│   ├── middleware/       # Express middleware
│   │   └── validation.ts # Request validation
│   ├── utils/            # Utility functions
│   │   └── serviceClient.ts # Client for backend services
│   └── types/            # TypeScript type definitions
│       └── index.ts      # Shared type definitions
├── tests/                # Test files
│   ├── bills.test.ts     # Tests for bills API
│   └── billParser.test.ts # Tests for bill parser API
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest test configuration
├── .eslintrc.json        # ESLint configuration
├── package.json          # Dependencies and scripts
└── README.md             # Documentation
```

### Scripts

- `npm run build` - Build the TypeScript code
- `npm run dev` - Run the API in development mode with hot reloading
- `npm start` - Run the API in production mode
- `npm test` - Run tests
- `npm run lint` - Run ESLint to check code style
- `npm run typecheck` - Run TypeScript type checking without emitting files

### Testing

Run tests with:
```
npm test
```