/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Timer, Hash, ShieldCheck, XCircle, ChevronRight, ShoppingBag, Plus, Minus, Lock } from 'lucide-react';
import { ReservationItem } from '../types';

interface ReservationsViewProps {
  reservations: ReservationItem[];
  setReservations: React.Dispatch<React.SetStateAction<ReservationItem[]>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  onCancel: () => void;
  onConfirm: (summary: { totalUnits: number; totalPrice: number; finalTax: number }) => void;
  setActiveTab: (tab: 'products' | 'reservations' | 'settings') => void;
  resetReservationsToTemplate: () => void;
}

export default function ReservationsView({
  reservations,
  setReservations,
  timeLeft,
  setTimeLeft,
  onCancel,
  onConfirm,
  setActiveTab,
  resetReservationsToTemplate
}: ReservationsViewProps) {
  
  // Format MM:SS representation of countdown clock
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Adjust product reservation volume
  const updateQuantity = (sku: string, delta: number) => {
    setReservations(prev => {
      return prev.map(item => {
        if (item.id === sku) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Remove a particular item
  const removeItem = (sku: string) => {
    setReservations(prev => prev.filter(item => item.id !== sku));
  };

  // Calculate dynamic variables
  const countSummary = () => {
    const totalUnits = reservations.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalPrice = reservations.reduce((sum, item) => sum + (item.quantity * item.priceUnit), 0);
    // Real-time tax computation formula
    const finalTax = subtotalPrice * 0.08 || 1240.00; // default template tax if preset
    const totalPrice = subtotalPrice + finalTax;
    return { totalUnits, subtotalPrice, finalTax, totalPrice };
  };

  const { totalUnits, finalTax, totalPrice } = countSummary();

  const isTimerCritical = timeLeft < 300; // Less than 5 minutes

  // Format currency helper
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="w-full">
      {/* Focused Header banner */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
          Complete Your Reservation
        </h1>
        <p className="text-[#464555] text-sm md:text-base mt-2 max-w-xl mx-auto leading-relaxed">
          Review your inventory lock and confirm your order details.
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center bg-white border border-[#e5eeff] rounded-2xl p-16 max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 bg-[#eff4ff] text-[#3525cd] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <p className="text-[#0b1c30] font-bold text-lg">No active reservations found</p>
          <p className="text-xs text-[#777587] mt-1.5 max-w-sm mx-auto leading-relaxed">
            Your ledger holds are empty. Navigate to the Inventory sheet to reserve high-velocity hardware parts before they release!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-8 justify-center">
            <button
              onClick={() => setActiveTab('products')}
              className="bg-[#3525cd] hover:bg-[#4f46e5] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm active:scale-97"
            >
              Browse Global Inventory
            </button>
            <button
              onClick={resetReservationsToTemplate}
              className="border border-[#c7c4d8] text-[#565e74] hover:bg-[#f8f9ff] px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer active:scale-97"
            >
              Load Demo Reservation
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-5xl mx-auto">
          {/* Reservation Timer Card (Left panel) */}
          <div className="md:col-span-5 bg-white border border-[#e5eeff] rounded-2xl p-6 flex flex-col items-center justify-center shadow-xs h-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#dae2fd]"></div>
            
            <span className="text-[10px] font-bold tracking-widest text-[#777587] uppercase">
              Stock Released In
            </span>
            
            <div className={`font-mono text-5xl font-extrabold tracking-tight py-6 select-none ${
              isTimerCritical ? 'text-[#ba1a1a] animate-pulse' : 'text-[#3525cd]'
            }`}>
              {formatTime(timeLeft)}
            </div>

            <div className="flex items-center gap-1.5 text-[#565e74] mt-2 bg-[#f8f9ff] px-4 py-2 rounded-xl border border-[#e5eeff]">
              <Lock className={`w-4 h-4 ${isTimerCritical ? 'text-[#ba1a1a]' : 'text-[#3525cd]'}`} />
              <span className="text-xs font-semibold">Inventory is temporarily held</span>
            </div>
            
            <p className="text-[11px] text-[#777587] mt-6 max-w-[200px] leading-relaxed">
              Upon session expiry, locked shares are instantly reclaimed by regional node validators.
            </p>
          </div>

          {/* Reserved Items Details (Right panel) */}
          <div className="md:col-span-7 bg-white border border-[#e5eeff] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-[#e5eeff] pb-3">
                <h3 className="text-base font-bold text-[#0b1c30]">Reserved Items</h3>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  LOCK ACTIVE
                </span>
              </div>

              {/* Items loop */}
              <div className="space-y-5">
                {reservations.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-start gap-4 pt-4 first:pt-0 border-t first:border-0 border-[#e5eeff]/50"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail wrapper */}
                      <div className="w-16 h-16 rounded-xl bg-[#eff4ff] overflow-hidden flex-shrink-0 border border-[#c7c4d8]/40 shadow-xs relative group-hover:border-[#3525cd]/40">
                        <img 
                          className="w-full h-full object-cover transition-transform hover:scale-105" 
                          referrerPolicy="no-referrer"
                          alt={item.name} 
                          src={item.image}
                        />
                      </div>
                      
                      {/* Identification strings */}
                      <div>
                        <h4 className="text-sm font-bold text-[#0b1c30]">{item.name}</h4>
                        <p className="text-xs text-[#565e74] mt-0.5" title="Associated storage depot">
                          Depot: {item.warehouse}
                        </p>
                        <p className="font-mono text-[11px] text-[#777587] mt-0.5">
                          SKU: {item.id}
                        </p>
                        <p className="text-xs font-bold text-[#3525cd] mt-1">
                          {formatPrice(item.priceUnit)} <span className="text-[10px] text-[#777587] font-normal">ea</span>
                        </p>
                      </div>
                    </div>

                    {/* Numeric Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-[#c7c4d8]/60 rounded-xl bg-[#f8f9ff] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 px-2 hover:bg-[#e5eeff] text-[#565e74] hover:text-[#3525cd] transition-all cursor-pointer"
                          title="Reduce quantities"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-[#0b1c30] select-none min-w-[36px] text-center">
                          {item.quantity.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 px-2 hover:bg-[#e5eeff] text-[#565e74] hover:text-[#3525cd] transition-all cursor-pointer"
                          title="Increase quantities"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {/* Delete action wrapper */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[11px] text-[#ba1a1a] font-semibold hover:underline bg-transparent border-0 outline-none cursor-pointer"
                        title="Remove held position"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtotaling Summary section */}
            <div className="mt-8 pt-6 border-t border-[#c7c4d8]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs text-[#565e74] font-medium uppercase tracking-wide">Reserved Weight</p>
                <p className="text-[22px] font-extrabold text-[#3525cd] font-mono leading-none mt-1">
                  {totalUnits.toLocaleString()} <span className="text-sm font-sans font-bold text-[#565e74]">Units</span>
                </p>
              </div>

              <div className="text-right flex flex-col sm:items-end gap-1 w-full sm:w-auto">
                <div className="flex justify-between sm:justify-start items-center gap-8 w-full">
                  <span className="text-xs text-[#565e74] font-medium">Estimated Tax (8%):</span>
                  <span className="font-mono text-sm font-bold text-[#0b1c30]">
                    {formatPrice(finalTax)}
                  </span>
                </div>
                <div className="flex justify-between sm:justify-start items-center gap-8 w-full pt-1.5 border-t border-[#e5eeff] sm:border-0">
                  <span className="text-xs text-[#0b1c30] font-bold">Total Valuation:</span>
                  <span className="font-mono text-lg font-bold text-[#3525cd]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons (Span full desktop grid cols) */}
          <div className="md:col-span-12 flex flex-col sm:flex-row gap-3 justify-end mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-[#c7c4d8] text-[#565e74] hover:bg-[#eff4ff] hover:text-[#3525cd] font-bold text-xs uppercase tracking-higher rounded-xl transition-all cursor-pointer shadow-xs active:scale-97"
            >
              <XCircle className="w-4 h-4" />
              Cancel Reservation
            </button>
            <button
              type="button"
              onClick={() => onConfirm({ totalUnits, totalPrice, finalTax })}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3525cd] hover:bg-[#4f46e5] text-white font-bold text-xs uppercase tracking-higher rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group active:scale-97"
            >
              <ShieldCheck className="w-4 h-4" />
              Confirm &amp; Pay
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
