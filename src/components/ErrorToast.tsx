/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon, RefreshCw, X } from 'lucide-react';

interface ErrorToastProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ErrorToast({ isOpen, onClose, onRefresh }: ErrorToastProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 max-w-md w-full"
        >
          <div className="bg-[#213145] text-[#eaf1ff] p-5 rounded-2xl shadow-2xl border-l-4 border-[#ba1a1a] flex gap-4 overflow-hidden relative">
            {/* Warning indicator */}
            <div className="p-2 bg-[#ffdad6] text-[#ba1a1a] rounded-xl self-start flex-shrink-0 animate-bounce">
              <AlertOctagon className="w-5 h-5" />
            </div>

            {/* Error Message Details */}
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <h4 className="font-sans font-bold text-base text-[#ffdad6] tracking-tight">
                  409: Conflict Error
                </h4>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-1 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="font-sans text-xs text-[#eaf1ff] opacity-90 mt-1.5 leading-relaxed">
                Insufficient stock available to complete this reservation. The items have been reserved by another coordinator in real-time. Please refresh the inventory feed.
              </p>
              
              {/* Interaction handlers */}
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={onRefresh}
                  className="bg-[#3525cd] hover:bg-[#4f46e5] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
                  Refresh Data
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#eaf1ff] hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
