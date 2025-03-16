/**
 * Service client for connecting to backend APIs
 * 
 * This module provides helper functions to connect to:
 * - Accounts API
 * - BillParser API
 */

const axios = require('axios');
const FormData = require('form-data');

// Create Axios instances for each service
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

/**
 * Handles Axios errors and formats them
 * @param {Error} error - The error from Axios
 * @returns {Object} Formatted error object
 */
const handleServiceError = (error) => {
  if (error.response) {
    // API responded with an error status
    return {
      statusCode: error.response.status,
      message: error.response.data.error || 'Service error',
      details: error.response.data
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      statusCode: 503,
      message: 'Service unavailable',
      details: 'No response received from service'
    };
  } else {
    // Error setting up the request
    return {
      statusCode: 500,
      message: 'Error connecting to service',
      details: error.message
    };
  }
};

// Accounts API methods
const accountsService = {
  /**
   * Get all bills
   * @returns {Promise<Array>} List of bills
   */
  getAllBills: async () => {
    try {
      const response = await accountsClient.get('/bills');
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  },

  /**
   * Get a single bill by ID
   * @param {number} id - Bill ID
   * @returns {Promise<Object>} Bill details
   */
  getBillById: async (id) => {
    try {
      const response = await accountsClient.get(`/bills/${id}`);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  },

  /**
   * Create a new bill
   * @param {Object} billData - Bill data
   * @returns {Promise<Object>} Created bill info
   */
  createBill: async (billData) => {
    try {
      const response = await accountsClient.post('/bills', billData);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  },

  /**
   * Update an existing bill
   * @param {number} id - Bill ID
   * @param {Object} billData - Updated bill data
   * @returns {Promise<Object>} Update confirmation
   */
  updateBill: async (id, billData) => {
    try {
      const response = await accountsClient.put(`/bills/${id}`, billData);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  },

  /**
   * Delete a bill
   * @param {number} id - Bill ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteBill: async (id) => {
    try {
      const response = await accountsClient.delete(`/bills/${id}`);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
};

// BillParser API methods
const billParserService = {
  /**
   * Parse a bill image
   * @param {Buffer} imageBuffer - Image file buffer
   * @param {string} filename - Original filename
   * @returns {Promise<Object>} Parsed bill data
   */
  parseBillImage: async (imageBuffer, filename) => {
    try {
      const formData = new FormData();
      formData.append('image', imageBuffer, {
        filename,
        contentType: 'image/jpeg'
      });

      const response = await billParserClient.post('/parse-bill', formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
};

module.exports = {
  accountsService,
  billParserService
};