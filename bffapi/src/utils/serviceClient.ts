/**
 * Service client for connecting to backend APIs
 * 
 * This module provides helper functions to connect to:
 * - Accounts API
 * - BillParser API
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import FormData from 'form-data';
import { 
  Bill, 
  BillInput, 
  ParsedReceipt, 
  ServiceError 
} from '../types';

// Create Axios instances for each service
const accountsClient: AxiosInstance = axios.create({
  baseURL: process.env.ACCOUNTS_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const billParserClient: AxiosInstance = axios.create({
  baseURL: process.env.BILL_PARSER_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Handles Axios errors and formats them
 * @param error - The error from Axios
 * @returns Formatted error object
 */
const handleServiceError = (error: unknown): ServiceError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // API responded with an error status
      return {
        statusCode: axiosError.response.status,
        message: axiosError.response.data && (axiosError.response.data as any).error 
          ? (axiosError.response.data as any).error 
          : 'Service error',
        details: axiosError.response.data
      };
    } else if (axiosError.request) {
      // Request made but no response received
      return {
        statusCode: 503,
        message: 'Service unavailable',
        details: 'No response received from service'
      };
    }
  }
  
  // Default error or error setting up the request
  return {
    statusCode: 500,
    message: 'Error connecting to service',
    details: error instanceof Error ? error.message : String(error)
  };
};

interface UpdateConfirmation {
  message: string;
}

interface DeletionConfirmation {
  message: string;
}

interface CreatedBill {
  id: number;
}

// Accounts API methods
export const accountsService = {
  /**
   * Get all bills
   * @returns List of bills
   */
  getAllBills: async (): Promise<Bill[]> => {
    try {
      const response = await accountsClient.get('/bills');
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  },

  /**
   * Get a single bill by ID
   * @param id - Bill ID
   * @returns Bill details
   */
  getBillById: async (id: number | string): Promise<Bill> => {
    try {
      const response = await accountsClient.get(`/bills/${id}`);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  },

  /**
   * Create a new bill
   * @param billData - Bill data
   * @returns Created bill info
   */
  createBill: async (billData: BillInput): Promise<CreatedBill> => {
    try {
      const response = await accountsClient.post('/bills', billData);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  },

  /**
   * Update an existing bill
   * @param id - Bill ID
   * @param billData - Updated bill data
   * @returns Update confirmation
   */
  updateBill: async (id: number | string, billData: BillInput): Promise<UpdateConfirmation> => {
    try {
      const response = await accountsClient.put(`/bills/${id}`, billData);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  },

  /**
   * Delete a bill
   * @param id - Bill ID
   * @returns Deletion confirmation
   */
  deleteBill: async (id: number | string): Promise<DeletionConfirmation> => {
    try {
      const response = await accountsClient.delete(`/bills/${id}`);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
};

// BillParser API methods
export const billParserService = {
  /**
   * Parse a bill image
   * @param imageBuffer - Image file buffer
   * @param filename - Original filename
   * @returns Parsed bill data
   */
  parseBillImage: async (imageBuffer: Buffer, filename: string): Promise<ParsedReceipt> => {
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

export default {
  accountsService,
  billParserService
};