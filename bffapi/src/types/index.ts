import { Request } from 'express';

// Extend Express Request for file uploads
export interface FileRequest extends Request {
  file?: Express.Multer.File;
}

// Bill related types
export interface BillItem {
  id?: number;
  bill_id?: number;
  name: string;
  description?: string;
  amount: number;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface Bill {
  id: number;
  title: string;
  description?: string;
  total: number;
  due_date: string;
  paid: boolean;
  items?: BillItem[];
  item_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BillInput {
  title: string;
  description?: string;
  due_date?: string;
  paid?: boolean;
  items?: {
    name: string;
    description?: string;
    amount: number;
    quantity?: number;
  }[];
}

// Bill Parser related types
export interface ParsedReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ParsedReceipt {
  items: ParsedReceiptItem[];
  total: number;
  currency?: string;
  date?: string;
  merchant?: string;
}

// Error interface
export interface ServiceError {
  statusCode: number;
  message: string;
  details?: unknown;
}