/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WarehouseHub {
  name: string;
  stock: number;
}

export interface Product {
  id: string; // SKU
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stockStatus: 'High Stock' | 'Low Stock' | 'Out of Stock';
  distribution: WarehouseHub[];
  totalStock: number;
  reservedStock: number;
}

export interface ReservationItem {
  id: string; // SKU
  name: string;
  image: string;
  warehouse: string;
  quantity: number;
  priceUnit: number;
}

export interface LedgerLog {
  id: string;
  timestamp: string;
  type: 'RESERVATION_CREATED' | 'RESERVATION_CONFIRMED' | 'RESERVATION_CANCELED' | 'STOCK_RELEASED' | 'CONFLICT_ERROR';
  sku: string;
  qty: number;
  message: string;
}
