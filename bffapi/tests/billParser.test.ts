/**
 * Tests for the bill parser API routes
 */

import request from 'supertest';
import { app } from '../src/index';
import { ParsedReceipt } from '../src/types';

// Mock the service client
jest.mock('../src/utils/serviceClient', () => ({
  accountsService: {
    createBill: jest.fn()
  },
  billParserService: {
    parseBillImage: jest.fn()
  }
}));

import { billParserService, accountsService } from '../src/utils/serviceClient';

describe('Bill Parser API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /api/parser/parse-bill', () => {
    it('should parse a bill image', async () => {
      const mockParsedData: ParsedReceipt = {
        items: [
          { name: 'Milk', quantity: 1, price: 3.99 },
          { name: 'Bread', quantity: 1, price: 2.49 }
        ],
        total: 6.48,
        currency: 'USD',
        date: '2025-03-15',
        merchant: 'Grocery Store'
      };

      (billParserService.parseBillImage as jest.Mock).mockResolvedValue(mockParsedData);

      // This is a mock for testing - in a real test we'd use a test image file
      const response = await request(app)
        .post('/api/parser/parse-bill')
        .attach('image', Buffer.from('test image data'), 'test.jpg');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockParsedData);
      expect(billParserService.parseBillImage).toHaveBeenCalledTimes(1);
    });

    it('should handle missing image', async () => {
      const response = await request(app)
        .post('/api/parser/parse-bill');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No image file provided');
      expect(billParserService.parseBillImage).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/parser/create-bill-from-image', () => {
    it('should create a bill from parsed image', async () => {
      const mockParsedData: ParsedReceipt = {
        items: [
          { name: 'Milk', quantity: 1, price: 3.99 },
          { name: 'Bread', quantity: 1, price: 2.49 }
        ],
        total: 6.48,
        currency: 'USD',
        date: '2025-03-15',
        merchant: 'Grocery Store'
      };

      (billParserService.parseBillImage as jest.Mock).mockResolvedValue(mockParsedData);
      (accountsService.createBill as jest.Mock).mockResolvedValue({ id: 3 });

      const response = await request(app)
        .post('/api/parser/create-bill-from-image')
        .field('title', 'Grocery Receipt')
        .attach('image', Buffer.from('test image data'), 'test.jpg');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('billId', 3);
      expect(response.body).toHaveProperty('parsedData', mockParsedData);
      expect(billParserService.parseBillImage).toHaveBeenCalledTimes(1);
      expect(accountsService.createBill).toHaveBeenCalledTimes(1);

      // Verify the bill data is formatted correctly
      const billData = (accountsService.createBill as jest.Mock).mock.calls[0][0];
      expect(billData).toHaveProperty('title', 'Grocery Receipt');
      expect(billData).toHaveProperty('items');
      expect(billData.items).toHaveLength(2);
      expect(billData.items[0]).toHaveProperty('name', 'Milk');
    });

    it('should use default title if not provided', async () => {
      const mockParsedData: ParsedReceipt = {
        items: [
          { name: 'Milk', quantity: 1, price: 3.99 }
        ],
        total: 3.99,
        date: '2025-03-15',
        merchant: 'Grocery Store'
      };

      (billParserService.parseBillImage as jest.Mock).mockResolvedValue(mockParsedData);
      (accountsService.createBill as jest.Mock).mockResolvedValue({ id: 4 });

      const response = await request(app)
        .post('/api/parser/create-bill-from-image')
        .attach('image', Buffer.from('test image data'), 'test.jpg');
      
      expect(response.status).toBe(201);
      
      // Verify default title was used
      const billData = (accountsService.createBill as jest.Mock).mock.calls[0][0];
      expect(billData).toHaveProperty('title', 'Bill from receipt image');
    });
  });
});