/**
 * Tests for the bills API routes
 */

const request = require('supertest');
const app = require('../src/index');

// Mock the service client
jest.mock('../src/utils/serviceClient', () => ({
  accountsService: {
    getAllBills: jest.fn(),
    getBillById: jest.fn(),
    createBill: jest.fn(),
    updateBill: jest.fn(),
    deleteBill: jest.fn()
  },
  billParserService: {
    parseBillImage: jest.fn()
  }
}));

const { accountsService } = require('../src/utils/serviceClient');

describe('Bills API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/bills', () => {
    it('should return all bills', async () => {
      const mockBills = [
        {
          id: 1,
          title: 'Groceries',
          description: 'Weekly groceries',
          total: 100.50,
          due_date: '2025-03-15T00:00:00Z',
          paid: false,
          item_count: 5,
          created_at: '2025-03-01T00:00:00Z',
          updated_at: '2025-03-01T00:00:00Z'
        }
      ];

      accountsService.getAllBills.mockResolvedValue(mockBills);

      const response = await request(app).get('/api/bills');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBills);
      expect(accountsService.getAllBills).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      accountsService.getAllBills.mockRejectedValue({
        statusCode: 500,
        message: 'Service error'
      });

      const response = await request(app).get('/api/bills');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(accountsService.getAllBills).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/bills/:id', () => {
    it('should return a bill by ID', async () => {
      const mockBill = {
        id: 1,
        title: 'Groceries',
        description: 'Weekly groceries',
        total: 100.50,
        due_date: '2025-03-15T00:00:00Z',
        paid: false,
        items: [
          {
            id: 1,
            bill_id: 1,
            name: 'Milk',
            description: 'Whole milk',
            amount: 3.99,
            quantity: 1
          }
        ],
        created_at: '2025-03-01T00:00:00Z',
        updated_at: '2025-03-01T00:00:00Z'
      };

      accountsService.getBillById.mockResolvedValue(mockBill);

      const response = await request(app).get('/api/bills/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBill);
      expect(accountsService.getBillById).toHaveBeenCalledWith('1');
    });

    it('should return 404 if bill not found', async () => {
      accountsService.getBillById.mockRejectedValue({
        statusCode: 404,
        message: 'Bill not found'
      });

      const response = await request(app).get('/api/bills/99');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Bill not found');
      expect(accountsService.getBillById).toHaveBeenCalledWith('99');
    });
  });

  describe('POST /api/bills', () => {
    it('should create a new bill', async () => {
      const newBill = {
        title: 'New Bill',
        description: 'Test bill',
        due_date: '2025-04-01',
        paid: false,
        items: [
          {
            name: 'Item 1',
            description: 'Test item',
            amount: 10.99,
            quantity: 2
          }
        ]
      };

      const createdBill = { id: 2 };

      accountsService.createBill.mockResolvedValue(createdBill);

      const response = await request(app)
        .post('/api/bills')
        .send(newBill);
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdBill);
      expect(accountsService.createBill).toHaveBeenCalledWith(newBill);
    });

    it('should validate request body', async () => {
      const invalidBill = {
        description: 'Missing required title'
      };

      const response = await request(app)
        .post('/api/bills')
        .send(invalidBill);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(accountsService.createBill).not.toHaveBeenCalled();
    });
  });
});