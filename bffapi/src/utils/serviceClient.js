const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Create axios instances for each backend service with base URLs from environment variables
const accountsClient = axios.create({
  baseURL: process.env.ACCOUNTS_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const billParserClient = axios.create({
  baseURL: process.env.BILL_PARSER_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor to log errors
const addErrorInterceptor = (client) => {
  client.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      return Promise.reject(error);
    }
  );
};

addErrorInterceptor(accountsClient);
addErrorInterceptor(billParserClient);

module.exports = { accountsClient, billParserClient };
