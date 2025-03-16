# Expense Tracker Application

A multi-component expense tracking application that allows users to monitor and manage their monthly expenses.

## Project Structure

This project is organized as a multi-component repository with the following services:

- **webapp**: React frontend application built with TypeScript and Material UI
- **bffapi**: Backend-For-Frontend API service that provides data to the webapp
- **billParser**: Service for extracting expense information from uploaded bill images
- **Accounts**: User management service for authentication and user data

## Services

### WebApp

A React application that provides the user interface for the expense tracker. Users can:
- View a list of their monthly expenses
- See the total expenses for the month
- Add new expenses manually by filling a form
- Upload images of bills to automatically extract expense data

**Technologies:** React, TypeScript, Material UI

**Running the webapp:**
```
cd webapp
npm install
npm start
```

### BFF API

Backend-For-Frontend API service that connects the webapp to other services. It provides:
- Endpoints for retrieving expense data
- Endpoints for adding new expenses
- Proxy to the bill parser service for uploading images

**Technologies:** Node.js, Express, TypeScript

**Running the BFF API:**
```
cd bffapi
npm install
npm run dev
```

### Bill Parser

Service for processing bill images using Optical Character Recognition (OCR) to extract:
- Vendor information
- Date of purchase
- Total amount
- Individual expense items

**Technologies:** Node.js, TypeScript, Tesseract.js

**Running the Bill Parser service:**
```
cd billParser
npm install
npm run dev
```

### Accounts

User account management service for:
- User registration
- Authentication
- User profile management

**Technologies:** Node.js, Express, MongoDB, TypeScript

**Running the Accounts service:**
```
cd Accounts
npm install
npm run dev
```

## Development

Each service can be developed and run independently. During development, the services expect to communicate with each other on their default ports:

- webapp: http://localhost:3000
- bffapi: http://localhost:3001
- billParser: Internal service called by bffapi
- Accounts: http://localhost:3002

## Building for Production

To build all services for production:

```
# Build webapp
cd webapp
npm run build

# Build bffapi
cd ../bffapi
npm run build

# Build billParser
cd ../billParser
npm run build

# Build Accounts
cd ../Accounts
npm run build
```