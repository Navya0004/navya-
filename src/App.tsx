/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Boxes, 
  CalendarRange, 
  Settings as SettingsIcon, 
  CheckCircle, 
  Coins, 
  Hash, 
  Network, 
  ShieldCheck, 
  X,
  FileSpreadsheet
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import ProductsView from './components/ProductsView';
import ReservationsView from './components/ReservationsView';
import SettingsView from './components/SettingsView';
import ErrorToast from './components/ErrorToast';
import ExpiredOverlay from './components/ExpiredOverlay';

import { INITIAL_PRODUCTS, DEFAULT_RESERVATIONS } from './data';
import { Product, ReservationItem, LedgerLog } from './types';
import { supabase } from './lib/supabase';

export default function App() {
  // Navigation active tab State
  const [activeTab, setActiveTab] = useState<'products' | 'reservations' | 'settings'>('products');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const [reservations, setReservations] = useState<ReservationItem[]>(DEFAULT_RESERVATIONS);

  const [logs, setLogs] = useState<LedgerLog[]>(() => [
    {
      id: 'L-001',
      timestamp: new Date(Date.now() - 3600000 * 3).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'STOCK_RELEASED',
      sku: 'KL-OPS-44',
      qty: 120,
      message: 'Released unconfirmed holdings on Optic Routing Core back to public inventory.'
    },
    {
      id: 'L-002',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'RESERVATION_CREATED',
      sku: 'KL-9923-AP',
      qty: 2500,
      message: 'Locked 2,500 units of Alpha-9 Microprocessor in warehouse WH-02.'
    }
  ]);

  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);
  const isInitialLoad = useRef(true);

  // Additional customizable variables
  const [systemStatus, setSystemStatus] = useState<'Operational' | 'Degraded' | 'Maintenance'>('Operational');
  const [lowStockThreshold, setLowStockThreshold] = useState(15);

  // Modals & overlay trigger states
  const [isConflictOpen, setIsConflictOpen] = useState(false);
  const [isExpiredOpen, setIsExpiredOpen] = useState(false);
  const [expiredTitle, setExpiredTitle] = useState('Reservation Expired');
  const [expiredMessage, setExpiredMessage] = useState('');

  // Receipt modal trigger state for successful confirmation
  const [receiptSummary, setReceiptSummary] = useState<{
    isOpen: boolean;
    txHash: string;
    totalUnits: number;
    totalValuation: number;
    tax: number;
  } | null>(null);

  const updateStateRow = async (key: string, value: unknown) => {
    const { error } = await supabase.from('app_state').upsert({ key, value });
    if (error) {
      console.error(`Supabase upsert failed for "${key}":`, error);
    }
  };

  const fetchStateRow = async <T,>(key: string): Promise<T | null> => {
    const { data, error } = await supabase.from('app_state').select('value').eq('key', key);
    if (error) {
      console.error(`Supabase select failed for "${key}":`, error);
      return null;
    }
    return (data?.[0]?.value ?? null) as T | null;
  };

  const loadSupabaseState = async () => {
    try {
      const [productsState, reservationsState, logsState, timeLeftState] = await Promise.all([
        fetchStateRow<Product[]>('products'),
        fetchStateRow<ReservationItem[]>('reservations'),
        fetchStateRow<LedgerLog[]>('logs'),
        fetchStateRow<number>('timeLeft')
      ]);

      if (productsState !== null) setProducts(productsState);
      if (reservationsState !== null) setReservations(reservationsState);
      if (logsState !== null) setLogs(logsState);
      if (timeLeftState !== null) setTimeLeft(timeLeftState);

      if (productsState === null) await updateStateRow('products', INITIAL_PRODUCTS);
      if (reservationsState === null) await updateStateRow('reservations', DEFAULT_RESERVATIONS);
      if (logsState === null) await updateStateRow('logs', logs);
      if (timeLeftState === null) await updateStateRow('timeLeft', 14 * 60 + 59);
    } finally {
      isInitialLoad.current = false;
    }
  };

  useEffect(() => {
    loadSupabaseState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) return;
    updateStateRow('products', products);
  }, [products]);

  useEffect(() => {
    if (isInitialLoad.current) return;
    updateStateRow('reservations', reservations);
  }, [reservations]);

  useEffect(() => {
    if (isInitialLoad.current) return;
    updateStateRow('logs', logs);
  }, [logs]);

  useEffect(() => {
    if (isInitialLoad.current) return;
    updateStateRow('timeLeft', timeLeft);
  }, [timeLeft]);

  // Timed counter effects
  useEffect(() => {
    if (reservations.length === 0) return;

    if (timeLeft <= 0) {
      handleReservationTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, reservations]);

  // Handle countdown timer timeout
  const handleReservationTimeout = () => {
    const totalReservationsCount = reservations.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add transaction log
    addLogEntry(
      'STOCK_RELEASED',
      'SYSTEM',
      totalReservationsCount,
      `Cryptographic hold timed out. Released lock on ${totalReservationsCount.toLocaleString()} total reserved units.`
    );

    // Restore stock levels in main list
    setProducts(prev => {
      return prev.map(p => {
        const matchingReservation = reservations.find(r => r.id === p.id);
        if (matchingReservation) {
          const newReserved = Math.max(0, p.reservedStock - matchingReservation.quantity);
          return { ...p, reservedStock: newReserved };
        }
        return p;
      });
    });

    setReservations([]);
    setTimeLeft(14 * 60 + 59);

    setExpiredTitle('Reservation Expired');
    setExpiredMessage('The stock hold has timed out and reserved items have been returned to the live inventory. Please restart your selection process.');
    setIsExpiredOpen(true);
  };

  // User manually cancels active reservation holdings
  const handleCancelReservation = () => {
    const totalReservationsCount = reservations.reduce((sum, item) => sum + item.quantity, 0);

    addLogEntry(
      'RESERVATION_CANCELED',
      'USER',
      totalReservationsCount,
      `User-prompted ledger cancellation. Restored locks on ${totalReservationsCount.toLocaleString()} active shares.`
    );

    // Restore stock levels in main list
    setProducts(prev => {
      return prev.map(p => {
        const matchingReservation = reservations.find(r => r.id === p.id);
        if (matchingReservation) {
          const newReserved = Math.max(0, p.reservedStock - matchingReservation.quantity);
          return { ...p, reservedStock: newReserved };
        }
        return p;
      });
    });

    setReservations([]);
    setTimeLeft(14 * 60 + 59);

    setExpiredTitle('Reservation Canceled');
    setExpiredMessage('You cancelled the active inventory hold. All quantities have been successfully released back to regional depot balances.');
    setIsExpiredOpen(true);
  };

  // Append new log item helper
  const addLogEntry = (
    type: LedgerLog['type'],
    sku: string,
    qty: number,
    message: string
  ) => {
    const newLog: LedgerLog = {
      id: `L-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      sku,
      qty,
      message
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Reserved novel product action
  const handleReserveProduct = (product: Product) => {
    const reserveAmount = 100; // Book 100 units by default for custom clicks
    const availableStock = product.totalStock - product.reservedStock;

    if (availableStock <= 0) {
      handleTriggerConflict();
      return;
    }

    // Capture safety bounds
    const actualBookAmount = Math.min(reserveAmount, availableStock);

    setReservations(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => {
          if (item.id === product.id) {
            return { ...item, quantity: item.quantity + actualBookAmount };
          }
          return item;
        });
      } else {
        const newRes: ReservationItem = {
          id: product.id,
          name: product.name,
          image: product.image,
          warehouse: product.distribution[0]?.name || 'WH-01 Regional Depot',
          quantity: actualBookAmount,
          priceUnit: product.price
        };
        return [...prev, newRes];
      }
    });

    // Reduce available stock in database state synchronously
    setProducts(prev => {
      return prev.map(p => {
        if (p.id === product.id) {
          return { ...p, reservedStock: p.reservedStock + actualBookAmount };
        }
        return p;
      });
    });

    // Make sure timer resets or stays ticking
    if (reservations.length === 0) {
      setTimeLeft(14 * 60 + 59);
    }

    addLogEntry(
      'RESERVATION_CREATED',
      product.id,
      actualBookAmount,
      `Requested ledger secure lock on ${actualBookAmount.toLocaleString()} units of ${product.name}.`
    );

    // Swap active screen context to checkout reservation immediately
    setActiveTab('reservations');
  };

  // Checkout successful payment simulation
  const handleConfirmPay = (summary: { totalUnits: number; totalPrice: number; finalTax: number }) => {
    // Generate randomized hash
    const blockHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    addLogEntry(
      'RESERVATION_CONFIRMED',
      'VAL-NODE',
      summary.totalUnits,
      `Cryptographic block verification successful. Generated TX hash: ${blockHash.substring(0, 10)}...`
    );

    // Commit holds completely by subtracting total stock levels permanently from main tracking
    setProducts(prev => {
      return prev.map(p => {
        const matchingReservation = reservations.find(r => r.id === p.id);
        if (matchingReservation) {
          const newTotal = Math.max(0, p.totalStock - matchingReservation.quantity);
          const newReserved = Math.max(0, p.reservedStock - matchingReservation.quantity);
          
          let newStatus = p.stockStatus;
          if (newTotal <= 0) {
            newStatus = 'Out of Stock';
          } else if (newTotal <= lowStockThreshold) {
            newStatus = 'Low Stock';
          }

          return {
            ...p,
            totalStock: newTotal,
            reservedStock: newReserved,
            stockStatus: newStatus
          };
        }
        return p;
      });
    });

    // Open transaction receipt report
    setReceiptSummary({
      isOpen: true,
      txHash: blockHash,
      totalUnits: summary.totalUnits,
      totalValuation: summary.totalPrice,
      tax: summary.finalTax
    });

    // Reset checkout basket
    setReservations([]);
    setTimeLeft(14 * 60 + 59);
  };

  // Mock conflict error states trigger
  const handleTriggerConflict = () => {
    setIsConflictOpen(true);
    addLogEntry(
      'CONFLICT_ERROR',
      'KL-VFC-7',
      1,
      'Concurrent validator collision detected. Item locked by separate ledger authority node.'
    );
  };

  // Reset database stocks
  const handleResetStocks = () => {
    setProducts(INITIAL_PRODUCTS);
    setReservations(DEFAULT_RESERVATIONS);
    setTimeLeft(14 * 60 + 59);
    addLogEntry(
      'STOCK_RELEASED',
      'CORE',
      0,
      'Administrative database cold-start initiated. Reconfigured baseline stock matrices.'
    );
  };

  // Re-establish template reservations basket
  const handleLoadDemoReservations = () => {
    setReservations(DEFAULT_RESERVATIONS);
    setTimeLeft(14 * 60 + 59);
    
    // Ensure template items also match products reserved stock
    setProducts(prev => {
      return prev.map(p => {
        if (p.id === 'KL-9923-AP') {
          return { ...p, reservedStock: 300 };
        }
        if (p.id === 'KL-1142-TC') {
          return { ...p, reservedStock: 80 };
        }
        return p;
      });
    });

    addLogEntry(
      'RESERVATION_CREATED',
      'TEMPLATE',
      2980,
      'Loaded demo transaction template matching originalMaterial specifications.'
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9ff]">
      {/* App brand Header panel */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        reservationCount={reservations.length}
      />

      {/* Main Canvas Context */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <ProductsView 
                products={products}
                onReserve={handleReserveProduct}
                onUnavailableTrigger={handleTriggerConflict}
              />
            </motion.div>
          )}

          {activeTab === 'reservations' && (
            <motion.div
              key="reservations"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <ReservationsView
                reservations={reservations}
                setReservations={setReservations}
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                onCancel={handleCancelReservation}
                onConfirm={handleConfirmPay}
                setActiveTab={setActiveTab}
                resetReservationsToTemplate={handleLoadDemoReservations}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <SettingsView 
                logs={logs}
                onClearLogs={() => setLogs([])}
                onResetDatabase={handleResetStocks}
                userEmail="vuyyurunavya123@gmail.com"
                systemStatus={systemStatus}
                setSystemStatus={setSystemStatus}
                lowStockThreshold={lowStockThreshold}
                setLowStockThreshold={setLowStockThreshold}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Interactive feedback modules */}
      <ErrorToast 
        isOpen={isConflictOpen}
        onClose={() => setIsConflictOpen(false)}
        onRefresh={() => {
          setIsConflictOpen(false);
          handleResetStocks();
        }}
      />

      <ExpiredOverlay
        isOpen={isExpiredOpen}
        title={expiredTitle}
        message={expiredMessage}
        onRefresh={() => {
          setIsExpiredOpen(false);
          setActiveTab('products');
        }}
      />

      {/* Success Receipt Dialog */}
      <AnimatePresence>
        {receiptSummary && receiptSummary.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#001c30]/70 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative border border-emerald-100 overflow-hidden"
            >
              {/* Top ambient status ring background banner */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>

              <button 
                onClick={() => setReceiptSummary(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                title="Close report window"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6 pt-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-xs">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="font-sans font-extrabold text-xl md:text-2xl text-[#0b1c30]">
                  Cryptographic Lock Appended
                </h3>
                <p className="text-xs text-[#565e74] mt-1 leading-normal max-w-xs mx-auto">
                  Payment confirmed. Validation key signature is permanently inscribed on Node Ledger matrix.
                </p>
              </div>

              {/* Data specifications and credentials of receipt */}
              <div className="bg-[#f8f9ff] border border-[#e5eeff] p-5 rounded-xl space-y-3.5 mb-6 text-xs text-[#0b1c30] font-sans">
                <div className="flex justify-between items-center pb-2 border-b border-[#e5eeff]/60">
                  <span className="text-[#777587] font-semibold flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-[#3525cd]" />
                    Ledger Tx Hash:
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#3525cd] bg-[#dae2fd] px-2 py-0.5 rounded">
                    {receiptSummary.txHash.substring(0, 16)}...
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#e5eeff]/60">
                  <span className="text-[#777587] font-semibold flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#3525cd]" />
                    Total Verified Load:
                  </span>
                  <span className="font-mono font-bold">
                    {receiptSummary.totalUnits.toLocaleString()} Units
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#e5eeff]/60">
                  <span className="text-[#777587] font-semibold flex items-center gap-1">
                    <Network className="w-3.5 h-3.5 text-[#3525cd]" />
                    Assigned Hub Signers:
                  </span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    4/4 Nodes Concord
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 font-semibold">
                  <span className="text-[#0b1c30] font-bold flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-[#3525cd]" />
                    Settled Valuation (Fully Taxed):
                  </span>
                  <span className="font-mono text-base font-bold text-[#3525cd]">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(receiptSummary.totalValuation)}
                  </span>
                </div>
              </div>

              {/* Close helper button */}
              <button
                type="button"
                onClick={() => setReceiptSummary(null)}
                className="w-full bg-[#3525cd] hover:bg-[#4f46e5] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md active:scale-97"
              >
                Close Statement Summary
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global standard Status Footer */}
      <Footer systemStatus={systemStatus === 'Operational' ? 'Operational' : systemStatus === 'Degraded' ? 'Operational' : 'Maintenance'} />

      {/* Persistent Bottom Navigation Drawer (Mobile Viewports ONLY) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#c7c4d8]/40 shadow-lg px-4 flex justify-around items-center h-16 select-none">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
            activeTab === 'products' ? 'text-[#3525cd] font-bold scale-102' : 'text-[#777587]'
          }`}
        >
          <Boxes className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wide">Products</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
            activeTab === 'reservations' ? 'text-[#3525cd] font-bold scale-102' : 'text-[#777587]'
          }`}
        >
          <CalendarRange className="w-5 h-5" />
          {reservations.length > 0 && (
            <span className="absolute top-2 right-6 bg-red-600 text-white font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center p-0.5 border border-white">
              {reservations.length}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wide">Holdings</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
            activeTab === 'settings' ? 'text-[#3525cd] font-bold scale-102' : 'text-[#777587]'
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wide">Configs</span>
        </button>
      </nav>
    </div>
  );
}
