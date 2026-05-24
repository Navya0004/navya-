/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CalendarRange, Ban, MapPin } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onReserve: (product: Product) => void;
  onUnavailableTrigger: () => void;
}

export default function ProductCard({ product, onReserve, onUnavailableTrigger }: ProductCardProps): React.JSX.Element {
  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const isLowStock = product.stockStatus === 'Low Stock';
  
  // Format currency helper
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      whileHover={{ y: -4 }}
      className={`bg-white border rounded-2xl overflow-hidden flex flex-col h-full transition-shadow duration-300 ${
        isOutOfStock 
          ? 'border-red-200 shadow-sm opacity-90' 
          : 'border-[#e5eeff] hover:shadow-lg hover:border-[#3525cd]/40'
      }`}
    >
      {/* Product Image Panel */}
      <div className="relative h-48 overflow-hidden bg-[#eff4ff]">
        <img 
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isOutOfStock ? 'grayscale-[0.4] contrast-75' : 'group-hover:scale-105'
          }`}
          referrerPolicy="no-referrer"
          alt={product.name}
          src={product.image}
        />
        {/* Dynamic stock badges */}
        <div className="absolute top-4 right-4">
          {product.stockStatus === 'High Stock' && (
            <span className="bg-emerald-100/90 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm backdrop-blur-sm border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              High Stock
            </span>
          )}
          {product.stockStatus === 'Low Stock' && (
            <span className="bg-amber-100/90 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm backdrop-blur-sm border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Low Stock
            </span>
          )}
          {product.stockStatus === 'Out of Stock' && (
            <span className="bg-rose-100/90 text-rose-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm backdrop-blur-sm border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Main product card description */}
      <div className="p-5 flex-grow flex flex-col">
        {/* ID, Model, Price */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30] tracking-tight hover:text-[#3525cd] transition-colors">
              {product.name}
            </h3>
            <p className="font-mono text-xs text-[#777587] mt-0.5" title="Unique ledger SKU reference">
              SKU: {product.id}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#3525cd]">
              {formatPrice(product.price)}
            </p>
            <p className="text-[10px] uppercase tracking-wide font-bold text-[#777587]">
              per unit
            </p>
          </div>
        </div>

        {/* Short info */}
        <p className="text-sm text-[#464555] mb-5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Warehouse distribution mapping */}
        <div className="space-y-2 mb-5">
          <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-[#777587]">
            <span>Warehouse Distribution</span>
            <span>Stock Qty</span>
          </div>
          {product.distribution.map((dist, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-center px-3 py-2 bg-[#f8f9ff] rounded-lg border border-transparent hover:border-[#c7c4d8]/40 transition-all duration-200"
            >
              <span className="flex items-center gap-1.5 text-xs text-[#0b1c30]">
                <MapPin className="w-3.5 h-3.5 text-[#3525cd]" />
                {dist.name}
              </span>
              <span className="font-mono text-xs font-bold text-[#0b1c30]">
                {dist.stock}
              </span>
            </div>
          ))}
        </div>

        {/* Divider line before inventory total box */}
        <div className="mt-auto">
          {/* Reservation stats box */}
          <div className={`p-3.5 rounded-xl flex justify-between items-center ${
            isOutOfStock 
              ? 'bg-red-50 text-red-900 border border-red-100' 
              : isLowStock 
                ? 'bg-amber-50 text-amber-900 border border-amber-100' 
                : 'bg-[#e5eeff] text-[#3323cc] border border-[#d3e4fe]'
          }`}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">Available Stock</p>
              <p className="text-xl font-extrabold font-mono leading-none mt-1">
                {product.totalStock - product.reservedStock}
              </p>
            </div>
            <div className="text-right text-[11px] opacity-75 font-medium leading-normal space-y-0.5">
              <p>Total: {product.totalStock}</p>
              <p>Reserved: {product.reservedStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="px-5 pb-5 pt-1">
        {isOutOfStock ? (
          <button 
            type="button"
            onClick={onUnavailableTrigger}
            className="w-full bg-[#565e74] text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Ban className="w-4 h-4" />
            UNAVAILABLE
          </button>
        ) : (
          <button 
            type="button"
            onClick={() => onReserve(product)}
            className="w-full bg-[#3525cd] hover:bg-[#4f46e5] text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
          >
            <CalendarRange className="w-4 h-4" />
            RESERVE NOW
          </button>
        )}
      </div>
    </motion.div>
  );
}
