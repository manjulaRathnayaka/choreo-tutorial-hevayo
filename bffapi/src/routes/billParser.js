/**
 * Bill Parser API Routes
 * 
 * These routes handle bill image processing by proxying to the BillParser API
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { billParserService, accountsService } = require('../utils/serviceClient');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'), false);
    } else {
      cb(null, true);
    }
  }
});

/**
 * @swagger
 * tags:
 *   name: BillParser
 *   description: API endpoints to process bill images
 */

/**
 * @swagger
 * /api/parser/parse-bill:
 *   post:
 *     summary: Parse a bill image
 *     tags: [BillParser]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully parsed bill
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       quantity:
 *                         type: number
 *                 total:
 *                   type: number
 *                 currency:
 *                   type: string
 *                 date:
 *                   type: string
 *                 merchant:
 *                   type: string
 *       400:
 *         description: Invalid input or missing image
 *       500:
 *         description: Server error
 */
router.post('/parse-bill', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const parsedData = await billParserService.parseBillImage(
      req.file.buffer,
      req.file.originalname
    );

    res.json(parsedData);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/parser/create-bill-from-image:
 *   post:
 *     summary: Parse an image and create a bill
 *     tags: [BillParser]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bill created successfully
 *       400:
 *         description: Invalid input or missing image
 *       500:
 *         description: Server error
 */
router.post('/create-bill-from-image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get the optional title or use a default
    const title = req.body.title || 'Bill from receipt image';

    // Parse the bill image
    const parsedData = await billParserService.parseBillImage(
      req.file.buffer,
      req.file.originalname
    );

    // Transform the parsed data into bill format
    const billData = {
      title,
      description: `Created from receipt: ${parsedData.merchant || 'Unknown merchant'}`,
      due_date: parsedData.date || new Date().toISOString().split('T')[0],
      paid: false,
      items: parsedData.items.map(item => ({
        name: item.name,
        description: '',
        amount: item.price,
        quantity: item.quantity
      }))
    };

    // Create the bill in the accounts service
    const createdBill = await accountsService.createBill(billData);
    
    // Return success with the created bill info
    res.status(201).json({
      message: 'Bill created successfully from parsed image',
      billId: createdBill.id,
      parsedData
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;