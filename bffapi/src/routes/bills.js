/**
 * Bills API Routes
 * 
 * These routes handle bill CRUD operations by proxying to the Accounts API
 */

const express = require('express');
const router = express.Router();
const { accountsService } = require('../utils/serviceClient');
const { validate, schemas } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Bills
 *   description: API endpoints to manage bills
 */

/**
 * @swagger
 * /api/bills:
 *   get:
 *     summary: Get all bills
 *     tags: [Bills]
 *     responses:
 *       200:
 *         description: List of all bills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   total:
 *                     type: number
 *                   due_date:
 *                     type: string
 *                   paid:
 *                     type: boolean
 *                   item_count:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                   updated_at:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res, next) => {
  try {
    const bills = await accountsService.getAllBills();
    
    // Transform data for the frontend if needed
    const transformedBills = bills.map(bill => ({
      ...bill,
      // Add any BFF-specific transformations here
    }));
    
    res.json(transformedBills);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bills/{id}:
 *   get:
 *     summary: Get bill by ID
 *     tags: [Bills]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Bill ID
 *     responses:
 *       200:
 *         description: Bill details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 total:
 *                   type: number
 *                 due_date:
 *                   type: string
 *                 paid:
 *                   type: boolean
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 created_at:
 *                   type: string
 *                 updated_at:
 *                   type: string
 *       404:
 *         description: Bill not found
 *       500:
 *         description: Server error
 */
router.get('/:id', validate(schemas.idParamSchema, 'params'), async (req, res, next) => {
  try {
    const bill = await accountsService.getBillById(req.params.id);
    res.json(bill);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    next(error);
  }
});

/**
 * @swagger
 * /api/bills:
 *   post:
 *     summary: Create a new bill
 *     tags: [Bills]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *               paid:
 *                 type: boolean
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - amount
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Bill created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', validate(schemas.billSchema, 'body'), async (req, res, next) => {
  try {
    const result = await accountsService.createBill(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bills/{id}:
 *   put:
 *     summary: Update a bill
 *     tags: [Bills]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Bill ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *               paid:
 *                 type: boolean
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Bill updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Bill not found
 *       500:
 *         description: Server error
 */
router.put('/:id', 
  validate(schemas.idParamSchema, 'params'),
  validate(schemas.billSchema, 'body'),
  async (req, res, next) => {
    try {
      const result = await accountsService.updateBill(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      if (error.statusCode === 404) {
        return res.status(404).json({ error: 'Bill not found' });
      }
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/bills/{id}:
 *   delete:
 *     summary: Delete a bill
 *     tags: [Bills]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Bill ID
 *     responses:
 *       200:
 *         description: Bill deleted successfully
 *       404:
 *         description: Bill not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', validate(schemas.idParamSchema, 'params'), async (req, res, next) => {
  try {
    const result = await accountsService.deleteBill(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    next(error);
  }
});

module.exports = router;