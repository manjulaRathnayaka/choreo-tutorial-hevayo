/**
 * BFF API for the Expense Tracker application
 * 
 * This service acts as a Backend for Frontend (BFF) layer that integrates with:
 * 1. Accounts API - For managing bills and expenses
 * 2. BillParser API - For processing bill images
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Import routes
import billsRoutes from './routes/bills';
import billParserRoutes from './routes/billParser';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker BFF API',
      version: '1.0.0',
      description: 'BFF API that integrates Accounts and BillParser services',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local development server'
      }
    ]
  },
  // Path to the API documentation files
  apis: ['./src/routes/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'BFF API is running' });
});

// API routes
app.use('/api/bills', billsRoutes);
app.use('/api/parser', billParserRoutes);

// Error interface for the error handler
interface AppError extends Error {
  statusCode?: number;
}

// Error handling middleware
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`BFF API running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

export { app, server };